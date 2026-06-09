using PermitPal.Application.DTOs.NightCaps;
using PermitPal.Domain.Entities;

namespace PermitPal.Application.Interfaces;

public interface INightCapService
{
    Task<NightCapRecord> GetOrCreateRecordAsync(string propertyId, short year);
    Task UpdateNightCountAsync(string propertyId, short year);
    Task CheckAlertsAsync(string propertyId, short year);
    Task<NightCapSummaryDto> GetNightCapSummaryAsync(string propertyId, short year);
    Task<List<NightCapSummaryDto>> GetNightCapSummariesAsync(string organisationId, short year);
    Task RecalculateNightsAsync(string propertyId, short year);
    Task<List<BookedNightDto>> GetBookedNightsAsync(string propertyId, short year, int month);
    Task AddManualNightsAsync(string propertyId, string organisationId, List<DateOnly> dates, string? guestName);
}
