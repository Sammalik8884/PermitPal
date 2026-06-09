namespace PermitPal.Application.Interfaces;

public interface IAuditService
{
    Task LogAsync(string organisationId, string? userId, string action, string resourceType, string? resourceId, object? oldValues = null, object? newValues = null, string? ipAddress = null);
}
