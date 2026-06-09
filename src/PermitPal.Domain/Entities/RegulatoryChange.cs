using PermitPal.Domain.Enums;

namespace PermitPal.Domain.Entities;

public class RegulatoryChange
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string JurisdictionId { get; set; } = string.Empty;
    public RegulatoryChangeType ChangeType { get; set; }
    public string ChangeSummary { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public DateOnly? EffectiveDate { get; set; }
    public string? SourceUrl { get; set; }
    public string? AiSummary { get; set; }
    public AlertSeverity Severity { get; set; } = AlertSeverity.Warning;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Jurisdiction Jurisdiction { get; set; } = null!;
}
