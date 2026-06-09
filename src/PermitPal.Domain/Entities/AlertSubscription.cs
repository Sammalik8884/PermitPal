using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class AlertSubscription
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string? JurisdictionId { get; set; }
    public string? PropertyId { get; set; }
    public AlertType AlertType { get; set; } = AlertType.All;
    public string Channel { get; set; } = "email";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public User User { get; set; } = null!;
}
