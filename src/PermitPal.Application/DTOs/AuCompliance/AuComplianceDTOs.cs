namespace PermitPal.Application.DTOs.AuCompliance;

public record AuLevySummaryDto(
    Guid PropertyId,
    int Year,
    int TotalNights,
    decimal LevyRatePerNight,
    decimal TotalOwed,
    decimal TotalPaid,
    decimal Balance,
    string Status
);

public record AuLevyRecordDto(
    Guid Id,
    Guid PropertyId,
    decimal Amount,
    DateTime PaidDate,
    string? Reference,
    string? Period,
    DateTime CreatedAt
);

public record AuFireSafetyDto(
    Guid Id,
    Guid PropertyId,
    bool SmokeAlarmsInstalled,
    DateTime? SmokeAlarmsLastTested,
    bool FireExtinguisherPresent,
    DateTime? FireExtinguisherExpiryDate,
    bool EvacuationPlanDisplayed,
    DateTime? LastInspectionDate,
    DateTime? NextInspectionDue,
    string ComplianceStatus,
    List<string> ActionItems
);

public record UpdateFireSafetyRequest(
    bool? SmokeAlarmsInstalled,
    DateTime? SmokeAlarmsLastTested,
    bool? FireExtinguisherPresent,
    DateTime? FireExtinguisherExpiryDate,
    bool? EvacuationPlanDisplayed,
    DateTime? LastInspectionDate,
    DateTime? NextInspectionDue
);

public record AuComplaintDto(
    Guid Id,
    Guid PropertyId,
    DateTime DateReceived,
    string ComplaintType,
    string Description,
    string Status,
    string? Resolution,
    DateTime? ResolvedAt,
    DateTime CreatedAt
);

public record CreateComplaintRequest(
    DateTime DateReceived,
    string ComplaintType,
    string Description
);

public record UpdateComplaintRequest(
    string? Status,
    string? Resolution,
    DateTime? ResolvedAt
);
