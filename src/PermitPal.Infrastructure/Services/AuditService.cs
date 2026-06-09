using System.Text.Json;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;

namespace PermitPal.Infrastructure.Services;

/// <summary>
/// Implements IAuditService. Creates AuditLog entries and saves to DB.
/// </summary>
public class AuditService : IAuditService
{
    private readonly IApplicationDbContext _dbContext;

    public AuditService(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task LogAsync(
        string organisationId,
        string? userId,
        string action,
        string resourceType,
        string? resourceId,
        object? oldValues = null,
        object? newValues = null,
        string? ipAddress = null)
    {
        var auditLog = new AuditLog
        {
            OrganisationId = organisationId,
            UserId = userId,
            Action = action,
            ResourceType = resourceType,
            ResourceId = resourceId,
            OldValues = oldValues != null ? JsonSerializer.Serialize(oldValues) : null,
            NewValues = newValues != null ? JsonSerializer.Serialize(newValues) : null,
            IpAddress = ipAddress,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.AuditLogs.Add(auditLog);
        await _dbContext.SaveChangesAsync();
    }
}
