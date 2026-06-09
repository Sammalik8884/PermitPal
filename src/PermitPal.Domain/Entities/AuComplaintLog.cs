using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class AuComplaintLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public DateTime ComplaintReceivedAt { get; set; }
    public ComplaintSource ComplaintSource { get; set; } = ComplaintSource.Neighbour;
    public string? ComplaintDescription { get; set; }
    public DateTime? ResponseRequiredBy { get; set; }
    public DateTime? RespondedAt { get; set; }
    public string? ResponseNotes { get; set; }
    public DateTime? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionNotes { get; set; }
    public DateTime? CouncilReportDue { get; set; }
    public DateTime? CouncilReportSent { get; set; }
    public ComplaintStatus Status { get; set; } = ComplaintStatus.Open;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property Property { get; set; } = null!;
}
