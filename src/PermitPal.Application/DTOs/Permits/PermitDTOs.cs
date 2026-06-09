using PermitPal.Domain.Enums;

namespace PermitPal.Application.DTOs.Permits;

public record CreatePermitRequest(
    string PropertyId,
    string PermitType,
    string? PermitNumber,
    string? IssuingAuthority,
    PermitStatus Status,
    DateOnly? IssuedDate,
    DateOnly? ExpiryDate,
    string? RenewalUrl,
    string? EuRegistrationNumber,
    string? Notes
);

public record UpdatePermitRequest(
    string PermitType,
    string? PermitNumber,
    PermitStatus Status,
    string? IssuingAuthority,
    DateOnly? IssuedDate,
    DateOnly? ExpiryDate,
    string? RenewalUrl,
    string? Notes
);

public record PermitResponse(
    string Id,
    string PropertyId,
    string PermitType,
    string? PermitNumber,
    PermitStatus Status,
    string? IssuingAuthority,
    DateOnly? IssuedDate,
    DateOnly? ExpiryDate,
    string? RenewalUrl,
    int? DaysUntilExpiry,
    DateTime CreatedAt
);
