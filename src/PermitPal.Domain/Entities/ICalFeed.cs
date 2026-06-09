using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class ICalFeed
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public BookingSource Platform { get; set; }
    public string ICalUrl { get; set; } = string.Empty;
    public DateTime? LastSyncedAt { get; set; }
    public SyncStatus LastSyncStatus { get; set; } = SyncStatus.Pending;
    public string? LastSyncError { get; set; }
    public int NightsImported { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
}
