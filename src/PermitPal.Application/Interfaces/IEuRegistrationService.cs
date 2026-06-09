using PermitPal.Application.DTOs.EuRegistration;

namespace PermitPal.Application.Interfaces;

public interface IEuRegistrationService
{
    Task<EuRegistrationProgressDto> GetProgressAsync(Guid propertyId);
    Task<EuRegistrationProgressDto> UpdateStepAsync(Guid propertyId, string stepName, bool completed);
    Task<string> GenerateRegistrationNumberAsync(Guid propertyId);
    Task<List<EuRegistrationRequirementDto>> GetRequirementsAsync(string countryCode, string? stateCode);
}
