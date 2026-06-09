using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.Jurisdictions;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Controllers;

[Authorize]
public class JurisdictionsController : BaseController
{
    private readonly IApplicationDbContext _dbContext;

    public JurisdictionsController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// List jurisdictions, optionally filtered by country code and state code.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JurisdictionRulesetResponse>>> GetAll(
        [FromQuery] string? countryCode,
        [FromQuery] string? stateCode)
    {
        var query = _dbContext.Jurisdictions.Where(j => j.IsActive);

        if (!string.IsNullOrEmpty(countryCode))
            query = query.Where(j => j.CountryCode == countryCode);

        if (!string.IsNullOrEmpty(stateCode))
            query = query.Where(j => j.StateRegion != null && j.StateRegion.Code == stateCode);

        var jurisdictions = await query
            .OrderBy(j => j.Name)
            .Select(j => new JurisdictionRulesetResponse(
                j.Id,
                j.Name,
                j.Slug,
                j.CountryCode,
                j.JurisdictionType,
                j.PermitRequired,
                j.PermitType,
                j.PermitDescription,
                j.PermitFeeCents,
                j.PermitPortalUrl,
                j.PermitNumberInListing,
                j.NightCapUnhosted,
                j.NightCapHosted,
                j.PrimaryResidenceRequired,
                j.TotRatePct,
                j.TotName,
                j.EnforcementLevel,
                j.LastVerifiedAt
            ))
            .ToListAsync();

        return Ok(jurisdictions);
    }

    /// <summary>
    /// Get a single jurisdiction by ID with its rules.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<JurisdictionRulesetResponse>> GetById(string id)
    {
        var j = await _dbContext.Jurisdictions
            .Where(j => j.Id == id && j.IsActive)
            .FirstOrDefaultAsync();

        if (j == null)
            return NotFound();

        var response = new JurisdictionRulesetResponse(
            j.Id,
            j.Name,
            j.Slug,
            j.CountryCode,
            j.JurisdictionType,
            j.PermitRequired,
            j.PermitType,
            j.PermitDescription,
            j.PermitFeeCents,
            j.PermitPortalUrl,
            j.PermitNumberInListing,
            j.NightCapUnhosted,
            j.NightCapHosted,
            j.PrimaryResidenceRequired,
            j.TotRatePct,
            j.TotName,
            j.EnforcementLevel,
            j.LastVerifiedAt
        );

        return Ok(response);
    }

    /// <summary>
    /// Resolve a jurisdiction from a postcode and country code.
    /// </summary>
    [HttpGet("resolve")]
    public async Task<ActionResult<JurisdictionRulesetResponse>> Resolve(
        [FromQuery] string postcode,
        [FromQuery] string countryCode)
    {
        if (string.IsNullOrEmpty(postcode) || string.IsNullOrEmpty(countryCode))
            return BadRequest("Both postcode and countryCode are required.");

        var jurisdictionPostcode = await _dbContext.JurisdictionPostcodes
            .Where(jp => jp.Postcode == postcode && jp.CountryCode == countryCode)
            .Include(jp => jp.Jurisdiction)
            .FirstOrDefaultAsync();

        if (jurisdictionPostcode?.Jurisdiction == null)
            return NotFound("No jurisdiction found for the given postcode and country.");

        var j = jurisdictionPostcode.Jurisdiction;

        var response = new JurisdictionRulesetResponse(
            j.Id,
            j.Name,
            j.Slug,
            j.CountryCode,
            j.JurisdictionType,
            j.PermitRequired,
            j.PermitType,
            j.PermitDescription,
            j.PermitFeeCents,
            j.PermitPortalUrl,
            j.PermitNumberInListing,
            j.NightCapUnhosted,
            j.NightCapHosted,
            j.PrimaryResidenceRequired,
            j.TotRatePct,
            j.TotName,
            j.EnforcementLevel,
            j.LastVerifiedAt
        );

        return Ok(response);
    }
}
