using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class NotificationLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string? PropertyId { get; set; }
    public string? PermitId { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public NotificationChannel Channel { get; set; }
    public string Recipient { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string Body { get; set; } = string.Empty;
    public NotificationStatus Status { get; set; } = NotificationStatus.Queued;
    public string? ProviderMessageId { get; set; }
    public DateTime? SentAt { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
