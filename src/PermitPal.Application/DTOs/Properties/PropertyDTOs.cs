using PermitPal.Application.DTOs.Jurisdictions;
using PermitPal.Domain.Enums;

namespace PermitPal.Application.DTOs.Properties;

public record CreatePropertyRequest(
    string Name,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string? StateRegion,
    string Postcode,
    string CountryCode,
    PropertyType PropertyType,
    bool IsPrimaryResidence,
    bool OwnerOccupied,
    HostedType HostedType,
    int BedroomCount,
    int BathroomCount,
    int MaxGuests,
    string? AirbnbListingUrl,
    string? VrboListingId,
    string? BookingListingId,
    string? JurisdictionId,
    string? Notes,
    string? RegistrationNumber
);

public record UpdatePropertyRequest(
    string Name,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string? StateRegion,
    string Postcode,
    string CountryCode,
    PropertyType PropertyType,
    bool IsPrimaryResidence,
    bool OwnerOccupied,
    HostedType HostedType,
    int BedroomCount,
    int BathroomCount,
    int MaxGuests,
    string? AirbnbListingUrl,
    string? VrboListingId,
    string? BookingListingId,
    string? JurisdictionId,
    string? Notes,
    string? RegistrationNumber
);

public record PropertyResponse(
    string Id,
    string Name,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string? StateRegion,
    string Postcode,
    string CountryCode,
    PropertyType PropertyType,
    HostedType HostedType,
    int BedroomCount,
    int BathroomCount,
    int MaxGuests,
    byte? ComplianceScore,
    ComplianceStatus ComplianceStatus,
    string? JurisdictionId,
    string? JurisdictionName,
    string? Notes,
    string? RegistrationNumber,
    DateTime CreatedAt
);

public record ComplianceProfileResponse(
    string PropertyId,
    string PropertyName,
    byte ComplianceScore,
    ComplianceStatus Status,
    JurisdictionRulesetResponse? Jurisdiction,
    IEnumerable<PermitSummary> Permits,
    NightCapSummary? NightCap
);

public record PermitSummary(string Id, string PermitType, PermitStatus Status, DateOnly? ExpiryDate);
public record NightCapSummary(int NightsUsed, int? CapLimit, decimal? PctUsed);

public record ComplianceBreakdownDto(
    string PropertyId,
    int TotalScore,
    ComplianceComponent PermitComponent,
    ComplianceComponent NightCapComponent,
    ComplianceComponent RegistrationComponent,
    ComplianceComponent DocumentsComponent,
    ComplianceComponent RenewalComponent,
    List<string> Recommendations
);

public record ComplianceComponent(
    string Name,
    int MaxPoints,
    int EarnedPoints,
    string Status, // "pass", "partial", "fail"
    string Description
);
