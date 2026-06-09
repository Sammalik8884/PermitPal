using PermitPal.Application.DTOs.UsTax;

namespace PermitPal.Application.Interfaces;

public interface IUsTaxService
{
    Task<UsTaxSummaryDto> GetTaxSummaryAsync(Guid propertyId, int year);
    Task<UsTaxRecordDto> RecordTaxPaymentAsync(Guid propertyId, CreateUsTaxRecordRequest request);
    Task<List<UsTaxRecordDto>> GetTaxHistoryAsync(Guid propertyId);
}
