using PermitPal.Domain.Enums;

namespace PermitPal.Domain.Entities;

public class Permit
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public string? JurisdictionId { get; set; }
    public string PermitType { get; set; } = string.Empty;
    public string? PermitNumber { get; set; }
    public PermitStatus Status { get; set; } = PermitStatus.Pending;
    public string? IssuingAuthority { get; set; }
    public DateOnly? IssuedDate { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public int? RenewalFeeCents { get; set; }
    public string? RenewalUrl { get; set; }
    public bool AutoRenewed { get; set; }
    public bool DisplayInListing { get; set; }
    public string? EuRegistrationNumber { get; set; }
    public string? EuRegistrationCountry { get; set; }
    public bool? EuRegistrationValid { get; set; }
    public DateTime? EuRegistrationCheckedAt { get; set; }
    public bool Alerted90d { get; set; }
    public bool Alerted30d { get; set; }
    public bool Alerted7d { get; set; }
    public bool AlertedExpired { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
    public Jurisdiction? Jurisdiction { get; set; }
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
