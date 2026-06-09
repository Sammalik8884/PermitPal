namespace PermitPal.Api.Services;

/// <summary>
/// Scoped service that holds the current tenant's OrganisationId.
/// Set by TenantMiddleware, consumed by DbContext for query filters.
/// </summary>
public class TenantContext
{
    public string? OrganisationId { get; set; }
}
