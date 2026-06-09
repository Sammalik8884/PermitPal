namespace PermitPal.Domain.Entities;

public class JurisdictionPostcode
{
    public string Postcode { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string JurisdictionId { get; set; } = string.Empty;
    public bool IsPrimary { get; set; } = true;

    // Navigation
    public Jurisdiction Jurisdiction { get; set; } = null!;
    public Country Country { get; set; } = null!;
}
