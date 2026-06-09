using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.NightCaps;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Services;

/// <summary>
/// Implements IICalParserService — downloads and parses iCal feeds, syncs booked nights.
/// </summary>
public class ICalParserService : IICalParserService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IHttpClientFactory _httpClientFactory;

    public ICalParserService(IApplicationDbContext dbContext, IHttpClientFactory httpClientFactory)
    {
        _dbContext = dbContext;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<IEnumerable<BookedNight>> ParseFeedAsync(string icalUrl, string propertyId, string organisationId, BookingSource source)
    {
        var client = _httpClientFactory.CreateClient("ICalParser");
        var icsContent = await client.GetStringAsync(icalUrl);
        var events = ParseICalContent(icsContent);

        var bookedNights = new List<BookedNight>();

        foreach (var evt in events)
        {
            var startDate = DateOnly.FromDateTime(evt.StartDate);
            var endDate = DateOnly.FromDateTime(evt.EndDate);

            for (var date = startDate; date < endDate; date = date.AddDays(1))
            {
                bookedNights.Add(new BookedNight
                {
                    Id = Guid.NewGuid().ToString(),
                    OrganisationId = organisationId,
                    PropertyId = propertyId,
                    NightDate = date,
                    Source = source,
                    BookingRef = evt.Summary,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        return bookedNights;
    }

    public async Task<int> SyncFeedAsync(string feedId)
    {
        var feed = await _dbContext.ICalFeeds
            .FirstOrDefaultAsync(f => f.Id == feedId);

        if (feed == null)
            throw new InvalidOperationException($"ICalFeed {feedId} not found.");

        try
        {
            var client = _httpClientFactory.CreateClient("ICalParser");
            var icsContent = await client.GetStringAsync(feed.ICalUrl);
            var events = ParseICalContent(icsContent);

            // Determine the booking source from the feed platform
            var source = feed.Platform;

            // Collect all dates from the parsed events
            var parsedDates = new HashSet<DateOnly>();
            var dateToSummary = new Dictionary<DateOnly, string?>();

            foreach (var evt in events)
            {
                var startDate = DateOnly.FromDateTime(evt.StartDate);
                var endDate = DateOnly.FromDateTime(evt.EndDate);

                for (var date = startDate; date < endDate; date = date.AddDays(1))
                {
                    parsedDates.Add(date);
                    dateToSummary.TryAdd(date, evt.Summary);
                }
            }

            // Get existing booked nights for this feed (identified by ICalUid matching feedId)
            var existingNights = await _dbContext.BookedNights
                .Where(bn => bn.PropertyId == feed.PropertyId && bn.ICalUid == feedId)
                .ToListAsync();

            var existingDates = existingNights.Select(n => n.NightDate).ToHashSet();

            // Remove nights that no longer appear in the feed
            var toRemove = existingNights.Where(n => !parsedDates.Contains(n.NightDate)).ToList();
            foreach (var night in toRemove)
            {
                _dbContext.BookedNights.Remove(night);
            }

            // Add new nights that don't exist yet
            var toAdd = parsedDates.Where(d => !existingDates.Contains(d)).ToList();
            foreach (var date in toAdd)
            {
                var bookedNight = new BookedNight
                {
                    Id = Guid.NewGuid().ToString(),
                    OrganisationId = feed.OrganisationId,
                    PropertyId = feed.PropertyId,
                    NightDate = date,
                    Source = source,
                    BookingRef = dateToSummary.GetValueOrDefault(date),
                    ICalUid = feedId,
                    CreatedAt = DateTime.UtcNow
                };
                _dbContext.BookedNights.Add(bookedNight);
            }

            // Update feed status
            feed.LastSyncedAt = DateTime.UtcNow;
            feed.LastSyncStatus = SyncStatus.Success;
            feed.LastSyncError = null;
            feed.NightsImported = parsedDates.Count;

            await _dbContext.SaveChangesAsync();

            return parsedDates.Count;
        }
        catch (Exception ex)
        {
            feed.LastSyncedAt = DateTime.UtcNow;
            feed.LastSyncStatus = SyncStatus.Failed;
            feed.LastSyncError = ex.Message;

            await _dbContext.SaveChangesAsync();
            throw;
        }
    }

    public async Task<List<ParsedEventDto>> PreviewFeedAsync(string feedUrl)
    {
        var client = _httpClientFactory.CreateClient("ICalParser");
        var icsContent = await client.GetStringAsync(feedUrl);
        return ParseICalContent(icsContent);
    }

    /// <summary>
    /// Parses iCal content string into a list of ParsedEventDto.
    /// Handles VCALENDAR/VEVENT format with DTSTART, DTEND, SUMMARY fields.
    /// </summary>
    private static List<ParsedEventDto> ParseICalContent(string icsContent)
    {
        var events = new List<ParsedEventDto>();
        var lines = icsContent.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.None);

        bool inEvent = false;
        DateTime? startDate = null;
        DateTime? endDate = null;
        string? summary = null;

        foreach (var rawLine in lines)
        {
            var line = rawLine.Trim();

            if (line == "BEGIN:VEVENT")
            {
                inEvent = true;
                startDate = null;
                endDate = null;
                summary = null;
                continue;
            }

            if (line == "END:VEVENT")
            {
                if (inEvent && startDate.HasValue && endDate.HasValue)
                {
                    var nightCount = (int)(endDate.Value.Date - startDate.Value.Date).TotalDays;
                    if (nightCount > 0)
                    {
                        events.Add(new ParsedEventDto(
                            StartDate: startDate.Value,
                            EndDate: endDate.Value,
                            Summary: summary,
                            NightCount: nightCount
                        ));
                    }
                }
                inEvent = false;
                continue;
            }

            if (!inEvent)
                continue;

            if (line.StartsWith("DTSTART"))
            {
                startDate = ParseICalDate(line);
            }
            else if (line.StartsWith("DTEND"))
            {
                endDate = ParseICalDate(line);
            }
            else if (line.StartsWith("SUMMARY:"))
            {
                summary = line.Substring("SUMMARY:".Length).Trim();
            }
        }

        return events;
    }

    /// <summary>
    /// Parses an iCal date line. Handles formats:
    /// - DTSTART;VALUE=DATE:20240101
    /// - DTSTART:20240101T120000Z
    /// - DTSTART:20240101T120000
    /// </summary>
    private static DateTime? ParseICalDate(string line)
    {
        // Extract the value after the colon
        var colonIndex = line.LastIndexOf(':');
        if (colonIndex < 0)
            return null;

        var dateStr = line.Substring(colonIndex + 1).Trim();

        // Try parsing as date-only (VALUE=DATE format): 20240101
        if (dateStr.Length == 8 && DateTime.TryParseExact(dateStr, "yyyyMMdd",
            CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateOnly))
        {
            return dateOnly;
        }

        // Try parsing as datetime with Z: 20240101T120000Z
        if (dateStr.EndsWith("Z") && DateTime.TryParseExact(dateStr, "yyyyMMdd'T'HHmmss'Z'",
            CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var dateTimeZ))
        {
            return dateTimeZ;
        }

        // Try parsing as datetime without Z: 20240101T120000
        if (DateTime.TryParseExact(dateStr, "yyyyMMdd'T'HHmmss",
            CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
        {
            return dateTime;
        }

        return null;
    }
}
