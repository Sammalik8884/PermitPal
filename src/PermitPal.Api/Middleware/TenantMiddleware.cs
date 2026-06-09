using PermitPal.Api.Services;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Middleware;

/// <summary>
/// Reads the authenticated user's org_id claim from JWT and sets it in TenantContext
/// so DbContext query filters can use it. Skips if no auth or anonymous endpoint.
/// </summary>
public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, TenantContext tenantContext, IApplicationDbContext dbContext)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var orgId = context.User.FindFirst("org_id")?.Value;
            if (!string.IsNullOrEmpty(orgId))
            {
                tenantContext.OrganisationId = orgId;
                dbContext.SetTenantId(orgId);
            }
        }

        await _next(context);
    }
}
