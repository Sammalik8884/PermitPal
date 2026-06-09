using Microsoft.AspNetCore.Mvc;

namespace PermitPal.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    /// <summary>
    /// Gets the current user's OrganisationId from JWT claims.
    /// </summary>
    protected string GetOrganisationId()
    {
        var orgId = User.FindFirst("org_id")?.Value;
        if (string.IsNullOrEmpty(orgId))
            throw new UnauthorizedAccessException("Organisation ID not found in token.");
        return orgId;
    }

    /// <summary>
    /// Gets the current user's UserId from JWT claims.
    /// </summary>
    protected string GetUserId()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User ID not found in token.");
        return userId;
    }
}
