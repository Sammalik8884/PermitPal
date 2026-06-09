using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;

namespace PermitPal.Worker.Jobs;

public class ComplianceScoreJob
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IComplianceScoreService _complianceScoreService;
    private readonly ILogger<ComplianceScoreJob> _logger;

    public ComplianceScoreJob(
        IApplicationDbContext dbContext,
        IComplianceScoreService complianceScoreService,
        ILogger<ComplianceScoreJob> logger)
    {
        _dbContext = dbContext;
        _complianceScoreService = complianceScoreService;
        _logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("ComplianceScoreJob started at {Time}", DateTime.UtcNow);

        var properties = await _dbContext.Properties
            .Where(p => p.IsActive)
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Recalculating compliance scores for {Count} properties", properties.Count);

        var successCount = 0;
        var failCount = 0;

        foreach (var property in properties)
        {
            try
            {
                var score = await _complianceScoreService.CalculateScoreAsync(property);
                property.ComplianceScore = score;
                property.ScoreCalculatedAt = DateTime.UtcNow;
                successCount++;
            }
            catch (Exception ex)
            {
                failCount++;
                _logger.LogError(ex, "Failed to calculate compliance score for property {PropertyId}",
                    property.Id);
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("ComplianceScoreJob completed: {Success} succeeded, {Failed} failed",
            successCount, failCount);
    }
}
