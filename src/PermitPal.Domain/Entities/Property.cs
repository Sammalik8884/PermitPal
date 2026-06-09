using PermitPal.Domain.Enums;

namespace PermitPal.Domain.Entities;

public class Property
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrganisationId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string? StateRegion { get; set; }
    public string Postcode { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public decimal? Lat { get; set; }
    public decimal? Lng { get; set; }
    public string? JurisdictionId { get; set; }
    public int BedroomCount { get; set; } = 1;
    public int BathroomCount { get; set; } = 1;
    public int MaxGuests { get; set; } = 2;
    public PropertyType PropertyType { get; set; } = PropertyType.EntireHome;
    public bool IsPrimaryResidence { get; set; }
    public bool OwnerOccupied { get; set; }
    public HostedType HostedType { get; set; } = HostedType.Unhosted;
    public string? AirbnbListingId { get; set; }
    public string? AirbnbListingUrl { get; set; }
    public string? VrboListingId { get; set; }
    public string? BookingListingId { get; set; }
    public byte? ComplianceScore { get; set; }
    public ComplianceStatus ComplianceStatus { get; set; } = ComplianceStatus.Unknown;
    public DateTime? ScoreCalculatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
    public string? RegistrationNumber { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Organisation Organisation { get; set; } = null!;
    public Jurisdiction? Jurisdiction { get; set; }
    public ICollection<Permit> Permits { get; set; } = new List<Permit>();
    public ICollection<NightCapRecord> NightCapRecords { get; set; } = new List<NightCapRecord>();
    public ICollection<BookedNight> BookedNights { get; set; } = new List<BookedNight>();
    public ICollection<ICalFeed> ICalFeeds { get; set; } = new List<ICalFeed>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
