using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class RegulatoryAlertLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string RegulatoryChangeId { get; set; } = string.Empty;
    public string OrganisationId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime? SentAt { get; set; }
    public NotificationChannel Channel { get; set; } = NotificationChannel.Email;
    public DateTime? ReadAt { get; set; }
    public RegulatoryChange RegulatoryChange { get; set; } = null!;
    public Organisation Organisation { get; set; } = null!;
}
