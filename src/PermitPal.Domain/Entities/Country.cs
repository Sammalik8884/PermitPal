using PermitPal.Domain.Enums;

namespace PermitPal.Domain.Entities;

public class Country
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public StrLegalStatus StrLegalStatus { get; set; } = StrLegalStatus.Varies;
    public string? NationalFrameworkUrl { get; set; }
    public string? Notes { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<StateRegion> StatesRegions { get; set; } = new List<StateRegion>();
    public ICollection<Jurisdiction> Jurisdictions { get; set; } = new List<Jurisdiction>();
}
