using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.DTOs.UsTax;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Services;

public class UsTaxService : IUsTaxService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ILogger<UsTaxService> _logger;

    public UsTaxService(
        IApplicationDbContext dbContext,
        ILogger<UsTaxService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<UsTaxSummaryDto> GetTaxSummaryAsync(Guid propertyId, int year)
    {
        var property = await _dbContext.Properties
            .Include(p => p.Jurisdiction)
            .FirstOrDefaultAsync(p => p.Id == propertyId.ToString())
            ?? throw new InvalidOperationException($"Property {propertyId} not found.");

        var taxRecords = await _dbContext.UsTaxRecords
            .Where(r => r.PropertyId == propertyId.ToString()
                && r.TaxPeriodStart.Year == year)
            .ToListAsync();

        var bookedNights = await _dbContext.BookedNights
            .Where(b => b.PropertyId == propertyId.ToString()
                && b.NightDate.Year == year)
            .ToListAsync();

        var totalRevenue = bookedNights.Sum(b => b.GrossRevenueCents) / 100m;
        var taxRate = property.Jurisdiction?.TotRatePct ?? 0m;
        var totalTaxOwed = totalRevenue * (taxRate / 100m);
        var totalTaxPaid = taxRecords
            .Where(r => r.FiledAt != null)
            .Sum(r => r.TaxOwedCents) / 100m;
        var platformRemitted = taxRecords.Sum(r => r.PlatformRemittedCents) / 100m;

        var balance = totalTaxOwed - totalTaxPaid - platformRemitted;
        var taxType = taxRecords.Any() ? taxRecords.First().TaxType.ToString().ToLowerInvariant() : "tot";

        var status = balance switch
        {
            <= 0 when totalTaxOwed > 0 => "paid",
            > 0 when totalTaxPaid > 0 => "partial",
            > 0 => "unpaid",
            _ => "no_tax_due"
        };

        return new UsTaxSummaryDto(
            PropertyId: propertyId,
            Year: year,
            TaxType: taxType,
            TaxRate: taxRate,
            TotalRevenue: totalRevenue,
            TotalTaxOwed: totalTaxOwed,
            TotalTaxPaid: totalTaxPaid + platformRemitted,
            Balance: balance,
            Status: status
        );
    }

    public async Task<UsTaxRecordDto> RecordTaxPaymentAsync(Guid propertyId, CreateUsTaxRecordRequest request)
    {
        var property = await _dbContext.Properties
            .Include(p => p.Jurisdiction)
            .FirstOrDefaultAsync(p => p.Id == propertyId.ToString())
            ?? throw new InvalidOperationException($"Property {propertyId} not found.");

        var taxType = ParseTaxType(request.TaxType);
        var periodDates = ParsePeriod(request.Period, request.PaidDate.Year);

        var record = new UsTaxRecord
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = property.OrganisationId,
            PropertyId = propertyId.ToString(),
            JurisdictionId = property.JurisdictionId ?? "",
            TaxPeriodStart = periodDates.start,
            TaxPeriodEnd = periodDates.end,
            TaxType = taxType,
            TaxOwedCents = (int)(request.Amount * 100),
            FiledAt = request.PaidDate,
            FilingReference = request.Reference,
            Status = TaxFilingStatus.Filed,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.UsTaxRecords.Add(record);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Recorded US tax payment of {Amount} for property {PropertyId}", request.Amount, propertyId);

        return new UsTaxRecordDto(
            Id: Guid.Parse(record.Id),
            PropertyId: propertyId,
            TaxType: request.TaxType,
            Period: request.Period,
            Amount: request.Amount,
            PaidDate: request.PaidDate,
            Reference: request.Reference,
            CreatedAt: record.CreatedAt
        );
    }

    public async Task<List<UsTaxRecordDto>> GetTaxHistoryAsync(Guid propertyId)
    {
        var records = await _dbContext.UsTaxRecords
            .Where(r => r.PropertyId == propertyId.ToString())
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return records.Select(r => new UsTaxRecordDto(
            Id: Guid.Parse(r.Id),
            PropertyId: propertyId,
            TaxType: r.TaxType.ToString().ToLowerInvariant(),
            Period: $"{r.TaxPeriodStart:yyyy-MM-dd} to {r.TaxPeriodEnd:yyyy-MM-dd}",
            Amount: r.TaxOwedCents / 100m,
            PaidDate: r.FiledAt ?? r.CreatedAt,
            Reference: r.FilingReference,
            CreatedAt: r.CreatedAt
        )).ToList();
    }

    private static UsTaxType ParseTaxType(string taxType)
    {
        return taxType.ToLowerInvariant() switch
        {
            "tot" or "occupancy_tax" => UsTaxType.Tot,
            "sales_tax" => UsTaxType.SalesTax,
            "county_occupancy" => UsTaxType.CountyOccupancy,
            "city_tax" => UsTaxType.CityTax,
            _ => UsTaxType.Other
        };
    }

    private static (DateOnly start, DateOnly end) ParsePeriod(string period, int defaultYear)
    {
        // Try to parse period like "Q1 2024", "2024-01", "January 2024", etc.
        var upper = period.ToUpperInvariant().Trim();

        if (upper.StartsWith("Q"))
        {
            var parts = upper.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var quarter = int.Parse(parts[0].Replace("Q", ""));
            var year = parts.Length > 1 ? int.Parse(parts[1]) : defaultYear;
            var startMonth = (quarter - 1) * 3 + 1;
            var start = new DateOnly(year, startMonth, 1);
            var end = start.AddMonths(3).AddDays(-1);
            return (start, end);
        }

        // Default to full year
        return (new DateOnly(defaultYear, 1, 1), new DateOnly(defaultYear, 12, 31));
    }
}
