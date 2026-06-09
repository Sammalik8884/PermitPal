using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class UsTaxRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public string JurisdictionId { get; set; } = string.Empty;
    public DateOnly TaxPeriodStart { get; set; }
    public DateOnly TaxPeriodEnd { get; set; }
    public UsTaxType TaxType { get; set; }
    public int TotalRevenueCents { get; set; }
    public int PlatformRevenueCents { get; set; }
    public int DirectRevenueCents { get; set; }
    public decimal TaxRatePct { get; set; }
    public int TaxOwedCents { get; set; }
    public int PlatformRemittedCents { get; set; }
    public string? FilingUrl { get; set; }
    public DateTime? FiledAt { get; set; }
    public string? FilingReference { get; set; }
    public TaxFilingStatus Status { get; set; } = TaxFilingStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
    public Jurisdiction Jurisdiction { get; set; } = null!;
}
