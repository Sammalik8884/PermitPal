namespace PermitPal.Domain.Entities;

public class StateRegion
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string CountryCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public bool HasStateRegistration { get; set; }
    public string? RegistrationUrl { get; set; }
    public int? RegistrationFeeCents { get; set; }
    public int? RegistrationRenewalFeeCents { get; set; }
    public int? RegistrationValidityMonths { get; set; }
    public int? NightCapDefault { get; set; }
    public int? NightCapHosted { get; set; }
    public decimal? LevyPct { get; set; }
    public string? LevyAuthority { get; set; }
    public string? LevyReportUrl { get; set; }
    public string? Notes { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Country Country { get; set; } = null!;
    public ICollection<Jurisdiction> Jurisdictions { get; set; } = new List<Jurisdiction>();
}
