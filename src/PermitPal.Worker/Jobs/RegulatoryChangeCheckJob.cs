using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;

namespace PermitPal.Worker.Jobs;

public class RegulatoryChangeCheckJob
{
    private readonly IApplicationDbContext _dbContext;
    private readonly INotificationService _notificationService;
    private readonly ILogger<RegulatoryChangeCheckJob> _logger;

    public RegulatoryChangeCheckJob(
        IApplicationDbContext dbContext,
        INotificationService notificationService,
        ILogger<RegulatoryChangeCheckJob> logger)
    {
        _dbContext = dbContext;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("RegulatoryChangeCheckJob started at {Time}", DateTime.UtcNow);

        // Find regulatory changes that haven't been notified yet
        // A change is considered "not notified" if there are no RegulatoryAlertLog entries for it
        var notifiedChangeIds = await _dbContext.RegulatoryAlertLogs
            .Select(l => l.RegulatoryChangeId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var unnotifiedChanges = await _dbContext.RegulatoryChanges
            .Where(r => !notifiedChangeIds.Contains(r.Id))
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Found {Count} unnotified regulatory changes", unnotifiedChanges.Count);

        foreach (var change in unnotifiedChanges)
        {
            try
            {
                await _notificationService.SendRegulatoryChangeAlertAsync(
                    change.JurisdictionId, change.Id);

                _logger.LogInformation(
                    "Sent regulatory change alert for change {ChangeId} in jurisdiction {JurisdictionId}",
                    change.Id, change.JurisdictionId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Failed to send regulatory change alert for change {ChangeId}",
                    change.Id);
            }
        }

        _logger.LogInformation("RegulatoryChangeCheckJob completed");
    }
}
