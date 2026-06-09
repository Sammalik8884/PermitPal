using PermitPal.Application.DTOs.Jurisdictions;
using PermitPal.Domain.Entities;

namespace PermitPal.Application.Interfaces;

public interface IJurisdictionResolverService
{
    Task<Jurisdiction?> ResolveAsync(string postcode, string countryCode);
    Task<Jurisdiction?> GetByIdAsync(string id);
    Task<IEnumerable<Jurisdiction>> SearchAsync(string query, int limit = 20);
    Task<List<Jurisdiction>> GetByStateAsync(string countryCode, string stateCode);
    Task<JurisdictionRulesDto> GetRulesAsync(string jurisdictionId);
}
