using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Api.Controllers;
using PermitPal.Application.DTOs.Properties;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;
using PermitPal.Tests.Helpers;
using System.Security.Claims;

namespace PermitPal.Tests.Controllers;

public class PropertiesControllerTests : IDisposable
{
    private readonly Infrastructure.Persistence.PermitPalDbContext _dbContext;
    private readonly PropertiesController _controller;

    public PropertiesControllerTests()
    {
        _dbContext = TestDbContextFactory.Create();

        _controller = new PropertiesController(_dbContext);

        // Set up the controller context with a mock user
        var claims = new List<Claim>
        {
            new Claim("org_id", TestData.TestOrganisationId),
            new Claim(ClaimTypes.NameIdentifier, TestData.TestUserId),
            new Claim("email", "user@testorg.com")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Seed a property
        var property = TestData.TestProperty();
        _dbContext.Properties.Add(property);
        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task GetAll_ReturnsPropertiesForOrganisation()
    {
        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var properties = okResult.Value.Should().BeAssignableTo<IEnumerable<PropertyResponse>>().Subject;
        properties.Should().NotBeEmpty();
        properties.Should().AllSatisfy(p => p.Id.Should().NotBeNullOrEmpty());
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsProperty()
    {
        // Act
        var result = await _controller.GetById(TestData.TestPropertyId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var property = okResult.Value.Should().BeOfType<PropertyResponse>().Subject;
        property.Id.Should().Be(TestData.TestPropertyId);
        property.Name.Should().Be("Test Property");
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        // Act
        var result = await _controller.GetById("non-existent-id");

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task GetById_WithOtherOrganisationProperty_ReturnsNotFound()
    {
        // Arrange - add a property for a different org
        var otherProperty = new Property
        {
            Id = "prp-other-org",
            OrganisationId = "other-org-id",
            Name = "Other Org Property",
            AddressLine1 = "456 Other St",
            City = "Melbourne",
            StateRegion = "VIC",
            Postcode = "3000",
            CountryCode = "AU",
            PropertyType = PropertyType.EntireHome,
            HostedType = HostedType.Unhosted,
            IsPrimaryResidence = true,
            OwnerOccupied = true,
            IsActive = true,
            ComplianceStatus = ComplianceStatus.Unknown
        };
        _dbContext.Properties.Add(otherProperty);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _controller.GetById("prp-other-org");

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task GetAll_ExcludesInactiveProperties()
    {
        // Arrange - add an inactive property
        var inactiveProperty = TestData.TestProperty();
        inactiveProperty.Id = "prp-inactive";
        inactiveProperty.Name = "Inactive Property";
        inactiveProperty.IsActive = false;
        _dbContext.Properties.Add(inactiveProperty);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var properties = okResult.Value.Should().BeAssignableTo<IEnumerable<PropertyResponse>>().Subject;
        properties.Should().NotContain(p => p.Id == "prp-inactive");
    }

    [Fact]
    public async Task GetAll_ReturnsPropertiesOrderedByCreatedAtDescending()
    {
        // Arrange - add another property with earlier creation date
        var olderProperty = TestData.TestProperty();
        olderProperty.Id = "prp-older";
        olderProperty.Name = "Older Property";
        olderProperty.CreatedAt = DateTime.UtcNow.AddDays(-30);
        _dbContext.Properties.Add(olderProperty);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var properties = okResult.Value.Should().BeAssignableTo<IEnumerable<PropertyResponse>>().Subject;
        var list = properties.ToList();
        if (list.Count > 1)
        {
            list[0].CreatedAt.Should().BeOnOrAfter(list[1].CreatedAt);
        }
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}
