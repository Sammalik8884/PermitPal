using PermitPal.Application.DTOs.Properties;
using PermitPal.Domain.Entities;

namespace PermitPal.Application.Interfaces;

public interface IComplianceScoreService
{
    Task<byte> CalculateScoreAsync(Property property);
    Task RecalculateAllAsync(string organisationId);
    Task<int> CalculateScoreAsync(string propertyId);
    Task<ComplianceBreakdownDto> GetBreakdownAsync(string propertyId);
}
