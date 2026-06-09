namespace PermitPal.Application.Interfaces;

public interface ICurrentUserService
{
    string? UserId { get; }
    string? OrganisationId { get; }
    string? Role { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
}
