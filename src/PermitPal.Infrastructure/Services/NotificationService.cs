using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        IApplicationDbContext dbContext,
        IEmailService emailService,
        ISmsService smsService,
        ILogger<NotificationService> logger)
    {
        _dbContext = dbContext;
        _emailService = emailService;
        _smsService = smsService;
        _logger = logger;
    }

    public async Task SendPermitExpiryAlertAsync(string propertyId, string permitId, DateOnly expiryDate)
    {
        var permit = await _dbContext.Permits
            .Include(p => p.Property)
            .FirstOrDefaultAsync(p => p.Id == permitId);

        if (permit == null) return;

        var property = permit.Property;
        var orgId = permit.OrganisationId;

        var subscriptions = await GetActiveSubscriptionsAsync(orgId, AlertType.PermitExpiry, propertyId);

        foreach (var sub in subscriptions)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == sub.UserId);
            if (user == null) continue;

            var templateData = new Dictionary<string, string>
            {
                ["PropertyName"] = property.Name,
                ["ExpiryDate"] = expiryDate.ToString("dd MMM yyyy")
            };

            if (sub.Channel.Contains("email", StringComparison.OrdinalIgnoreCase))
            {
                await SendAndLogAsync(
                    orgId, user.Id, propertyId, permitId,
                    "PermitExpiry", NotificationChannel.Email,
                    user.Email, "permit-expiring", templateData);
            }

            if (sub.Channel.Contains("sms", StringComparison.OrdinalIgnoreCase))
            {
                var smsMessage = $"PermitPal: Your permit for {property.Name} expires on {expiryDate:dd MMM yyyy}. Please renew.";
                await SendSmsAndLogAsync(
                    orgId, user.Id, propertyId, permitId,
                    "PermitExpiry", user.Email, smsMessage);
            }
        }
    }

    public async Task SendNightCapWarningAsync(string propertyId, int nightsUsed, int nightCap)
    {
        var property = await _dbContext.Properties.FirstOrDefaultAsync(p => p.Id == propertyId);
        if (property == null) return;

        var orgId = property.OrganisationId;
        var subscriptions = await GetActiveSubscriptionsAsync(orgId, AlertType.NightCap, propertyId);

        foreach (var sub in subscriptions)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == sub.UserId);
            if (user == null) continue;

            var templateData = new Dictionary<string, string>
            {
                ["PropertyName"] = property.Name,
                ["NightsUsed"] = nightsUsed.ToString(),
                ["NightCap"] = nightCap.ToString()
            };

            if (sub.Channel.Contains("email", StringComparison.OrdinalIgnoreCase))
            {
                await SendAndLogAsync(
                    orgId, user.Id, propertyId, null,
                    "NightCap", NotificationChannel.Email,
                    user.Email, "night-cap-warning", templateData);
            }

            if (sub.Channel.Contains("sms", StringComparison.OrdinalIgnoreCase))
            {
                var smsMessage = $"PermitPal: {property.Name} has used {nightsUsed}/{nightCap} nights. Approaching cap limit.";
                await SendSmsAndLogAsync(
                    orgId, user.Id, propertyId, null,
                    "NightCap", user.Email, smsMessage);
            }
        }
    }

    public async Task SendRegulatoryChangeAlertAsync(string jurisdictionId, string regulatoryChangeId)
    {
        var change = await _dbContext.RegulatoryChanges
            .Include(r => r.Jurisdiction)
            .FirstOrDefaultAsync(r => r.Id == regulatoryChangeId);

        if (change == null) return;

        // Find all properties in this jurisdiction
        var properties = await _dbContext.Properties
            .Where(p => p.JurisdictionId == jurisdictionId && p.IsActive)
            .ToListAsync();

        var orgIds = properties.Select(p => p.OrganisationId).Distinct().ToList();

        foreach (var orgId in orgIds)
        {
            var subscriptions = await GetActiveSubscriptionsAsync(orgId, AlertType.RegulatoryChange, null);

            foreach (var sub in subscriptions)
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == sub.UserId);
                if (user == null) continue;

                var templateData = new Dictionary<string, string>
                {
                    ["JurisdictionName"] = change.Jurisdiction?.Id ?? jurisdictionId,
                    ["ChangeSummary"] = change.ChangeSummary
                };

                if (sub.Channel.Contains("email", StringComparison.OrdinalIgnoreCase))
                {
                    await SendAndLogAsync(
                        orgId, user.Id, null, null,
                        "RegulatoryChange", NotificationChannel.Email,
                        user.Email, "regulatory-change", templateData);
                }

                if (sub.Channel.Contains("sms", StringComparison.OrdinalIgnoreCase))
                {
                    var smsMessage = $"PermitPal: Regulatory change in your jurisdiction: {change.ChangeSummary}";
                    await SendSmsAndLogAsync(
                        orgId, user.Id, null, null,
                        "RegulatoryChange", user.Email, smsMessage);
                }

                // Create RegulatoryAlertLog
                var alertLog = new RegulatoryAlertLog
                {
                    Id = Guid.NewGuid().ToString(),
                    RegulatoryChangeId = regulatoryChangeId,
                    OrganisationId = orgId,
                    UserId = user.Id,
                    SentAt = DateTime.UtcNow,
                    Channel = sub.Channel.Contains("sms", StringComparison.OrdinalIgnoreCase)
                        ? NotificationChannel.Sms
                        : NotificationChannel.Email
                };
                _dbContext.RegulatoryAlertLogs.Add(alertLog);
            }
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task SendWelcomeAsync(string userId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return;

        var templateData = new Dictionary<string, string>
        {
            ["UserName"] = $"{user.FirstName} {user.LastName}"
        };

        await SendAndLogAsync(
            user.OrganisationId, user.Id, null, null,
            "Welcome", NotificationChannel.Email,
            user.Email, "welcome", templateData);
    }

    private async Task<List<AlertSubscription>> GetActiveSubscriptionsAsync(
        string organisationId, AlertType alertType, string? propertyId)
    {
        var query = _dbContext.AlertSubscriptions
            .Where(s => s.OrganisationId == organisationId && s.IsActive);

        query = query.Where(s => s.AlertType == alertType || s.AlertType == AlertType.All);

        if (propertyId != null)
        {
            query = query.Where(s => s.PropertyId == null || s.PropertyId == propertyId);
        }

        return await query.ToListAsync();
    }

    private async Task SendAndLogAsync(
        string orgId, string userId, string? propertyId, string? permitId,
        string alertType, NotificationChannel channel,
        string recipient, string templateName, Dictionary<string, string> templateData)
    {
        var log = new NotificationLog
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = orgId,
            UserId = userId,
            PropertyId = propertyId,
            PermitId = permitId,
            AlertType = alertType,
            Channel = channel,
            Recipient = recipient,
            Subject = templateName,
            Body = string.Join(", ", templateData.Select(kv => $"{kv.Key}={kv.Value}")),
            Status = NotificationStatus.Queued,
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            await _emailService.SendTemplateAsync(recipient, templateName, templateData);
            log.Status = NotificationStatus.Sent;
            log.SentAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            log.Status = NotificationStatus.Failed;
            log.ErrorMessage = ex.Message;
            _logger.LogError(ex, "Failed to send {AlertType} email to {Recipient}", alertType, recipient);
        }

        _dbContext.NotificationLogs.Add(log);
        await _dbContext.SaveChangesAsync();
    }

    private async Task SendSmsAndLogAsync(
        string orgId, string userId, string? propertyId, string? permitId,
        string alertType, string recipient, string message)
    {
        var log = new NotificationLog
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = orgId,
            UserId = userId,
            PropertyId = propertyId,
            PermitId = permitId,
            AlertType = alertType,
            Channel = NotificationChannel.Sms,
            Recipient = recipient,
            Body = message,
            Status = NotificationStatus.Queued,
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            await _smsService.SendAsync(recipient, message);
            log.Status = NotificationStatus.Sent;
            log.SentAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            log.Status = NotificationStatus.Failed;
            log.ErrorMessage = ex.Message;
            _logger.LogError(ex, "Failed to send {AlertType} SMS to {Recipient}", alertType, recipient);
        }

        _dbContext.NotificationLogs.Add(log);
        await _dbContext.SaveChangesAsync();
    }
}
