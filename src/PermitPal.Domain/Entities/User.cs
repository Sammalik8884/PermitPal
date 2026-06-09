using PermitPal.Domain.Enums;

namespace PermitPal.Domain.Entities;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Owner;
    public bool IsActive { get; set; } = true;
    public bool MfaEnabled { get; set; }
    public string? MfaSecret { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpires { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpires { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Organisation Organisation { get; set; } = null!;
}
