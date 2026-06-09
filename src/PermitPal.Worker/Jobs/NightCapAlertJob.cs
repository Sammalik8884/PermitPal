using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Enums;

namespace PermitPal.Worker.Jobs;

public class NightCapAlertJob
{
    private readonly IApplicationDbContext _dbContext;
    private readonly INotificationService _notificationService;
    private readonly ILogger<NightCapAlertJob> _logger;

    public NightCapAlertJob(
        IApplicationDbContext dbContext,
        INotificationService notificationService,
        ILogger<NightCapAlertJob> logger)
    {
        _dbContext = dbContext;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("NightCapAlertJob started at {Time}", DateTime.UtcNow);

        var currentYear = (short)DateTime.UtcNow.Year;

        // Get all night cap records for the current year that have a cap limit
        var nightCapRecords = await _dbContext.NightCapRecords
            .Where(r => r.CalendarYear == currentYear && r.CapLimit != null && r.CapLimit > 0)
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Found {Count} night cap records to check", nightCapRecords.Count);

        foreach (var record in nightCapRecords)
        {
            if (record.CapLimit == null || record.CapLimit <= 0) continue;

            var usagePercentage = (double)record.NightsUsed / record.CapLimit.Value * 100;

            // Check 80% threshold
            if (usagePercentage >= 80 && usagePercentage < 100 && !record.Alerted80Pct)
            {
                try
                {
                    await _notificationService.SendNightCapWarningAsync(
                        record.PropertyId, record.NightsUsed, record.CapLimit.Value);

                    record.Alerted80Pct = true;
                    _logger.LogInformation(
                        "Sent 80% night cap warning for property {PropertyId}: {Used}/{Cap}",
                        record.PropertyId, record.NightsUsed, record.CapLimit.Value);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send 80% night cap alert for property {PropertyId}",
                        record.PropertyId);
                }
            }

            // Check 90% threshold
            if (usagePercentage >= 90 && usagePercentage < 100 && !record.Alerted90Pct)
            {
                try
                {
                    await _notificationService.SendNightCapWarningAsync(
                        record.PropertyId, record.NightsUsed, record.CapLimit.Value);

                    record.Alerted90Pct = true;
                    _logger.LogInformation(
                        "Sent 90% night cap warning for property {PropertyId}: {Used}/{Cap}",
                        record.PropertyId, record.NightsUsed, record.CapLimit.Value);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send 90% night cap alert for property {PropertyId}",
                        record.PropertyId);
                }
            }

            // Check 100% threshold (exceeded)
            if (usagePercentage >= 100 && !record.Alerted100Pct)
            {
                try
                {
                    await _notificationService.SendNightCapWarningAsync(
                        record.PropertyId, record.NightsUsed, record.CapLimit.Value);

                    record.Alerted100Pct = true;
                    _logger.LogInformation(
                        "Sent 100% night cap exceeded alert for property {PropertyId}: {Used}/{Cap}",
                        record.PropertyId, record.NightsUsed, record.CapLimit.Value);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send 100% night cap alert for property {PropertyId}",
                        record.PropertyId);
                }
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("NightCapAlertJob completed");
    }
}
