using PermitPal.Application.DTOs.AuCompliance;

namespace PermitPal.Application.Interfaces;

public interface IAuComplianceService
{
    Task<AuLevySummaryDto> GetLevySummaryAsync(Guid propertyId, int year);
    Task<AuLevyRecordDto> RecordLevyPaymentAsync(Guid propertyId, decimal amount, DateTime paidDate, string? reference);
    Task<List<AuLevyRecordDto>> GetLevyHistoryAsync(Guid propertyId);
    Task<AuFireSafetyDto> GetFireSafetyStatusAsync(Guid propertyId);
    Task<AuFireSafetyDto> UpdateFireSafetyAsync(Guid propertyId, UpdateFireSafetyRequest request);
    Task<List<AuComplaintDto>> GetComplaintsAsync(Guid propertyId);
    Task<AuComplaintDto> LogComplaintAsync(Guid propertyId, CreateComplaintRequest request);
    Task<AuComplaintDto> UpdateComplaintAsync(Guid complaintId, UpdateComplaintRequest request);
}
