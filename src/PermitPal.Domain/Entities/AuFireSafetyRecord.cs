namespace PermitPal.Domain.Entities;
public class AuFireSafetyRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public string StateCode { get; set; } = string.Empty;
    public bool SmokeAlarmsInstalled { get; set; }
    public string SmokeAlarmStandard { get; set; } = "AS3786";
    public DateOnly? SmokeAlarmTestDate { get; set; }
    public DateOnly? SmokeAlarmExpiryDate { get; set; }
    public bool Interconnected { get; set; }
    public bool Photoelectric { get; set; }
    public bool FireExtinguisher { get; set; }
    public string FireExtinguisherType { get; set; } = "2.5kg ABE";
    public DateOnly? FireExtinguisherTestDate { get; set; }
    public bool FireBlanket { get; set; }
    public bool EvacuationDiagram { get; set; }
    public string? EvacuationDiagramLocation { get; set; }
    public DateOnly? LastInspectionDate { get; set; }
    public string? InspectionCertificateUrl { get; set; }
    public DateOnly? NextInspectionDue { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
}
