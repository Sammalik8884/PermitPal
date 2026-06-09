namespace PermitPal.Application.DTOs.EuRegistration;

public record EuRegistrationProgressDto(
    Guid PropertyId,
    string PropertyName,
    string Status,
    int CompletedSteps,
    int TotalSteps,
    decimal PercentComplete,
    List<RegistrationStepDto> Steps,
    string? RegistrationNumber,
    DateTime? CompletedAt
);

public record RegistrationStepDto(
    string StepName,
    string DisplayName,
    string Description,
    bool IsCompleted,
    DateTime? CompletedAt,
    int Order
);

public record EuRegistrationRequirementDto(
    string CountryCode,
    string CountryName,
    string? StateCode,
    List<string> RequiredDocuments,
    List<string> RequiredSteps,
    string? RegistrationPortalUrl,
    string? Notes
);
