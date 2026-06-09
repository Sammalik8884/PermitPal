using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class BookedNight
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public DateOnly NightDate { get; set; }
    public BookingSource Source { get; set; }
    public string? BookingRef { get; set; }
    public string? ICalUid { get; set; }
    public byte? GuestCount { get; set; }
    public int GrossRevenueCents { get; set; }
    public int PlatformFeeCents { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
}
