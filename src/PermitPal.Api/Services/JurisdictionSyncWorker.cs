using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;
using PermitPal.Infrastructure.External;

namespace PermitPal.Api.Services;

public class JurisdictionSyncWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<JurisdictionSyncWorker> _logger;

    public JurisdictionSyncWorker(IServiceProvider serviceProvider, ILogger<JurisdictionSyncWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Jurisdiction Sync Worker starting...");

        // Run immediately on startup, then every 24 hours
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await SyncJurisdictionsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while syncing jurisdictions.");
            }

            // Wait 24 hours before next sync
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }

    private async Task SyncJurisdictionsAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Syncing jurisdictions from external API...");

        using var scope = _serviceProvider.CreateScope();
        var apiClient = scope.ServiceProvider.GetRequiredService<IExternalJurisdictionApiClient>();
        var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        var externalJurisdictions = await apiClient.FetchLatestJurisdictionsAsync(stoppingToken);

        foreach (var external in externalJurisdictions)
        {
            // Ensure Country exists
            var country = await dbContext.Countries.FirstOrDefaultAsync(c => c.Code == external.CountryCode, stoppingToken);
            if (country == null)
            {
                _logger.LogInformation("Seeding missing Country: {Code}", external.CountryCode);
                country = new PermitPal.Domain.Entities.Country
                {
                    Code = external.CountryCode,
                    Name = external.CountryCode == "US" ? "United States" :
                           external.CountryCode == "FR" ? "France" :
                           external.CountryCode == "GB" ? "United Kingdom" :
                           external.CountryCode == "AU" ? "Australia" : external.CountryCode,
                    Currency = external.CountryCode == "US" ? "USD" :
                               external.CountryCode == "FR" ? "EUR" :
                               external.CountryCode == "GB" ? "GBP" :
                               external.CountryCode == "AU" ? "AUD" : "USD"
                };
                dbContext.Countries.Add(country);
                await dbContext.SaveChangesAsync(stoppingToken); // Save immediately so Jurisdiction can reference it
            }

            var existing = await dbContext.Jurisdictions
                .FirstOrDefaultAsync(j => j.Id == external.Id, stoppingToken);

            if (existing == null)
            {
                _logger.LogInformation("Adding new jurisdiction: {Name}", external.Name);
                dbContext.Jurisdictions.Add(external);
            }
            else
            {
                _logger.LogInformation("Updating jurisdiction: {Name}", external.Name);
                existing.CountryCode = external.CountryCode;
                existing.Name = external.Name;
                existing.Slug = external.Slug;
                existing.JurisdictionType = external.JurisdictionType;
                existing.PermitRequired = external.PermitRequired;
                existing.PermitType = external.PermitType;
                existing.PermitDescription = external.PermitDescription;
                existing.PermitFeeCents = external.PermitFeeCents;
                existing.PermitPortalUrl = external.PermitPortalUrl;
                existing.PermitNumberInListing = external.PermitNumberInListing;
                existing.NightCapUnhosted = external.NightCapUnhosted;
                existing.NightCapHosted = external.NightCapHosted;
                existing.PrimaryResidenceRequired = external.PrimaryResidenceRequired;
                existing.TotRatePct = external.TotRatePct;
                existing.TotName = external.TotName;
                existing.TotPlatformCollects = external.TotPlatformCollects;
                existing.EuRegistrationScheme = external.EuRegistrationScheme;
                existing.AuStraRegisterRequired = external.AuStraRegisterRequired;
                existing.AuFireSafetyStandard = external.AuFireSafetyStandard;
                existing.AuContactPersonRequired = external.AuContactPersonRequired;
                existing.EnforcementLevel = external.EnforcementLevel;
                existing.LastVerifiedAt = external.LastVerifiedAt;
                existing.UpdatedAt = DateTime.UtcNow;
            }
        }

        await dbContext.SaveChangesAsync(stoppingToken);
        _logger.LogInformation("Jurisdiction sync completed successfully.");
    }
}
