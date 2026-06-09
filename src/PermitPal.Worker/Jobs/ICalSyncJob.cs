using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Enums;

namespace PermitPal.Worker.Jobs;

public class ICalSyncJob
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IICalParserService _iCalParserService;
    private readonly ILogger<ICalSyncJob> _logger;

    public ICalSyncJob(
        IApplicationDbContext dbContext,
        IICalParserService iCalParserService,
        ILogger<ICalSyncJob> logger)
    {
        _dbContext = dbContext;
        _iCalParserService = iCalParserService;
        _logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("ICalSyncJob started at {Time}", DateTime.UtcNow);

        var feeds = await _dbContext.ICalFeeds
            .Where(f => f.IsActive)
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Found {Count} active iCal feeds to sync", feeds.Count);

        var successCount = 0;
        var failCount = 0;

        foreach (var feed in feeds)
        {
            try
            {
                var nightsSynced = await _iCalParserService.SyncFeedAsync(feed.Id);
                feed.LastSyncedAt = DateTime.UtcNow;
                feed.LastSyncStatus = SyncStatus.Success;
                feed.NightsImported = nightsSynced;
                feed.LastSyncError = null;
                successCount++;

                _logger.LogInformation("Synced feed {FeedId} for property {PropertyId}: {Nights} nights",
                    feed.Id, feed.PropertyId, nightsSynced);
            }
            catch (Exception ex)
            {
                feed.LastSyncedAt = DateTime.UtcNow;
                feed.LastSyncStatus = SyncStatus.Failed;
                feed.LastSyncError = ex.Message;
                failCount++;

                _logger.LogError(ex, "Failed to sync feed {FeedId} for property {PropertyId}",
                    feed.Id, feed.PropertyId);
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("ICalSyncJob completed: {Success} succeeded, {Failed} failed",
            successCount, failCount);
    }
}
