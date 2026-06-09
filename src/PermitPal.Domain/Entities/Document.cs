using PermitPal.Domain.Enums;
namespace PermitPal.Domain.Entities;
public class Document
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string? PropertyId { get; set; }
    public string? PermitId { get; set; }
    public DocumentType DocumentType { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public int? FileSizeBytes { get; set; }
    public string? MimeType { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public bool AlertedExpiry { get; set; }
    public string? UploadedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Organisation Organisation { get; set; } = null!;
    public Property? Property { get; set; }
    public Permit? Permit { get; set; }
}
