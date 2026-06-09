using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;
using PermitPal.Infrastructure.Services;
using PermitPal.Tests.Helpers;

namespace PermitPal.Tests.Services;

public class NightCapServiceTests : IDisposable
{
    private readonly Infrastructure.Persistence.PermitPalDbContext _dbContext;
    private readonly NightCapService _service;

    public NightCapServiceTests()
    {
        _dbContext = TestDbContextFactory.Create();
        _service = new NightCapService(_dbContext);

        // Seed a property with jurisdiction for night cap tests
        var property = TestData.TestProperty();
        _dbContext.Properties.Add(property);
        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task GetOrCreateRecordAsync_CreatesNewRecord_WhenNoneExists()
    {
        // Arrange
        var year = (short)DateTime.UtcNow.Year;

        // Act
        var record = await _service.GetOrCreateRecordAsync(TestData.TestPropertyId, year);

        // Assert
        record.Should().NotBeNull();
        record.PropertyId.Should().Be(TestData.TestPropertyId);
        record.CalendarYear.Should().Be(year);
        record.NightsUsed.Should().Be(0);
        record.CapLimit.Should().Be(180); // From TestJurisdiction NightCapUnhosted
    }

    [Fact]
    public async Task GetOrCreateRecordAsync_ReturnsExistingRecord_WhenExists()
    {
        // Arrange
        var year = (short)DateTime.UtcNow.Year;
        var existingRecord = TestData.TestNightCapRecord(nightsUsed: 25, capLimit: 180);
        existingRecord.CalendarYear = year;
        _dbContext.NightCapRecords.Add(existingRecord);
        await _dbContext.SaveChangesAsync();

        // Act
        var record = await _service.GetOrCreateRecordAsync(TestData.TestPropertyId, year);

        // Assert
        record.Should().NotBeNull();
        record.NightsUsed.Should().Be(25);
    }

    [Fact]
    public async Task GetNightCapSummaryAsync_ReturnsCorrectSummary()
    {
        // Arrange
        var year = (short)DateTime.UtcNow.Year;
        var nightCapRecord = TestData.TestNightCapRecord(nightsUsed: 90, capLimit: 180);
        nightCapRecord.CalendarYear = year;
        _dbContext.NightCapRecords.Add(nightCapRecord);
        await _dbContext.SaveChangesAsync();

        // Act
        var summary = await _service.GetNightCapSummaryAsync(TestData.TestPropertyId, year);

        // Assert
        summary.Should().NotBeNull();
        summary.PropertyId.Should().Be(TestData.TestPropertyId);
        summary.Year.Should().Be(year);
        summary.NightsUsed.Should().Be(90);
        summary.NightCap.Should().Be(180);
        summary.NightsRemaining.Should().Be(90);
    }

    [Fact]
    public async Task RecalculateNightsAsync_UpdatesNightsUsedFromBookedNights()
    {
        // Arrange
        var year = (short)DateTime.UtcNow.Year;
        var nightCapRecord = TestData.TestNightCapRecord(nightsUsed: 0, capLimit: 180);
        nightCapRecord.CalendarYear = year;
        _dbContext.NightCapRecords.Add(nightCapRecord);

        // Add some booked nights
        for (int i = 1; i <= 5; i++)
        {
            _dbContext.BookedNights.Add(new BookedNight
            {
                Id = Guid.NewGuid().ToString(),
                OrganisationId = TestData.TestOrganisationId,
                PropertyId = TestData.TestPropertyId,
                NightDate = new DateOnly(year, 3, i),
                Source = BookingSource.Airbnb,
                BookingRef = $"Booking-{i}",
                CreatedAt = DateTime.UtcNow
            });
        }
        await _dbContext.SaveChangesAsync();

        // Act
        await _service.RecalculateNightsAsync(TestData.TestPropertyId, year);

        // Assert
        var updated = await _dbContext.NightCapRecords
            .FirstAsync(r => r.PropertyId == TestData.TestPropertyId && r.CalendarYear == year);
        updated.NightsUsed.Should().Be(5);
    }

    [Fact]
    public async Task AddManualNightsAsync_AddsBookedNightsToDatabase()
    {
        // Arrange
        var year = (short)DateTime.UtcNow.Year;
        var dates = new List<DateOnly>
        {
            new DateOnly(year, 6, 1),
            new DateOnly(year, 6, 2),
            new DateOnly(year, 6, 3)
        };

        // Ensure a NightCapRecord exists
        var record = TestData.TestNightCapRecord(nightsUsed: 10, capLimit: 180);
        record.CalendarYear = year;
        _dbContext.NightCapRecords.Add(record);
        await _dbContext.SaveChangesAsync();

        // Act
        await _service.AddManualNightsAsync(TestData.TestPropertyId, TestData.TestOrganisationId, dates, "Manual Guest");

        // Assert
        var bookedNights = await _dbContext.BookedNights
            .Where(b => b.PropertyId == TestData.TestPropertyId && b.Source == BookingSource.Manual)
            .ToListAsync();
        bookedNights.Should().HaveCount(3);
        bookedNights.Should().AllSatisfy(b => b.BookingRef.Should().Contain("Manual Guest"));
    }

    [Fact]
    public async Task GetBookedNightsAsync_ReturnsNightsForMonth()
    {
        // Arrange
        var year = (short)DateTime.UtcNow.Year;
        _dbContext.BookedNights.Add(new BookedNight
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = TestData.TestOrganisationId,
            PropertyId = TestData.TestPropertyId,
            NightDate = new DateOnly(year, 4, 15),
            Source = BookingSource.Airbnb,
            BookingRef = "April Booking",
            CreatedAt = DateTime.UtcNow
        });
        _dbContext.BookedNights.Add(new BookedNight
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = TestData.TestOrganisationId,
            PropertyId = TestData.TestPropertyId,
            NightDate = new DateOnly(year, 5, 1),
            Source = BookingSource.Vrbo,
            BookingRef = "May Booking",
            CreatedAt = DateTime.UtcNow
        });
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetBookedNightsAsync(TestData.TestPropertyId, year, 4);

        // Assert
        result.Should().HaveCount(1);
        result[0].Date.Should().Be(new DateOnly(year, 4, 15));
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}
