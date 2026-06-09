using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.DTOs.AuCompliance;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Services;

public class AuComplianceService : IAuComplianceService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ILogger<AuComplianceService> _logger;

    public AuComplianceService(
        IApplicationDbContext dbContext,
        ILogger<AuComplianceService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    // --- Levy Management ---

    public async Task<AuLevySummaryDto> GetLevySummaryAsync(Guid propertyId, int year)
    {
        var property = await _dbContext.Properties
            .FirstOrDefaultAsync(p => p.Id == propertyId.ToString())
            ?? throw new InvalidOperationException($"Property {propertyId} not found.");

        var levyRecords = await _dbContext.AuLevyRecords
            .Where(r => r.PropertyId == propertyId.ToString() && r.CalendarYear == year)
            .ToListAsync();

        var totalNights = await _dbContext.BookedNights
            .Where(b => b.PropertyId == propertyId.ToString() && b.NightDate.Year == year)
            .CountAsync();

        // Default levy rate per night (varies by state, using a default)
        var levyRatePerNight = levyRecords.Any()
            ? levyRecords.First().LevyRatePct
            : 7.5m;

        var totalOwed = totalNights * levyRatePerNight;
        var totalPaid = levyRecords
            .Where(r => r.LodgedAt != null)
            .Sum(r => r.LevyAmountCents / 100m);

        var balance = totalOwed - totalPaid;

        var status = balance switch
        {
            <= 0 when totalOwed > 0 => "paid",
            > 0 when totalPaid > 0 => "partial",
            > 0 => "unpaid",
            _ => totalPaid > totalOwed ? "overpaid" : "paid"
        };

        return new AuLevySummaryDto(
            PropertyId: propertyId,
            Year: year,
            TotalNights: totalNights,
            LevyRatePerNight: levyRatePerNight,
            TotalOwed: totalOwed,
            TotalPaid: totalPaid,
            Balance: balance,
            Status: status
        );
    }

    public async Task<AuLevyRecordDto> RecordLevyPaymentAsync(Guid propertyId, decimal amount, DateTime paidDate, string? reference)
    {
        var property = await _dbContext.Properties
            .FirstOrDefaultAsync(p => p.Id == propertyId.ToString())
            ?? throw new InvalidOperationException($"Property {propertyId} not found.");

        var record = new AuLevyRecord
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = property.OrganisationId,
            PropertyId = propertyId.ToString(),
            StateCode = property.StateRegion ?? "NSW",
            Quarter = (byte)((paidDate.Month - 1) / 3 + 1),
            CalendarYear = (short)paidDate.Year,
            LevyAmountCents = (int)(amount * 100),
            LodgedAt = paidDate,
            LodgementReference = reference,
            Status = LevyStatus.Lodged,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.AuLevyRecords.Add(record);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Recorded levy payment of {Amount} for property {PropertyId}", amount, propertyId);

        return new AuLevyRecordDto(
            Id: Guid.Parse(record.Id),
            PropertyId: propertyId,
            Amount: amount,
            PaidDate: paidDate,
            Reference: reference,
            Period: $"Q{record.Quarter} {record.CalendarYear}",
            CreatedAt: record.CreatedAt
        );
    }

    public async Task<List<AuLevyRecordDto>> GetLevyHistoryAsync(Guid propertyId)
    {
        var records = await _dbContext.AuLevyRecords
            .Where(r => r.PropertyId == propertyId.ToString())
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return records.Select(r => new AuLevyRecordDto(
            Id: Guid.Parse(r.Id),
            PropertyId: propertyId,
            Amount: r.LevyAmountCents / 100m,
            PaidDate: r.LodgedAt ?? r.CreatedAt,
            Reference: r.LodgementReference,
            Period: $"Q{r.Quarter} {r.CalendarYear}",
            CreatedAt: r.CreatedAt
        )).ToList();
    }

    // --- Fire Safety ---

    public async Task<AuFireSafetyDto> GetFireSafetyStatusAsync(Guid propertyId)
    {
        var record = await _dbContext.AuFireSafetyRecords
            .FirstOrDefaultAsync(r => r.PropertyId == propertyId.ToString());

        if (record == null)
        {
            return new AuFireSafetyDto(
                Id: Guid.Empty,
                PropertyId: propertyId,
                SmokeAlarmsInstalled: false,
                SmokeAlarmsLastTested: null,
                FireExtinguisherPresent: false,
                FireExtinguisherExpiryDate: null,
                EvacuationPlanDisplayed: false,
                LastInspectionDate: null,
                NextInspectionDue: null,
                ComplianceStatus: "action_required",
                ActionItems: new List<string>
                {
                    "Install smoke alarms",
                    "Install fire extinguisher",
                    "Display evacuation plan",
                    "Schedule fire safety inspection"
                }
            );
        }

        var actionItems = GetFireSafetyActionItems(record);
        var complianceStatus = DetermineFireSafetyComplianceStatus(record, actionItems);

        return new AuFireSafetyDto(
            Id: Guid.Parse(record.Id),
            PropertyId: propertyId,
            SmokeAlarmsInstalled: record.SmokeAlarmsInstalled,
            SmokeAlarmsLastTested: record.SmokeAlarmTestDate?.ToDateTime(TimeOnly.MinValue),
            FireExtinguisherPresent: record.FireExtinguisher,
            FireExtinguisherExpiryDate: record.FireExtinguisherTestDate?.ToDateTime(TimeOnly.MinValue),
            EvacuationPlanDisplayed: record.EvacuationDiagram,
            LastInspectionDate: record.LastInspectionDate?.ToDateTime(TimeOnly.MinValue),
            NextInspectionDue: record.NextInspectionDue?.ToDateTime(TimeOnly.MinValue),
            ComplianceStatus: complianceStatus,
            ActionItems: actionItems
        );
    }

    public async Task<AuFireSafetyDto> UpdateFireSafetyAsync(Guid propertyId, UpdateFireSafetyRequest request)
    {
        var record = await _dbContext.AuFireSafetyRecords
            .FirstOrDefaultAsync(r => r.PropertyId == propertyId.ToString());

        if (record == null)
        {
            var property = await _dbContext.Properties
                .FirstOrDefaultAsync(p => p.Id == propertyId.ToString())
                ?? throw new InvalidOperationException($"Property {propertyId} not found.");

            record = new AuFireSafetyRecord
            {
                Id = Guid.NewGuid().ToString(),
                OrganisationId = property.OrganisationId,
                PropertyId = propertyId.ToString(),
                StateCode = property.StateRegion ?? "NSW",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _dbContext.AuFireSafetyRecords.Add(record);
        }

        if (request.SmokeAlarmsInstalled.HasValue)
            record.SmokeAlarmsInstalled = request.SmokeAlarmsInstalled.Value;
        if (request.SmokeAlarmsLastTested.HasValue)
            record.SmokeAlarmTestDate = DateOnly.FromDateTime(request.SmokeAlarmsLastTested.Value);
        if (request.FireExtinguisherPresent.HasValue)
            record.FireExtinguisher = request.FireExtinguisherPresent.Value;
        if (request.FireExtinguisherExpiryDate.HasValue)
            record.FireExtinguisherTestDate = DateOnly.FromDateTime(request.FireExtinguisherExpiryDate.Value);
        if (request.EvacuationPlanDisplayed.HasValue)
            record.EvacuationDiagram = request.EvacuationPlanDisplayed.Value;
        if (request.LastInspectionDate.HasValue)
            record.LastInspectionDate = DateOnly.FromDateTime(request.LastInspectionDate.Value);
        if (request.NextInspectionDue.HasValue)
            record.NextInspectionDue = DateOnly.FromDateTime(request.NextInspectionDue.Value);

        record.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Updated fire safety record for property {PropertyId}", propertyId);

        return await GetFireSafetyStatusAsync(propertyId);
    }

    // --- Complaints ---

    public async Task<List<AuComplaintDto>> GetComplaintsAsync(Guid propertyId)
    {
        var complaints = await _dbContext.AuComplaintLogs
            .Where(c => c.PropertyId == propertyId.ToString())
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return complaints.Select(c => new AuComplaintDto(
            Id: Guid.Parse(c.Id),
            PropertyId: propertyId,
            DateReceived: c.ComplaintReceivedAt,
            ComplaintType: c.ComplaintSource.ToString().ToLowerInvariant(),
            Description: c.ComplaintDescription ?? "",
            Status: c.Status.ToString().ToLowerInvariant(),
            Resolution: c.ResolutionNotes,
            ResolvedAt: c.ResolvedAt,
            CreatedAt: c.CreatedAt
        )).ToList();
    }

    public async Task<AuComplaintDto> LogComplaintAsync(Guid propertyId, CreateComplaintRequest request)
    {
        var property = await _dbContext.Properties
            .FirstOrDefaultAsync(p => p.Id == propertyId.ToString())
            ?? throw new InvalidOperationException($"Property {propertyId} not found.");

        var complaint = new AuComplaintLog
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = property.OrganisationId,
            PropertyId = propertyId.ToString(),
            ComplaintReceivedAt = request.DateReceived,
            ComplaintSource = ParseComplaintSource(request.ComplaintType),
            ComplaintDescription = request.Description,
            Status = ComplaintStatus.Open,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.AuComplaintLogs.Add(complaint);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Logged complaint for property {PropertyId}", propertyId);

        return new AuComplaintDto(
            Id: Guid.Parse(complaint.Id),
            PropertyId: propertyId,
            DateReceived: complaint.ComplaintReceivedAt,
            ComplaintType: request.ComplaintType,
            Description: request.Description,
            Status: "open",
            Resolution: null,
            ResolvedAt: null,
            CreatedAt: complaint.CreatedAt
        );
    }

    public async Task<AuComplaintDto> UpdateComplaintAsync(Guid complaintId, UpdateComplaintRequest request)
    {
        var complaint = await _dbContext.AuComplaintLogs
            .FirstOrDefaultAsync(c => c.Id == complaintId.ToString())
            ?? throw new InvalidOperationException($"Complaint {complaintId} not found.");

        if (!string.IsNullOrEmpty(request.Status))
        {
            complaint.Status = Enum.TryParse<ComplaintStatus>(request.Status, true, out var status)
                ? status
                : complaint.Status;
        }

        if (request.Resolution != null)
            complaint.ResolutionNotes = request.Resolution;

        if (request.ResolvedAt.HasValue)
            complaint.ResolvedAt = request.ResolvedAt.Value;

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Updated complaint {ComplaintId}", complaintId);

        return new AuComplaintDto(
            Id: complaintId,
            PropertyId: Guid.Parse(complaint.PropertyId),
            DateReceived: complaint.ComplaintReceivedAt,
            ComplaintType: complaint.ComplaintSource.ToString().ToLowerInvariant(),
            Description: complaint.ComplaintDescription ?? "",
            Status: complaint.Status.ToString().ToLowerInvariant(),
            Resolution: complaint.ResolutionNotes,
            ResolvedAt: complaint.ResolvedAt,
            CreatedAt: complaint.CreatedAt
        );
    }

    private static List<string> GetFireSafetyActionItems(AuFireSafetyRecord record)
    {
        var items = new List<string>();

        if (!record.SmokeAlarmsInstalled)
            items.Add("Install smoke alarms (AS3786 compliant, photoelectric, interconnected)");
        else if (record.SmokeAlarmTestDate.HasValue && record.SmokeAlarmTestDate.Value < DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-12)))
            items.Add("Smoke alarms overdue for annual testing");

        if (!record.FireExtinguisher)
            items.Add("Install fire extinguisher (2.5kg ABE recommended)");
        else if (record.FireExtinguisherTestDate.HasValue && record.FireExtinguisherTestDate.Value < DateOnly.FromDateTime(DateTime.UtcNow))
            items.Add("Fire extinguisher service overdue");

        if (!record.EvacuationDiagram)
            items.Add("Display evacuation diagram in prominent location");

        if (record.NextInspectionDue.HasValue && record.NextInspectionDue.Value < DateOnly.FromDateTime(DateTime.UtcNow))
            items.Add("Fire safety inspection overdue");
        else if (!record.LastInspectionDate.HasValue)
            items.Add("Schedule initial fire safety inspection");

        return items;
    }

    private static string DetermineFireSafetyComplianceStatus(AuFireSafetyRecord record, List<string> actionItems)
    {
        if (!actionItems.Any())
            return "compliant";

        if (!record.SmokeAlarmsInstalled || !record.FireExtinguisher)
            return "action_required";

        if (record.NextInspectionDue.HasValue && record.NextInspectionDue.Value < DateOnly.FromDateTime(DateTime.UtcNow))
            return "overdue";

        return "action_required";
    }

    private static ComplaintSource ParseComplaintSource(string complaintType)
    {
        return complaintType.ToLowerInvariant() switch
        {
            "noise" or "neighbour" => ComplaintSource.Neighbour,
            "council" or "parking" => ComplaintSource.Council,
            "platform" => ComplaintSource.Platform,
            _ => ComplaintSource.Other
        };
    }
}
