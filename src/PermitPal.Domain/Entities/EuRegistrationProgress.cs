using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class EuRegistrationProgress
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string SchemeName { get; set; } = string.Empty;
    public byte CurrentStep { get; set; } = 1;
    public byte TotalSteps { get; set; }
    public string? StepsData { get; set; }
    public string? RegistrationNumber { get; set; }
    public EuRegistrationStatus RegistrationStatus { get; set; } = EuRegistrationStatus.NotStarted;
    public DateTime? SubmittedAt { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? PortalUrl { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
}
