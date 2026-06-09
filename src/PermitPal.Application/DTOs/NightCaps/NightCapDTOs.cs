using PermitPal.Domain.Enums;

namespace PermitPal.Application.DTOs.NightCaps;

public record NightCapStatusResponse(
    string PropertyId,
    short CalendarYear,
    int NightsUsed,
    int? CapLimit,
    int? NightsRemaining,
    decimal? PctUsed,
    DateTime? LastSyncedAt,
    IEnumerable<ICalFeedSummary> Feeds
);

public record ICalFeedSummary(
    string Id,
    BookingSource Platform,
    SyncStatus LastSyncStatus,
    DateTime? LastSyncedAt,
    int NightsImported
);

public record AddICalFeedRequest(string ICalUrl, BookingSource Platform);

public record NightCapSummaryDto(
    string PropertyId,
    string PropertyName,
    string JurisdictionName,
    short Year,
    int? NightCap,
    int NightsUsed,
    int? NightsRemaining,
    decimal Percentage,
    string Status // "ok", "warning", "exceeded"
);

public record BookedNightDto(
    string Id,
    DateOnly Date,
    string Source,
    string? BookingRef,
    string? ICalUid
);

public record ParsedEventDto(
    DateTime StartDate,
    DateTime EndDate,
    string? Summary,
    int NightCount
);

public record AddManualNightsRequest(
    string PropertyId,
    List<DateOnly> Dates,
    string? GuestName
);

public record RecalculateRequest(
    string PropertyId,
    short Year
);
