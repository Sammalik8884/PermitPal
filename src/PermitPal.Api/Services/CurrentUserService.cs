using System.Security.Claims;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Services;

/// <summary>
/// Implements ICurrentUserService by reading claims from HttpContext.User.
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public string? UserId => User?.FindFirstValue(ClaimTypes.NameIdentifier)
                             ?? User?.FindFirstValue("sub");

    public string? OrganisationId => User?.FindFirstValue("org_id");

    public string? Email => User?.FindFirstValue(ClaimTypes.Email)
                            ?? User?.FindFirstValue("email");

    public string? Role => User?.FindFirstValue(ClaimTypes.Role)
                           ?? User?.FindFirstValue("role");

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;
}
