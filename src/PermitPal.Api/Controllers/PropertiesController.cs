using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.Properties;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;

namespace PermitPal.Api.Controllers;

[Authorize]
public class PropertiesController : BaseController
{
    private readonly IApplicationDbContext _dbContext;

    public PropertiesController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// List all properties for the current organisation.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PropertyResponse>>> GetAll()
    {
        var orgId = GetOrganisationId();

        var properties = await _dbContext.Properties
            .Where(p => p.OrganisationId == orgId && p.IsActive)
            .Include(p => p.Jurisdiction)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PropertyResponse(
                p.Id,
                p.Name,
                p.AddressLine1,
                p.AddressLine2,
                p.City,
                p.StateRegion,
                p.Postcode,
                p.CountryCode,
                p.PropertyType,
                p.HostedType,
                p.BedroomCount,
                p.BathroomCount,
                p.MaxGuests,
                p.ComplianceScore,
                p.ComplianceStatus,
                p.JurisdictionId,
                p.Jurisdiction != null ? p.Jurisdiction.Name : null,
                p.Notes,
                p.RegistrationNumber,
                p.CreatedAt
            ))
            .ToListAsync();

        return Ok(properties);
    }

    /// <summary>
    /// Get a single property by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyResponse>> GetById(string id)
    {
        var orgId = GetOrganisationId();

        var p = await _dbContext.Properties
            .Where(p => p.Id == id && p.OrganisationId == orgId && p.IsActive)
            .Include(p => p.Jurisdiction)
            .FirstOrDefaultAsync();

        if (p == null)
            return NotFound();

        var response = new PropertyResponse(
            p.Id,
            p.Name,
            p.AddressLine1,
            p.AddressLine2,
            p.City,
            p.StateRegion,
            p.Postcode,
            p.CountryCode,
            p.PropertyType,
            p.HostedType,
            p.BedroomCount,
            p.BathroomCount,
            p.MaxGuests,
            p.ComplianceScore,
            p.ComplianceStatus,
            p.JurisdictionId,
            p.Jurisdiction?.Name,
            p.Notes,
            p.RegistrationNumber,
            p.CreatedAt
        );

        return Ok(response);
    }

    /// <summary>
    /// Create a new property.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PropertyResponse>> Create([FromBody] CreatePropertyRequest request)
    {
        var orgId = GetOrganisationId();

        var property = new Property
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = orgId,
            Name = request.Name,
            AddressLine1 = request.AddressLine1,
            AddressLine2 = request.AddressLine2,
            City = request.City,
            StateRegion = request.StateRegion,
            Postcode = request.Postcode,
            CountryCode = request.CountryCode,
            PropertyType = request.PropertyType,
            IsPrimaryResidence = request.IsPrimaryResidence,
            OwnerOccupied = request.OwnerOccupied,
            HostedType = request.HostedType,
            BedroomCount = request.BedroomCount,
            BathroomCount = request.BathroomCount,
            MaxGuests = request.MaxGuests,
            AirbnbListingUrl = request.AirbnbListingUrl,
            VrboListingId = request.VrboListingId,
            BookingListingId = request.BookingListingId,
            JurisdictionId = request.JurisdictionId,
            Notes = request.Notes,
            RegistrationNumber = request.RegistrationNumber,
            IsActive = true
        };

        _dbContext.Properties.Add(property);
        await _dbContext.SaveChangesAsync();

        var response = new PropertyResponse(
            property.Id,
            property.Name,
            property.AddressLine1,
            property.AddressLine2,
            property.City,
            property.StateRegion,
            property.Postcode,
            property.CountryCode,
            property.PropertyType,
            property.HostedType,
            property.BedroomCount,
            property.BathroomCount,
            property.MaxGuests,
            property.ComplianceScore,
            property.ComplianceStatus,
            property.JurisdictionId,
            null,
            property.Notes,
            property.RegistrationNumber,
            property.CreatedAt
        );

        return CreatedAtAction(nameof(GetById), new { id = property.Id }, response);
    }

    /// <summary>
    /// Update an existing property.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<PropertyResponse>> Update(string id, [FromBody] UpdatePropertyRequest request)
    {
        var orgId = GetOrganisationId();

        var property = await _dbContext.Properties
            .FirstOrDefaultAsync(p => p.Id == id && p.OrganisationId == orgId && p.IsActive);

        if (property == null)
            return NotFound();

        property.Name = request.Name;
        property.AddressLine1 = request.AddressLine1;
        property.AddressLine2 = request.AddressLine2;
        property.City = request.City;
        property.StateRegion = request.StateRegion;
        property.Postcode = request.Postcode;
        property.CountryCode = request.CountryCode;
        property.PropertyType = request.PropertyType;
        property.IsPrimaryResidence = request.IsPrimaryResidence;
        property.OwnerOccupied = request.OwnerOccupied;
        property.HostedType = request.HostedType;
        property.BedroomCount = request.BedroomCount;
        property.BathroomCount = request.BathroomCount;
        property.MaxGuests = request.MaxGuests;
        property.AirbnbListingUrl = request.AirbnbListingUrl;
        property.VrboListingId = request.VrboListingId;
        property.BookingListingId = request.BookingListingId;
        property.JurisdictionId = string.IsNullOrWhiteSpace(request.JurisdictionId) ? null : request.JurisdictionId;
        property.Notes = request.Notes;
        property.RegistrationNumber = request.RegistrationNumber;
        property.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        var response = new PropertyResponse(
            property.Id,
            property.Name,
            property.AddressLine1,
            property.AddressLine2,
            property.City,
            property.StateRegion,
            property.Postcode,
            property.CountryCode,
            property.PropertyType,
            property.HostedType,
            property.BedroomCount,
            property.BathroomCount,
            property.MaxGuests,
            property.ComplianceScore,
            property.ComplianceStatus,
            property.JurisdictionId,
            null,
            property.Notes,
            property.RegistrationNumber,
            property.CreatedAt
        );

        return Ok(response);
    }

    /// <summary>
    /// Soft delete a property.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var orgId = GetOrganisationId();

        var property = await _dbContext.Properties
            .FirstOrDefaultAsync(p => p.Id == id && p.OrganisationId == orgId && p.IsActive);

        if (property == null)
            return NotFound();

        property.IsActive = false;
        property.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
