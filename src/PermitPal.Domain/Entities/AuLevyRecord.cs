using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class AuLevyRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public string StateCode { get; set; } = string.Empty;
    public byte Quarter { get; set; }
    public short CalendarYear { get; set; }
    public int TotalBookingsCents { get; set; }
    public decimal LevyRatePct { get; set; }
    public int LevyAmountCents { get; set; }
    public int PlatformCollectedCents { get; set; }
    public DateTime? ReportGeneratedAt { get; set; }
    public DateTime? LodgedAt { get; set; }
    public string? LodgementReference { get; set; }
    public LevyStatus Status { get; set; } = LevyStatus.Calculating;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
}
