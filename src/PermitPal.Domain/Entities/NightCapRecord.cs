using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class NightCapRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public short CalendarYear { get; set; }
    public int? CapLimit { get; set; }
    public int NightsUsed { get; set; }
    public bool Alerted80Pct { get; set; }
    public bool Alerted90Pct { get; set; }
    public bool Alerted100Pct { get; set; }
    public DateTime? LastSyncedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
}
