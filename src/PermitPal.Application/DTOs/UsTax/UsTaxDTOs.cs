namespace PermitPal.Application.DTOs.UsTax;

public record UsTaxSummaryDto(
    Guid PropertyId,
    int Year,
    string TaxType,
    decimal TaxRate,
    decimal TotalRevenue,
    decimal TotalTaxOwed,
    decimal TotalTaxPaid,
    decimal Balance,
    string Status
);

public record UsTaxRecordDto(
    Guid Id,
    Guid PropertyId,
    string TaxType,
    string Period,
    decimal Amount,
    DateTime PaidDate,
    string? Reference,
    DateTime CreatedAt
);

public record CreateUsTaxRecordRequest(
    string TaxType,
    string Period,
    decimal Amount,
    DateTime PaidDate,
    string? Reference
);
