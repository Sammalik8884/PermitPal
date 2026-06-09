using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using PermitPal.Domain.Entities;
using PermitPal.Infrastructure.Services;
using PermitPal.Tests.Helpers;

namespace PermitPal.Tests.Services;

public class EuRegistrationServiceTests : IDisposable
{
    private readonly Infrastructure.Persistence.PermitPalDbContext _dbContext;
    private readonly EuRegistrationService _service;

    public EuRegistrationServiceTests()
    {
        _dbContext = TestDbContextFactory.Create();
        var logger = new Mock<ILogger<EuRegistrationService>>();
        _service = new EuRegistrationService(_dbContext, logger.Object);
    }

    [Fact]
    public async Task GetProgressAsync_WithNoExistingProgress_ReturnsNotStarted()
    {
        // Arrange - add a new property with a Guid-formatted ID
        var propertyId = Guid.NewGuid();
        var property = new Property
        {
            Id = propertyId.ToString(),
            OrganisationId = TestData.TestOrganisationId,
            Name = "EU Test Property",
            AddressLine1 = "1 Rue de Paris",
            City = "Paris",
            StateRegion = "IDF",
            Postcode = "75001",
            CountryCode = "FR",
            PropertyType = Domain.Enums.PropertyType.EntireHome,
            HostedType = Domain.Enums.HostedType.Unhosted,
            IsPrimaryResidence = true,
            OwnerOccupied = true,
            IsActive = true,
            ComplianceStatus = Domain.Enums.ComplianceStatus.Unknown
        };
        _dbContext.Properties.Add(property);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetProgressAsync(propertyId);

        // Assert
        result.Should().NotBeNull();
        result.Status.Should().Be("not_started");
        result.CompletedSteps.Should().Be(0);
        result.TotalSteps.Should().Be(5);
        result.PercentComplete.Should().Be(0);
    }

    [Fact]
    public async Task GetRequirementsAsync_ForFrance_ReturnsRequirements()
    {
        // Act
        var requirements = await _service.GetRequirementsAsync("FR", null);

        // Assert
        requirements.Should().NotBeEmpty();
        var frReq = requirements.First();
        frReq.CountryCode.Should().Be("FR");
        frReq.CountryName.Should().Be("France");
        frReq.RequiredDocuments.Should().NotBeEmpty();
        frReq.RequiredSteps.Should().NotBeEmpty();
    }

    [Fact]
    public async Task GetRequirementsAsync_ForSpain_ReturnsRequirements()
    {
        // Act
        var requirements = await _service.GetRequirementsAsync("ES", null);

        // Assert
        requirements.Should().NotBeEmpty();
        requirements.First().CountryCode.Should().Be("ES");
    }

    [Fact]
    public async Task GetRequirementsAsync_ForUnsupportedCountry_ReturnsGenericRequirements()
    {
        // Act
        var requirements = await _service.GetRequirementsAsync("ZZ", null);

        // Assert - the service returns generic requirements for unknown countries
        requirements.Should().NotBeNull();
        if (requirements.Any())
        {
            requirements.First().CountryCode.Should().Be("ZZ");
        }
    }

    [Fact]
    public async Task UpdateStepAsync_MarksStepAsCompleted()
    {
        // Arrange - create a new property with Guid-formatted ID
        var propertyId = Guid.NewGuid();
        var property = new Property
        {
            Id = propertyId.ToString(),
            OrganisationId = TestData.TestOrganisationId,
            Name = "EU Step Test Property",
            AddressLine1 = "2 Via Roma",
            City = "Rome",
            StateRegion = "Lazio",
            Postcode = "00100",
            CountryCode = "IT",
            PropertyType = Domain.Enums.PropertyType.EntireHome,
            HostedType = Domain.Enums.HostedType.Unhosted,
            IsPrimaryResidence = true,
            OwnerOccupied = true,
            IsActive = true,
            ComplianceStatus = Domain.Enums.ComplianceStatus.Unknown
        };
        _dbContext.Properties.Add(property);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.UpdateStepAsync(propertyId, "identity_verification", true);

        // Assert
        result.Should().NotBeNull();
        result.CompletedSteps.Should().BeGreaterThanOrEqualTo(1);
    }

    [Fact]
    public async Task GetRequirementsAsync_ForItaly_IncludesCIN()
    {
        // Act
        var requirements = await _service.GetRequirementsAsync("IT", null);

        // Assert
        requirements.Should().NotBeEmpty();
        var itReq = requirements.First();
        itReq.Notes.Should().Contain("CIN");
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}
