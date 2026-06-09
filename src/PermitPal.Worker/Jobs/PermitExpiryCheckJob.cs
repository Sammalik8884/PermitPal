using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Enums;

namespace PermitPal.Worker.Jobs;

public class PermitExpiryCheckJob
{
    private readonly IApplicationDbContext _dbContext;
    private readonly INotificationService _notificationService;
    private readonly ILogger<PermitExpiryCheckJob> _logger;

    public PermitExpiryCheckJob(
        IApplicationDbContext dbContext,
        INotificationService notificationService,
        ILogger<PermitExpiryCheckJob> logger)
    {
        _dbContext = dbContext;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("PermitExpiryCheckJob started at {Time}", DateTime.UtcNow);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var thirtyDaysFromNow = today.AddDays(30);

        // Get all active permits expiring within 30 days
        var expiringPermits = await _dbContext.Permits
            .Where(p => p.Status == PermitStatus.Active
                        && p.ExpiryDate != null
                        && p.ExpiryDate <= thirtyDaysFromNow
                        && p.ExpiryDate >= today)
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Found {Count} permits expiring within 30 days", expiringPermits.Count);

        foreach (var permit in expiringPermits)
        {
            if (permit.ExpiryDate == null) continue;

            var daysUntilExpiry = permit.ExpiryDate.Value.DayNumber - today.DayNumber;

            // Check thresholds: 30 days, 14 days, 7 days, 1 day
            var shouldAlert = daysUntilExpiry switch
            {
                <= 1 when !permit.AlertedExpired => true,
                <= 7 when !permit.Alerted7d => true,
                <= 14 when !permit.Alerted30d => true, // Reusing 30d flag for 14-day alert
                <= 30 when !permit.Alerted90d => true, // Reusing 90d flag for 30-day alert
                _ => false
            };

            if (!shouldAlert)
            {
                continue;
            }

            // Check if already notified (via NotificationLog)
            var alreadyNotified = await _dbContext.NotificationLogs
                .AnyAsync(n => n.PermitId == permit.Id
                               && n.AlertType == "PermitExpiry"
                               && n.Status == NotificationStatus.Sent
                               && n.CreatedAt >= DateTime.UtcNow.AddDays(-1),
                    cancellationToken);

            if (alreadyNotified) continue;

            try
            {
                await _notificationService.SendPermitExpiryAlertAsync(
                    permit.PropertyId, permit.Id, permit.ExpiryDate.Value);

                // Update alert flags
                if (daysUntilExpiry <= 1) permit.AlertedExpired = true;
                else if (daysUntilExpiry <= 7) permit.Alerted7d = true;
                else if (daysUntilExpiry <= 14) permit.Alerted30d = true;
                else if (daysUntilExpiry <= 30) permit.Alerted90d = true;

                _logger.LogInformation("Sent expiry alert for permit {PermitId}, expires in {Days} days",
                    permit.Id, daysUntilExpiry);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send expiry alert for permit {PermitId}", permit.Id);
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("PermitExpiryCheckJob completed");
    }
}
