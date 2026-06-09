namespace PermitPal.Domain.Entities;
public class AuditLog
{
    public long Id { get; set; }
    public string OrganisationId { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string ResourceType { get; set; } = string.Empty;
    public string? ResourceId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
