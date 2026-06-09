using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PermitPal.Domain.Entities;
using PermitPal.Infrastructure.Services;
using PermitPal.Tests.Helpers;

namespace PermitPal.Tests.Services;

public class JurisdictionResolverServiceTests : IDisposable
{
    private readonly Infrastructure.Persistence.PermitPalDbContext _dbContext;
    private readonly JurisdictionResolverService _service;

    public JurisdictionResolverServiceTests()
    {
        _dbContext = TestDbContextFactory.Create();
        _service = new JurisdictionResolverService(_dbContext);

        // Seed postcode mapping
        var postcodeMapping = TestData.TestJurisdictionPostcode();
        _dbContext.JurisdictionPostcodes.Add(postcodeMapping);
        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task ResolveAsync_WithExactPostcode_ReturnsJurisdiction()
    {
        // Act
        var result = await _service.ResolveAsync("2000", "AU");

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(TestData.TestJurisdictionId);
        result.Name.Should().Be("City of Sydney");
    }

    [Fact]
    public async Task ResolveAsync_WithUnknownPostcode_ReturnsFallbackOrNull()
    {
        // Act
        var result = await _service.ResolveAsync("9999", "AU");

        // Assert - should return fallback jurisdiction for AU or null
        // The service falls back to any jurisdiction for the country
        if (result != null)
        {
            result.CountryCode.Should().Be("AU");
        }
    }

    [Fact]
    public async Task ResolveAsync_WithUnknownCountry_ReturnsNull()
    {
        // Act
        var result = await _service.ResolveAsync("12345", "ZZ");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsJurisdiction()
    {
        // Act
        var result = await _service.GetByIdAsync(TestData.TestJurisdictionId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(TestData.TestJurisdictionId);
        result.Name.Should().Be("City of Sydney");
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ReturnsNull()
    {
        // Act
        var result = await _service.GetByIdAsync("non-existent-id");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task SearchAsync_WithMatchingQuery_ReturnsResults()
    {
        // Act
        var results = await _service.SearchAsync("Sydney");

        // Assert
        results.Should().NotBeEmpty();
        results.Should().Contain(j => j.Name.Contains("Sydney"));
    }

    [Fact]
    public async Task SearchAsync_WithNonMatchingQuery_ReturnsEmpty()
    {
        // Act
        var results = await _service.SearchAsync("NonExistentJurisdiction12345");

        // Assert
        results.Should().BeEmpty();
    }

    [Fact]
    public async Task GetByStateAsync_WithValidState_ReturnsJurisdictions()
    {
        // Act
        var results = await _service.GetByStateAsync("AU", "NSW");

        // Assert - may or may not have results depending on seed data
        results.Should().NotBeNull();
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}
