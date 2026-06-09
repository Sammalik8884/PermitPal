using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.NightCaps;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Services;

/// <summary>
/// Implements INightCapService — manages night cap tracking, booked nights, and recalculation.
/// </summary>
public class NightCapService : INightCapService
{
    private readonly IApplicationDbContext _dbContext;

    public NightCapService(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<NightCapRecord> GetOrCreateRecordAsync(string propertyId, short year)
    {
        var record = await _dbContext.NightCapRecords
            .FirstOrDefaultAsync(r => r.PropertyId == propertyId && r.CalendarYear == year);

        if (record != null)
            return record;

        var property = await _dbContext.Properties
            .Include(p => p.Jurisdiction)
            .FirstOrDefaultAsync(p => p.Id == propertyId);

        if (property == null)
            throw new InvalidOperationException($"Property {propertyId} not found.");

        int? capLimit = property.HostedType == HostedType.Hosted
            ? property.Jurisdiction?.NightCapHosted
            : property.Jurisdiction?.NightCapUnhosted;

        record = new NightCapRecord
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = property.OrganisationId,
            PropertyId = propertyId,
            CalendarYear = year,
            CapLimit = capLimit,
            NightsUsed = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.NightCapRecords.Add(record);
        await _dbContext.SaveChangesAsync();

        return record;
    }

    public async Task UpdateNightCountAsync(string propertyId, short year)
    {
        await RecalculateNightsAsync(propertyId, year);
    }

    public async Task CheckAlertsAsync(string propertyId, short year)
    {
        var record = await GetOrCreateRecordAsync(propertyId, year);

        if (record.CapLimit == null || record.CapLimit == 0)
            return;

        decimal pct = (decimal)record.NightsUsed / record.CapLimit.Value * 100;

        if (pct >= 100 && !record.Alerted100Pct)
        {
            record.Alerted100Pct = true;
            record.UpdatedAt = DateTime.UtcNow;
        }
        else if (pct >= 90 && !record.Alerted90Pct)
        {
            record.Alerted90Pct = true;
            record.UpdatedAt = DateTime.UtcNow;
        }
        else if (pct >= 80 && !record.Alerted80Pct)
        {
            record.Alerted80Pct = true;
            record.UpdatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task<NightCapSummaryDto> GetNightCapSummaryAsync(string propertyId, short year)
    {
        var record = await GetOrCreateRecordAsync(propertyId, year);

        int? nightsRemaining = record.CapLimit.HasValue
            ? Math.Max(0, record.CapLimit.Value - record.NightsUsed)
            : null;

        decimal percentage = record.CapLimit.HasValue && record.CapLimit.Value > 0
            ? Math.Round((decimal)record.NightsUsed / record.CapLimit.Value * 100, 1)
            : 0;

        string status;
        if (record.CapLimit.HasValue && record.NightsUsed >= record.CapLimit.Value)
            status = "exceeded";
        else if (percentage >= 80)
            status = "warning";
        else
            status = "ok";

        return new NightCapSummaryDto(
            PropertyId: propertyId,
            PropertyName: record.Property?.Name ?? "Unknown Property",
            JurisdictionName: record.Property?.Jurisdiction?.Name ?? "Unknown Jurisdiction",
            Year: year,
            NightCap: record.CapLimit ?? 0,
            NightsUsed: record.NightsUsed,
            NightsRemaining: nightsRemaining,
            Percentage: percentage,
            Status: status
        );
    }

    public async Task<List<NightCapSummaryDto>> GetNightCapSummariesAsync(string organisationId, short year)
    {
        // For now, ignore organisationId as properties don't seem to have it directly mapped in the basic schema,
        // but we'll fetch all properties for now. Or we can just get all records for the year.
        var records = await _dbContext.NightCapRecords
            .Include(r => r.Property)
            .ThenInclude(p => p.Jurisdiction)
            .Where(r => r.CalendarYear == year)
            .ToListAsync();

        var summaries = new List<NightCapSummaryDto>();
        foreach (var record in records)
        {
            int? nightsRemaining = record.CapLimit.HasValue
                ? Math.Max(0, record.CapLimit.Value - record.NightsUsed)
                : null;

            decimal percentage = record.CapLimit.HasValue && record.CapLimit.Value > 0
                ? Math.Round((decimal)record.NightsUsed / record.CapLimit.Value * 100, 1)
                : 0;

            string status;
            if (record.CapLimit.HasValue && record.NightsUsed >= record.CapLimit.Value)
                status = "exceeded";
            else if (percentage >= 80)
                status = "warning";
            else
                status = "ok";

            summaries.Add(new NightCapSummaryDto(
                PropertyId: record.PropertyId,
                PropertyName: record.Property?.Name ?? "Unknown Property",
                JurisdictionName: record.Property?.Jurisdiction?.Name ?? "Unknown Jurisdiction",
                Year: year,
                NightCap: record.CapLimit ?? 0,
                NightsUsed: record.NightsUsed,
                NightsRemaining: nightsRemaining,
                Percentage: percentage,
                Status: status
            ));
        }

        return summaries;
    }

    public async Task RecalculateNightsAsync(string propertyId, short year)
    {
        var record = await GetOrCreateRecordAsync(propertyId, year);

        var startDate = new DateOnly(year, 1, 1);
        var endDate = new DateOnly(year, 12, 31);

        var nightCount = await _dbContext.BookedNights
            .CountAsync(bn => bn.PropertyId == propertyId
                && bn.NightDate >= startDate
                && bn.NightDate <= endDate);

        record.NightsUsed = nightCount;
        record.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<BookedNightDto>> GetBookedNightsAsync(string propertyId, short year, int month)
    {
        var startDate = new DateOnly(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        var nights = await _dbContext.BookedNights
            .Where(bn => bn.PropertyId == propertyId
                && bn.NightDate >= startDate
                && bn.NightDate <= endDate)
            .OrderBy(bn => bn.NightDate)
            .Select(bn => new BookedNightDto(
                bn.Id,
                bn.NightDate,
                bn.Source.ToString().ToLower(),
                bn.BookingRef,
                bn.ICalUid
            ))
            .ToListAsync();

        return nights;
    }

    public async Task AddManualNightsAsync(string propertyId, string organisationId, List<DateOnly> dates, string? guestName)
    {
        foreach (var date in dates)
        {
            // Check if a booked night already exists for this date
            var exists = await _dbContext.BookedNights
                .AnyAsync(bn => bn.PropertyId == propertyId && bn.NightDate == date);

            if (!exists)
            {
                var bookedNight = new BookedNight
                {
                    Id = Guid.NewGuid().ToString(),
                    OrganisationId = organisationId,
                    PropertyId = propertyId,
                    NightDate = date,
                    Source = BookingSource.Manual,
                    BookingRef = guestName,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.BookedNights.Add(bookedNight);
            }
        }

        await _dbContext.SaveChangesAsync();

        // Recalculate for each affected year
        var years = dates.Select(d => (short)d.Year).Distinct();
        foreach (var year in years)
        {
            await RecalculateNightsAsync(propertyId, year);
        }
    }
}
