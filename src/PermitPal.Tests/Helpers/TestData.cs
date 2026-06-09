using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Tests.Helpers;

/// <summary>
/// Static class with pre-built test entities for unit tests.
/// </summary>
public static class TestData
{
    public static readonly string TestOrganisationId = "org-test-00000000-0000-0000-0000-000000000001";
    public static readonly string TestUserId = "usr-test-00000000-0000-0000-0000-000000000001";
    public static readonly string TestPropertyId = "prp-test-00000000-0000-0000-0000-000000000001";
    public static readonly string TestJurisdictionId = "jur-test-00000000-0000-0000-0000-000000000001";

    public static Organisation TestOrganisation() => new()
    {
        Id = TestOrganisationId,
        Name = "Test Organisation",
        Slug = "test-organisation",
        Country = "AU",
        Timezone = "Australia/Sydney",
        Email = "admin@testorg.com",
        SubscriptionPlan = SubscriptionPlan.Host,
        SubscriptionStatus = SubscriptionStatus.Active,
        MaxProperties = 5,
        MaxTeamSeats = 3
    };

    public static User TestUser() => new()
    {
        Id = TestUserId,
        OrganisationId = TestOrganisationId,
        Email = "user@testorg.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TestPassword123!"),
        FirstName = "Test",
        LastName = "User",
        Role = UserRole.Owner,
        IsActive = true,
        RefreshToken = "valid-refresh-token-base64",
        RefreshTokenExpires = DateTime.UtcNow.AddDays(30)
    };

    public static Property TestProperty(string? jurisdictionId = null) => new()
    {
        Id = TestPropertyId,
        OrganisationId = TestOrganisationId,
        Name = "Test Property",
        AddressLine1 = "123 Test Street",
        City = "Sydney",
        StateRegion = "NSW",
        Postcode = "2000",
        CountryCode = "AU",
        PropertyType = PropertyType.EntireHome,
        HostedType = HostedType.Unhosted,
        IsPrimaryResidence = true,
        OwnerOccupied = true,
        JurisdictionId = jurisdictionId ?? TestJurisdictionId,
        IsActive = true,
        AirbnbListingId = "12345678",
        ComplianceScore = null,
        ComplianceStatus = ComplianceStatus.Unknown
    };

    public static Jurisdiction TestJurisdiction() => new()
    {
        Id = TestJurisdictionId,
        CountryCode = "AU",
        Name = "City of Sydney",
        Slug = "city-of-sydney",
        JurisdictionType = JurisdictionType.Lga,
        PermitRequired = true,
        PermitType = "Short-Term Rental Registration",
        NightCapUnhosted = 180,
        NightCapHosted = null,
        PrimaryResidenceRequired = true,
        TotRatePct = null,
        AuFireSafetyStandard = "AS3786",
        IsActive = true,
        EnforcementLevel = EnforcementLevel.High
    };

    public static Permit TestPermit(PermitStatus status = PermitStatus.Active) => new()
    {
        Id = Guid.NewGuid().ToString(),
        OrganisationId = TestOrganisationId,
        PropertyId = TestPropertyId,
        PermitType = "Short-Term Rental Registration",
        PermitNumber = "STR-2024-001",
        Status = status,
        IssuedDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6)),
        ExpiryDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(6)),
        CreatedAt = DateTime.UtcNow
    };

    public static JurisdictionPostcode TestJurisdictionPostcode() => new()
    {
        Postcode = "2000",
        CountryCode = "AU",
        JurisdictionId = TestJurisdictionId,
        IsPrimary = true
    };

    public static NightCapRecord TestNightCapRecord(int nightsUsed = 50, int? capLimit = 180) => new()
    {
        Id = Guid.NewGuid().ToString(),
        OrganisationId = TestOrganisationId,
        PropertyId = TestPropertyId,
        CalendarYear = (short)DateTime.UtcNow.Year,
        CapLimit = capLimit,
        NightsUsed = nightsUsed
    };

    public static ICalFeed TestICalFeed() => new()
    {
        Id = Guid.NewGuid().ToString(),
        OrganisationId = TestOrganisationId,
        PropertyId = TestPropertyId,
        Platform = BookingSource.Airbnb,
        ICalUrl = "https://www.airbnb.com/calendar/ical/12345.ics",
        LastSyncStatus = SyncStatus.Pending,
        IsActive = true
    };

    public static string ValidICalContent => @"BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:20240301
DTEND;VALUE=DATE:20240304
SUMMARY:Guest Booking - John
END:VEVENT
BEGIN:VEVENT
DTSTART:20240310T140000Z
DTEND:20240312T100000Z
SUMMARY:Airbnb (ABC123)
END:VEVENT
END:VCALENDAR";
}
