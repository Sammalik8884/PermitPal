using PermitPal.Application.DTOs.NightCaps;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Application.Interfaces;

public interface IICalParserService
{
    Task<IEnumerable<BookedNight>> ParseFeedAsync(string icalUrl, string propertyId, string organisationId, BookingSource source);
    Task<int> SyncFeedAsync(string feedId);
    Task<List<ParsedEventDto>> PreviewFeedAsync(string feedUrl);
}
