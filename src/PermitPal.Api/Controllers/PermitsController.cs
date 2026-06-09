using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.Permits;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Api.Controllers;

[Authorize]
public class PermitsController : BaseController
{
    private readonly IApplicationDbContext _dbContext;

    public PermitsController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// List permits, optionally filtered by property ID.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PermitResponse>>> GetAll([FromQuery] string? propertyId)
    {
        var orgId = GetOrganisationId();

        var query = _dbContext.Permits
            .Where(p => p.OrganisationId == orgId);

        if (!string.IsNullOrEmpty(propertyId))
            query = query.Where(p => p.PropertyId == propertyId);

        var permitEntities = await query
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var permits = permitEntities
            .Select(p => new PermitResponse(
                p.Id,
                p.PropertyId,
                p.PermitType,
                p.PermitNumber,
                p.Status,
                p.IssuingAuthority,
                p.IssuedDate,
                p.ExpiryDate,
                p.RenewalUrl,
                p.ExpiryDate.HasValue
                    ? (int?)(p.ExpiryDate.Value.ToDateTime(TimeOnly.MinValue) - DateTime.UtcNow).Days
                    : null,
                p.CreatedAt
            ))
            .ToList();

        return Ok(permits);
    }

    /// <summary>
    /// Get a single permit by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PermitResponse>> GetById(string id)
    {
        var orgId = GetOrganisationId();

        var p = await _dbContext.Permits
            .Where(p => p.Id == id && p.OrganisationId == orgId)
            .FirstOrDefaultAsync();

        if (p == null)
            return NotFound();

        var response = new PermitResponse(
            p.Id,
            p.PropertyId,
            p.PermitType,
            p.PermitNumber,
            p.Status,
            p.IssuingAuthority,
            p.IssuedDate,
            p.ExpiryDate,
            p.RenewalUrl,
            p.ExpiryDate.HasValue
                ? (int?)(p.ExpiryDate.Value.ToDateTime(TimeOnly.MinValue) - DateTime.UtcNow).Days
                : null,
            p.CreatedAt
        );

        return Ok(response);
    }

    /// <summary>
    /// Create a new permit.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PermitResponse>> Create([FromBody] CreatePermitRequest request)
    {
        var orgId = GetOrganisationId();

        // Verify property belongs to this org
        var property = await _dbContext.Properties
            .FirstOrDefaultAsync(p => p.Id == request.PropertyId && p.OrganisationId == orgId && p.IsActive);

        if (property == null)
            return BadRequest("Property not found or does not belong to your organisation.");

        var permit = new Permit
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = orgId,
            PropertyId = request.PropertyId,
            JurisdictionId = property.JurisdictionId,
            PermitType = request.PermitType,
            PermitNumber = request.PermitNumber,
            Status = request.Status,
            IssuingAuthority = request.IssuingAuthority,
            IssuedDate = request.IssuedDate,
            ExpiryDate = request.ExpiryDate,
            RenewalUrl = request.RenewalUrl,
            EuRegistrationNumber = request.EuRegistrationNumber,
            Notes = request.Notes
        };

        _dbContext.Permits.Add(permit);
        await _dbContext.SaveChangesAsync();

        var response = new PermitResponse(
            permit.Id,
            permit.PropertyId,
            permit.PermitType,
            permit.PermitNumber,
            permit.Status,
            permit.IssuingAuthority,
            permit.IssuedDate,
            permit.ExpiryDate,
            permit.RenewalUrl,
            permit.ExpiryDate.HasValue
                ? (int?)(permit.ExpiryDate.Value.ToDateTime(TimeOnly.MinValue) - DateTime.UtcNow).Days
                : null,
            permit.CreatedAt
        );

        return CreatedAtAction(nameof(GetById), new { id = permit.Id }, response);
    }

    /// <summary>
    /// Update an existing permit.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<PermitResponse>> Update(string id, [FromBody] UpdatePermitRequest request)
    {
        var orgId = GetOrganisationId();

        var permit = await _dbContext.Permits
            .FirstOrDefaultAsync(p => p.Id == id && p.OrganisationId == orgId);

        if (permit == null)
            return NotFound();

        permit.PermitType = request.PermitType;
        permit.PermitNumber = request.PermitNumber;
        permit.Status = request.Status;
        permit.IssuingAuthority = request.IssuingAuthority;
        permit.IssuedDate = request.IssuedDate;
        permit.ExpiryDate = request.ExpiryDate;
        permit.RenewalUrl = request.RenewalUrl;
        permit.Notes = request.Notes;
        permit.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        var response = new PermitResponse(
            permit.Id,
            permit.PropertyId,
            permit.PermitType,
            permit.PermitNumber,
            permit.Status,
            permit.IssuingAuthority,
            permit.IssuedDate,
            permit.ExpiryDate,
            permit.RenewalUrl,
            permit.ExpiryDate.HasValue
                ? (int?)(permit.ExpiryDate.Value.ToDateTime(TimeOnly.MinValue) - DateTime.UtcNow).Days
                : null,
            permit.CreatedAt
        );

        return Ok(response);
    }

    /// <summary>
    /// Soft delete a permit (set status to Cancelled).
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var orgId = GetOrganisationId();

        var permit = await _dbContext.Permits
            .FirstOrDefaultAsync(p => p.Id == id && p.OrganisationId == orgId);

        if (permit == null)
            return NotFound();

        permit.Status = PermitStatus.Cancelled;
        permit.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
