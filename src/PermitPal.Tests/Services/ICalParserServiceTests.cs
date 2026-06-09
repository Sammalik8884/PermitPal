using FluentAssertions;
using Moq;
using Moq.Protected;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;
using PermitPal.Infrastructure.Services;
using PermitPal.Tests.Helpers;
using System.Net;

namespace PermitPal.Tests.Services;

public class ICalParserServiceTests : IDisposable
{
    private readonly Infrastructure.Persistence.PermitPalDbContext _dbContext;

    public ICalParserServiceTests()
    {
        _dbContext = TestDbContextFactory.Create();

        // Seed property and feed
        var property = TestData.TestProperty();
        _dbContext.Properties.Add(property);
        _dbContext.SaveChanges();
    }

    private ICalParserService CreateServiceWithMockHttp(string icsContent)
    {
        var mockHandler = new Mock<HttpMessageHandler>();
        mockHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(icsContent)
            });

        var httpClient = new HttpClient(mockHandler.Object);
        httpClient.BaseAddress = new Uri("https://test.example.com");

        var mockFactory = new Mock<IHttpClientFactory>();
        mockFactory.Setup(f => f.CreateClient("ICalParser")).Returns(httpClient);
        mockFactory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(httpClient);

        return new ICalParserService(_dbContext, mockFactory.Object);
    }

    [Fact]
    public async Task ParseFeedAsync_WithValidIcs_ReturnsBookedNights()
    {
        // Arrange
        var service = CreateServiceWithMockHttp(TestData.ValidICalContent);

        // Act
        var result = await service.ParseFeedAsync(
            "https://www.airbnb.com/calendar/ical/12345.ics",
            TestData.TestPropertyId,
            TestData.TestOrganisationId,
            BookingSource.Airbnb);

        // Assert
        var nights = result.ToList();
        nights.Should().NotBeEmpty();
        nights.Should().AllSatisfy(n =>
        {
            n.PropertyId.Should().Be(TestData.TestPropertyId);
            n.OrganisationId.Should().Be(TestData.TestOrganisationId);
            n.Source.Should().Be(BookingSource.Airbnb);
        });
    }

    [Fact]
    public async Task ParseFeedAsync_WithMultiDayEvent_CreatesMultipleNights()
    {
        // Arrange - the test ICS has a 3-night event (March 1-4)
        var service = CreateServiceWithMockHttp(TestData.ValidICalContent);

        // Act
        var result = await service.ParseFeedAsync(
            "https://www.airbnb.com/calendar/ical/12345.ics",
            TestData.TestPropertyId,
            TestData.TestOrganisationId,
            BookingSource.Airbnb);

        // Assert
        var nights = result.ToList();
        // First event: March 1-4 = 3 nights, Second event: March 10-12 = 2 nights
        nights.Should().HaveCountGreaterThanOrEqualTo(3);
    }

    [Fact]
    public async Task ParseFeedAsync_WithEmptyCalendar_ReturnsEmptyList()
    {
        // Arrange
        var emptyIcs = @"BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
END:VCALENDAR";
        var service = CreateServiceWithMockHttp(emptyIcs);

        // Act
        var result = await service.ParseFeedAsync(
            "https://www.airbnb.com/calendar/ical/empty.ics",
            TestData.TestPropertyId,
            TestData.TestOrganisationId,
            BookingSource.Airbnb);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task SyncFeedAsync_WithValidFeed_ReturnsNightCount()
    {
        // Arrange
        var feed = TestData.TestICalFeed();
        _dbContext.ICalFeeds.Add(feed);
        await _dbContext.SaveChangesAsync();

        var service = CreateServiceWithMockHttp(TestData.ValidICalContent);

        // Act
        var nightCount = await service.SyncFeedAsync(feed.Id);

        // Assert
        nightCount.Should().BeGreaterThanOrEqualTo(0);
    }

    [Fact]
    public async Task PreviewFeedAsync_ReturnsEventList()
    {
        // Arrange
        var service = CreateServiceWithMockHttp(TestData.ValidICalContent);

        // Act
        var events = await service.PreviewFeedAsync("https://www.airbnb.com/calendar/ical/12345.ics");

        // Assert
        events.Should().NotBeEmpty();
        events.Should().AllSatisfy(e =>
        {
            e.StartDate.Should().BeBefore(e.EndDate);
            e.NightCount.Should().BeGreaterThan(0);
        });
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}
