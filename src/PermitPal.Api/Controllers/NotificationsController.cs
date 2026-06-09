using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Enums;

namespace PermitPal.Api.Controllers;

[Authorize]
public class NotificationsController : BaseController
{
    private readonly IApplicationDbContext _dbContext;

    public NotificationsController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// List notification logs for the current user (paginated).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        var query = _dbContext.NotificationLogs
            .Where(n => n.OrganisationId == orgId && n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt);

        var total = await query.CountAsync();

        var notifications = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => new NotificationDto(
                n.Id,
                n.AlertType,
                n.Channel,
                n.Subject,
                n.Body,
                n.Status,
                n.SentAt,
                n.CreatedAt
            ))
            .ToListAsync();

        return Ok(new { data = notifications, total, page, pageSize });
    }

    /// <summary>
    /// Get count of unread notifications.
    /// </summary>
    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        var count = await _dbContext.NotificationLogs
            .Where(n => n.OrganisationId == orgId
                        && n.UserId == userId
                        && n.Status == NotificationStatus.Sent)
            .CountAsync();

        return Ok(new { unreadCount = count });
    }

    /// <summary>
    /// Mark a notification as read.
    /// </summary>
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        var notification = await _dbContext.NotificationLogs
            .FirstOrDefaultAsync(n => n.Id == id && n.OrganisationId == orgId && n.UserId == userId);

        if (notification == null)
            return NotFound();

        notification.Status = NotificationStatus.Delivered;
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Mark all notifications as read.
    /// </summary>
    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        var unreadNotifications = await _dbContext.NotificationLogs
            .Where(n => n.OrganisationId == orgId
                        && n.UserId == userId
                        && n.Status == NotificationStatus.Sent)
            .ToListAsync();

        foreach (var notification in unreadNotifications)
        {
            notification.Status = NotificationStatus.Delivered;
        }

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Get alert subscription preferences for the current user.
    /// </summary>
    [HttpGet("preferences")]
    public async Task<IActionResult> GetPreferences()
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        var subscriptions = await _dbContext.AlertSubscriptions
            .Where(s => s.OrganisationId == orgId && s.UserId == userId && s.IsActive)
            .Select(s => new AlertPreferenceDto(
                s.Id,
                s.AlertType,
                s.Channel,
                s.PropertyId,
                s.JurisdictionId,
                s.IsActive
            ))
            .ToListAsync();

        return Ok(subscriptions);
    }

    /// <summary>
    /// Update alert subscription preferences.
    /// </summary>
    [HttpPut("preferences")]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesRequest request)
    {
        var userId = GetUserId();
        var orgId = GetOrganisationId();

        var existing = await _dbContext.AlertSubscriptions
            .Where(s => s.OrganisationId == orgId && s.UserId == userId)
            .ToListAsync();

        // Deactivate all existing
        foreach (var sub in existing)
        {
            sub.IsActive = false;
        }

        // Create new preferences
        foreach (var pref in request.Preferences)
        {
            var subscription = new Domain.Entities.AlertSubscription
            {
                Id = Guid.NewGuid().ToString(),
                OrganisationId = orgId,
                UserId = userId,
                AlertType = pref.AlertType,
                Channel = pref.Channel,
                PropertyId = pref.PropertyId,
                JurisdictionId = pref.JurisdictionId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.AlertSubscriptions.Add(subscription);
        }

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}

// DTOs
public record NotificationDto(
    string Id,
    string AlertType,
    NotificationChannel Channel,
    string? Subject,
    string Body,
    NotificationStatus Status,
    DateTime? SentAt,
    DateTime CreatedAt);

public record AlertPreferenceDto(
    string Id,
    AlertType AlertType,
    string Channel,
    string? PropertyId,
    string? JurisdictionId,
    bool IsActive);

public record UpdatePreferencesRequest(List<PreferenceItem> Preferences);

public record PreferenceItem(
    AlertType AlertType,
    string Channel,
    string? PropertyId,
    string? JurisdictionId);
