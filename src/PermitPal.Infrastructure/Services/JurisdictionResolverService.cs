using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.Jurisdictions;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;

namespace PermitPal.Infrastructure.Services;

/// <summary>
/// Implements IJurisdictionResolverService — resolves jurisdictions by postcode, state, or ID.
/// </summary>
public class JurisdictionResolverService : IJurisdictionResolverService
{
    private readonly IApplicationDbContext _dbContext;

    public JurisdictionResolverService(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Jurisdiction?> ResolveAsync(string postcode, string countryCode)
    {
        // Try exact postcode match
        var postcodeEntry = await _dbContext.JurisdictionPostcodes
            .Include(jp => jp.Jurisdiction)
            .FirstOrDefaultAsync(jp => jp.Postcode == postcode && jp.CountryCode == countryCode);

        if (postcodeEntry != null)
            return postcodeEntry.Jurisdiction;

        // Try partial postcode match (first part for UK-style postcodes, or prefix match)
        var prefix = postcode.Length > 3 ? postcode.Substring(0, postcode.Length - 2).Trim() : postcode;
        postcodeEntry = await _dbContext.JurisdictionPostcodes
            .Include(jp => jp.Jurisdiction)
            .FirstOrDefaultAsync(jp => jp.Postcode == prefix && jp.CountryCode == countryCode);

        if (postcodeEntry != null)
            return postcodeEntry.Jurisdiction;

        // Fallback: find any jurisdiction for this country
        var fallback = await _dbContext.Jurisdictions
            .FirstOrDefaultAsync(j => j.CountryCode == countryCode && j.IsActive);

        return fallback;
    }

    public async Task<Jurisdiction?> GetByIdAsync(string id)
    {
        return await _dbContext.Jurisdictions
            .Include(j => j.StateRegion)
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<IEnumerable<Jurisdiction>> SearchAsync(string query, int limit = 20)
    {
        return await _dbContext.Jurisdictions
            .Where(j => j.IsActive && (j.Name.Contains(query) || j.Slug.Contains(query)))
            .OrderBy(j => j.Name)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<Jurisdiction>> GetByStateAsync(string countryCode, string stateCode)
    {
        return await _dbContext.Jurisdictions
            .Include(j => j.StateRegion)
            .Where(j => j.CountryCode == countryCode
                && j.StateRegion != null
                && j.StateRegion.Code == stateCode
                && j.IsActive)
            .OrderBy(j => j.Name)
            .ToListAsync();
    }

    public async Task<JurisdictionRulesDto> GetRulesAsync(string jurisdictionId)
    {
        var jurisdiction = await _dbContext.Jurisdictions
            .Include(j => j.StateRegion)
            .FirstOrDefaultAsync(j => j.Id == jurisdictionId);

        if (jurisdiction == null)
            throw new InvalidOperationException($"Jurisdiction {jurisdictionId} not found.");

        // Determine required documents based on jurisdiction settings
        var requiredDocuments = new List<string>();
        if (jurisdiction.PermitRequired)
            requiredDocuments.Add("Permit/License");
        if (!string.IsNullOrEmpty(jurisdiction.AuFireSafetyStandard))
            requiredDocuments.Add("Fire Safety Certificate");
        if (jurisdiction.TotSelfRemitRequired)
            requiredDocuments.Add("Tax Registration Certificate");
        if (jurisdiction.AuStraRegisterRequired)
            requiredDocuments.Add("Short-Term Rental Registration");

        // Determine levy info
        bool levyRequired = jurisdiction.TotRatePct.HasValue && jurisdiction.TotRatePct > 0;
        string? levyFrequency = levyRequired ? "Quarterly" : null; // Default assumption

        return new JurisdictionRulesDto(
            JurisdictionId: jurisdiction.Id,
            Name: jurisdiction.Name,
            CountryCode: jurisdiction.CountryCode,
            StateCode: jurisdiction.StateRegion?.Code,
            AnnualNightCapUnhosted: jurisdiction.NightCapUnhosted,
            AnnualNightCapHosted: jurisdiction.NightCapHosted,
            PermitRequired: jurisdiction.PermitRequired,
            PrimaryResidenceRequired: jurisdiction.PrimaryResidenceRequired,
            LevyRequired: levyRequired,
            LevyRate: jurisdiction.TotRatePct,
            LevyFrequency: levyFrequency,
            FireSafetyRequired: !string.IsNullOrEmpty(jurisdiction.AuFireSafetyStandard),
            AdditionalNotes: jurisdiction.NightCapNotes,
            RequiredDocuments: requiredDocuments
        );
    }
}
