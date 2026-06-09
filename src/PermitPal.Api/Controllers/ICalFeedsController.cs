using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.NightCaps;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Api.Controllers;

[Authorize]
public class ICalFeedsController : BaseController
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IICalParserService _iCalParserService;
    private readonly INightCapService _nightCapService;

    public ICalFeedsController(
        IApplicationDbContext dbContext,
        IICalParserService iCalParserService,
        INightCapService nightCapService)
    {
        _dbContext = dbContext;
        _iCalParserService = iCalParserService;
        _nightCapService = nightCapService;
    }

    /// <summary>
    /// List iCal feeds for a property.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string propertyId)
    {
        var orgId = GetOrganisationId();

        var feeds = await _dbContext.ICalFeeds
            .Where(f => f.PropertyId == propertyId && f.OrganisationId == orgId && f.IsActive)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new ICalFeedSummary(
                f.Id,
                f.Platform,
                f.LastSyncStatus,
                f.LastSyncedAt,
                f.NightsImported
            ))
            .ToListAsync();

        return Ok(feeds);
    }

    /// <summary>
    /// Add a new iCal feed for a property.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateICalFeedRequest request)
    {
        var orgId = GetOrganisationId();

        var feed = new ICalFeed
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = orgId,
            PropertyId = request.PropertyId,
            ICalUrl = request.FeedUrl,
            Platform = request.Source,
            IsActive = true,
            LastSyncStatus = SyncStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.ICalFeeds.Add(feed);
        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            feed.Id,
            feed.PropertyId,
            feed.ICalUrl,
            feed.Platform,
            feed.LastSyncStatus,
            feed.CreatedAt
        });
    }

    /// <summary>
    /// Trigger a manual sync of an iCal feed.
    /// </summary>
    [HttpPost("{id}/sync")]
    public async Task<IActionResult> Sync(string id)
    {
        var orgId = GetOrganisationId();

        var feed = await _dbContext.ICalFeeds
            .FirstOrDefaultAsync(f => f.Id == id && f.OrganisationId == orgId);

        if (feed == null)
            return NotFound();

        var nightsSynced = await _iCalParserService.SyncFeedAsync(id);

        // Recalculate night cap for current year
        var currentYear = (short)DateTime.UtcNow.Year;
        await _nightCapService.RecalculateNightsAsync(feed.PropertyId, currentYear);

        return Ok(new { nightsSynced, feed.LastSyncedAt, feed.LastSyncStatus });
    }

    /// <summary>
    /// Preview an iCal feed without saving.
    /// </summary>
    [HttpPost("preview")]
    public async Task<ActionResult<List<ParsedEventDto>>> Preview([FromBody] PreviewFeedRequest request)
    {
        var events = await _iCalParserService.PreviewFeedAsync(request.FeedUrl);
        return Ok(events);
    }

    /// <summary>
    /// Remove an iCal feed (soft delete).
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var orgId = GetOrganisationId();

        var feed = await _dbContext.ICalFeeds
            .FirstOrDefaultAsync(f => f.Id == id && f.OrganisationId == orgId);

        if (feed == null)
            return NotFound();

        feed.IsActive = false;
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}

// Request DTOs for this controller
public record CreateICalFeedRequest(string PropertyId, string FeedUrl, BookingSource Source, string? Label);
public record PreviewFeedRequest(string FeedUrl);
