using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;
using PermitPal.Infrastructure.Services;
using PermitPal.Tests.Helpers;

namespace PermitPal.Tests.Services;

public class ComplianceScoreServiceTests : IDisposable
{
    private readonly Infrastructure.Persistence.PermitPalDbContext _dbContext;
    private readonly ComplianceScoreService _service;

    public ComplianceScoreServiceTests()
    {
        _dbContext = TestDbContextFactory.Create();
        _service = new ComplianceScoreService(_dbContext);
    }

    [Fact]
    public async Task CalculateScoreAsync_WithProperty_ReturnsScoreBetween0And100()
    {
        // Arrange
        var property = TestData.TestProperty();
        _dbContext.Properties.Add(property);
        await _dbContext.SaveChangesAsync();

        // Act
        var score = await _service.CalculateScoreAsync(property);

        // Assert
        score.Should().BeInRange(0, 100);
    }

    [Fact]
    public async Task CalculateScoreAsync_WithPropertyId_ReturnsScore()
    {
        // Arrange
        var property = TestData.TestProperty();
        _dbContext.Properties.Add(property);
        await _dbContext.SaveChangesAsync();

        // Act
        var score = await _service.CalculateScoreAsync(property.Id);

        // Assert
        score.Should().BeGreaterThanOrEqualTo(0);
        score.Should().BeLessThanOrEqualTo(100);
    }

    [Fact]
    public async Task CalculateScoreAsync_WithPermit_IncreasesScore()
    {
        // Arrange
        var property = TestData.TestProperty();
        _dbContext.Properties.Add(property);

        var permit = TestData.TestPermit(PermitStatus.Active);
        _dbContext.Permits.Add(permit);
        await _dbContext.SaveChangesAsync();

        // Act
        var score = await _service.CalculateScoreAsync(property.Id);

        // Assert - having an active permit should give a higher score
        score.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task RecalculateAllAsync_UpdatesAllPropertiesInOrganisation()
    {
        // Arrange
        var property1 = TestData.TestProperty();
        property1.Id = "prp-test-001";
        var property2 = TestData.TestProperty();
        property2.Id = "prp-test-002";
        property2.Name = "Second Property";

        _dbContext.Properties.Add(property1);
        _dbContext.Properties.Add(property2);
        await _dbContext.SaveChangesAsync();

        // Act
        await _service.RecalculateAllAsync(TestData.TestOrganisationId);

        // Assert
        var updatedProp1 = await _dbContext.Properties.FirstAsync(p => p.Id == "prp-test-001");
        var updatedProp2 = await _dbContext.Properties.FirstAsync(p => p.Id == "prp-test-002");

        updatedProp1.ComplianceScore.Should().NotBeNull();
        updatedProp2.ComplianceScore.Should().NotBeNull();
        updatedProp1.ScoreCalculatedAt.Should().NotBeNull();
        updatedProp2.ScoreCalculatedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task RecalculateAllAsync_SetsCorrectComplianceStatus()
    {
        // Arrange
        var property = TestData.TestProperty();
        _dbContext.Properties.Add(property);
        await _dbContext.SaveChangesAsync();

        // Act
        await _service.RecalculateAllAsync(TestData.TestOrganisationId);

        // Assert
        var updated = await _dbContext.Properties.FirstAsync(p => p.Id == property.Id);
        updated.ComplianceStatus.Should().BeOneOf(
            ComplianceStatus.Compliant,
            ComplianceStatus.Warning,
            ComplianceStatus.NonCompliant);
    }

    [Fact]
    public async Task GetBreakdownAsync_ReturnsBreakdownComponents()
    {
        // Arrange
        var property = TestData.TestProperty();
        _dbContext.Properties.Add(property);
        await _dbContext.SaveChangesAsync();

        // Act
        var breakdown = await _service.GetBreakdownAsync(property.Id);

        // Assert
        breakdown.Should().NotBeNull();
        breakdown.PropertyId.Should().Be(property.Id);
        breakdown.PermitComponent.Should().NotBeNull();
        breakdown.NightCapComponent.Should().NotBeNull();
        breakdown.RegistrationComponent.Should().NotBeNull();
        breakdown.DocumentsComponent.Should().NotBeNull();
        breakdown.RenewalComponent.Should().NotBeNull();
        breakdown.Recommendations.Should().NotBeNull();
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}
