using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermitPal.Application.DTOs.UsTax;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Controllers;

[Authorize]
[Route("api/us-tax")]
public class UsTaxController : BaseController
{
    private readonly IUsTaxService _usTaxService;

    public UsTaxController(IUsTaxService usTaxService)
    {
        _usTaxService = usTaxService;
    }

    /// <summary>
    /// Get tax summary for a property.
    /// </summary>
    [HttpGet("{propertyId}/summary")]
    public async Task<IActionResult> GetTaxSummary(Guid propertyId, [FromQuery] int? year = null)
    {
        var targetYear = year ?? DateTime.UtcNow.Year;
        var summary = await _usTaxService.GetTaxSummaryAsync(propertyId, targetYear);
        return Ok(summary);
    }

    /// <summary>
    /// Record a tax payment.
    /// </summary>
    [HttpPost("{propertyId}/payment")]
    public async Task<IActionResult> RecordTaxPayment(Guid propertyId, [FromBody] CreateUsTaxRecordRequest request)
    {
        var record = await _usTaxService.RecordTaxPaymentAsync(propertyId, request);
        return Ok(record);
    }

    /// <summary>
    /// Get tax payment history.
    /// </summary>
    [HttpGet("{propertyId}/history")]
    public async Task<IActionResult> GetTaxHistory(Guid propertyId)
    {
        var history = await _usTaxService.GetTaxHistoryAsync(propertyId);
        return Ok(history);
    }
}
