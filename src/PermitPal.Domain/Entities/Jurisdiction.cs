using PermitPal.Domain.Enums;

namespace PermitPal.Domain.Entities;

public class Jurisdiction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string CountryCode { get; set; } = string.Empty;
    public string? StateRegionId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public JurisdictionType JurisdictionType { get; set; } = JurisdictionType.City;
    public bool PermitRequired { get; set; }
    public string? PermitType { get; set; }
    public string? PermitDescription { get; set; }
    public int? PermitFeeCents { get; set; }
    public int? PermitRenewalFeeCents { get; set; }
    public int? PermitValidityMonths { get; set; } = 12;
    public string? PermitPortalUrl { get; set; }
    public bool PermitNumberInListing { get; set; }
    public int? NightCapUnhosted { get; set; }
    public int? NightCapHosted { get; set; }
    public string? NightCapNotes { get; set; }
    public bool PrimaryResidenceRequired { get; set; }
    public int? PrimaryResidenceDays { get; set; }
    public bool ZoningRestrictions { get; set; }
    public string? ZoningNotes { get; set; }
    public decimal? TotRatePct { get; set; }
    public string? TotName { get; set; }
    public bool TotPlatformCollects { get; set; } = true;
    public bool TotSelfRemitRequired { get; set; }
    public string? TotFilingUrl { get; set; }
    public string? AdditionalTaxes { get; set; }
    public string? EuRegistrationScheme { get; set; }
    public string? EuRegistrationUrl { get; set; }
    public bool EuDataSharingActive { get; set; }
    public bool AuStraRegisterRequired { get; set; }
    public string? AuFireSafetyStandard { get; set; }
    public bool AuContactPersonRequired { get; set; }
    public int? AuComplaintResponseMinutes { get; set; }
    public int? FineMinCents { get; set; }
    public int? FineMaxCents { get; set; }
    public string FineCurrency { get; set; } = "USD";
    public string? FineNotes { get; set; }
    public EnforcementLevel EnforcementLevel { get; set; } = EnforcementLevel.Medium;
    public bool IsActive { get; set; } = true;
    public DateOnly? LastVerifiedAt { get; set; }
    public DateOnly? NextReviewDate { get; set; }
    public string? VerifiedBy { get; set; }
    public string? SourceUrls { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Country Country { get; set; } = null!;
    public StateRegion? StateRegion { get; set; }
    public ICollection<JurisdictionPostcode> Postcodes { get; set; } = new List<JurisdictionPostcode>();
    public ICollection<RegulatoryChange> RegulatoryChanges { get; set; } = new List<RegulatoryChange>();
}
