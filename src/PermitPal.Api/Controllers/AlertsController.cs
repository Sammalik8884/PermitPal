using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Api.Controllers;

[Authorize]
public class AlertsController : BaseController
{
    private readonly IApplicationDbContext _dbContext;

    public AlertsController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// List user's alert subscriptions.
    /// </summary>
    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetSubscriptions()
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        var subscriptions = await _dbContext.AlertSubscriptions
            .Where(s => s.OrganisationId == orgId && s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new AlertSubscriptionDto(
                s.Id,
                s.AlertType,
                s.Channel,
                s.PropertyId,
                s.JurisdictionId,
                s.IsActive,
                s.CreatedAt
            ))
            .ToListAsync();

        return Ok(subscriptions);
    }

    /// <summary>
    /// Create or update an alert subscription.
    /// </summary>
    [HttpPost("subscriptions")]
    public async Task<IActionResult> CreateSubscription([FromBody] CreateAlertSubscriptionRequest request)
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        // Check if a similar subscription already exists
        var existing = await _dbContext.AlertSubscriptions
            .FirstOrDefaultAsync(s =>
                s.OrganisationId == orgId
                && s.UserId == userId
                && s.AlertType == request.AlertType
                && s.PropertyId == request.PropertyId
                && s.JurisdictionId == request.JurisdictionId);

        if (existing != null)
        {
            existing.Channel = request.Channel;
            existing.IsActive = true;
        }
        else
        {
            var subscription = new AlertSubscription
            {
                Id = Guid.NewGuid().ToString(),
                OrganisationId = orgId,
                UserId = userId,
                AlertType = request.AlertType,
                Channel = request.Channel,
                PropertyId = request.PropertyId,
                JurisdictionId = request.JurisdictionId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.AlertSubscriptions.Add(subscription);
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Subscription saved" });
    }

    /// <summary>
    /// Remove an alert subscription.
    /// </summary>
    [HttpDelete("subscriptions/{id}")]
    public async Task<IActionResult> DeleteSubscription(string id)
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        var subscription = await _dbContext.AlertSubscriptions
            .FirstOrDefaultAsync(s => s.Id == id && s.OrganisationId == orgId && s.UserId == userId);

        if (subscription == null)
            return NotFound();

        subscription.IsActive = false;
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Get regulatory alerts for a specific jurisdiction.
    /// </summary>
    [HttpGet("regulatory")]
    public async Task<IActionResult> GetRegulatoryAlerts([FromQuery] string jurisdictionId)
    {
        var orgId = GetOrganisationId();

        var alerts = await _dbContext.RegulatoryChanges
            .Where(r => r.JurisdictionId == jurisdictionId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RegulatoryAlertDto(
                r.Id,
                r.JurisdictionId,
                r.ChangeType,
                r.ChangeSummary,
                r.OldValue,
                r.NewValue,
                r.EffectiveDate,
                r.Severity,
                r.CreatedAt
            ))
            .ToListAsync();

        return Ok(alerts);
    }

    /// <summary>
    /// Get recent regulatory changes across all user's jurisdictions.
    /// </summary>
    [HttpGet("regulatory/recent")]
    public async Task<IActionResult> GetRecentRegulatoryChanges([FromQuery] int limit = 20)
    {
        var orgId = GetOrganisationId();

        // Get jurisdictions for user's properties
        var jurisdictionIds = await _dbContext.Properties
            .Where(p => p.OrganisationId == orgId && p.IsActive && p.JurisdictionId != null)
            .Select(p => p.JurisdictionId!)
            .Distinct()
            .ToListAsync();

        var recentChanges = await _dbContext.RegulatoryChanges
            .Where(r => jurisdictionIds.Contains(r.JurisdictionId))
            .OrderByDescending(r => r.CreatedAt)
            .Take(limit)
            .Select(r => new RegulatoryAlertDto(
                r.Id,
                r.JurisdictionId,
                r.ChangeType,
                r.ChangeSummary,
                r.OldValue,
                r.NewValue,
                r.EffectiveDate,
                r.Severity,
                r.CreatedAt
            ))
            .ToListAsync();

        return Ok(recentChanges);
    }
}

// DTOs
public record AlertSubscriptionDto(
    string Id,
    AlertType AlertType,
    string Channel,
    string? PropertyId,
    string? JurisdictionId,
    bool IsActive,
    DateTime CreatedAt);

public record CreateAlertSubscriptionRequest(
    AlertType AlertType,
    string Channel,
    string? PropertyId,
    string? JurisdictionId);

public record RegulatoryAlertDto(
    string Id,
    string JurisdictionId,
    RegulatoryChangeType ChangeType,
    string ChangeSummary,
    string? OldValue,
    string? NewValue,
    DateOnly? EffectiveDate,
    AlertSeverity Severity,
    DateTime CreatedAt);
