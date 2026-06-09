namespace PermitPal.Application.DTOs.Dashboard;

public record DashboardSummaryResponse(
    DashboardStatsDto Stats,
    List<ComplianceHistoryPointDto> ComplianceHistory,
    List<PropertyAtRiskDto> PropertiesAtRisk,
    List<UpcomingDeadlineDto> UpcomingDeadlines,
    List<ActivityItemDto> RecentActivity,
    List<NightCapDashboardDto> NightCaps
);

public record DashboardStatsDto(
    int TotalProperties,
    int PropertiesAddedThisMonth,
    int ActivePermits,
    int ComplianceScore,
    int NightsUsed,
    int TotalNightCap
);

public record ComplianceHistoryPointDto(
    string Month,
    int Score
);

public record PropertyAtRiskDto(
    string Id,
    string PropertyName,
    string Issue,
    string Severity
);

public record UpcomingDeadlineDto(
    string Id,
    string PropertyName,
    string DeadlineType,
    string Date,
    int DaysRemaining
);

public record ActivityItemDto(
    string Id,
    string? PropertyName,
    string Action,
    string Date
);

public record NightCapDashboardDto(
    string PropertyId,
    string PropertyName,
    int Year,
    int NightCap,
    int NightsUsed,
    int NightsRemaining,
    decimal Percentage,
    string Status
);
