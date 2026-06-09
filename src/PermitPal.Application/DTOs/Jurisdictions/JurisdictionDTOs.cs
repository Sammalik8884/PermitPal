using PermitPal.Domain.Enums;

namespace PermitPal.Application.DTOs.Jurisdictions;

public record JurisdictionLookupRequest(string Postcode, string CountryCode);

public record JurisdictionRulesetResponse(
    string Id,
    string Name,
    string Slug,
    string CountryCode,
    JurisdictionType JurisdictionType,
    bool PermitRequired,
    string? PermitType,
    string? PermitDescription,
    int? PermitFeeCents,
    string? PermitPortalUrl,
    bool PermitNumberInListing,
    int? NightCapUnhosted,
    int? NightCapHosted,
    bool PrimaryResidenceRequired,
    decimal? TotRatePct,
    string? TotName,
    EnforcementLevel EnforcementLevel,
    DateOnly? LastVerifiedAt
);

public record JurisdictionRulesDto(
    string JurisdictionId,
    string Name,
    string CountryCode,
    string? StateCode,
    int? AnnualNightCapUnhosted,
    int? AnnualNightCapHosted,
    bool PermitRequired,
    bool PrimaryResidenceRequired,
    bool LevyRequired,
    decimal? LevyRate,
    string? LevyFrequency,
    bool FireSafetyRequired,
    string? AdditionalNotes,
    List<string> RequiredDocuments
);
