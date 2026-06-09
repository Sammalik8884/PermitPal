using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermitPal.Application.DTOs.AuCompliance;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Controllers;

[Authorize]
[Route("api/au-compliance")]
public class AuComplianceController : BaseController
{
    private readonly IAuComplianceService _auComplianceService;

    public AuComplianceController(IAuComplianceService auComplianceService)
    {
        _auComplianceService = auComplianceService;
    }

    // --- Levy ---

    /// <summary>
    /// Get levy summary for a property.
    /// </summary>
    [HttpGet("levy/{propertyId}")]
    public async Task<IActionResult> GetLevySummary(Guid propertyId, [FromQuery] int? year = null)
    {
        var targetYear = year ?? DateTime.UtcNow.Year;
        var summary = await _auComplianceService.GetLevySummaryAsync(propertyId, targetYear);
        return Ok(summary);
    }

    /// <summary>
    /// Record a levy payment.
    /// </summary>
    [HttpPost("levy/{propertyId}/payment")]
    public async Task<IActionResult> RecordLevyPayment(Guid propertyId, [FromBody] RecordLevyPaymentRequest request)
    {
        var record = await _auComplianceService.RecordLevyPaymentAsync(
            propertyId, request.Amount, request.PaidDate, request.Reference);
        return Ok(record);
    }

    /// <summary>
    /// Get levy payment history.
    /// </summary>
    [HttpGet("levy/{propertyId}/history")]
    public async Task<IActionResult> GetLevyHistory(Guid propertyId)
    {
        var history = await _auComplianceService.GetLevyHistoryAsync(propertyId);
        return Ok(history);
    }

    // --- Fire Safety ---

    /// <summary>
    /// Get fire safety status for a property.
    /// </summary>
    [HttpGet("fire-safety/{propertyId}")]
    public async Task<IActionResult> GetFireSafetyStatus(Guid propertyId)
    {
        var status = await _auComplianceService.GetFireSafetyStatusAsync(propertyId);
        return Ok(status);
    }

    /// <summary>
    /// Update fire safety record.
    /// </summary>
    [HttpPut("fire-safety/{propertyId}")]
    public async Task<IActionResult> UpdateFireSafety(Guid propertyId, [FromBody] UpdateFireSafetyRequest request)
    {
        var status = await _auComplianceService.UpdateFireSafetyAsync(propertyId, request);
        return Ok(status);
    }

    // --- Complaints ---

    /// <summary>
    /// List complaints for a property.
    /// </summary>
    [HttpGet("complaints/{propertyId}")]
    public async Task<IActionResult> GetComplaints(Guid propertyId)
    {
        var complaints = await _auComplianceService.GetComplaintsAsync(propertyId);
        return Ok(complaints);
    }

    /// <summary>
    /// Log a new complaint.
    /// </summary>
    [HttpPost("complaints/{propertyId}")]
    public async Task<IActionResult> LogComplaint(Guid propertyId, [FromBody] CreateComplaintRequest request)
    {
        var complaint = await _auComplianceService.LogComplaintAsync(propertyId, request);
        return Ok(complaint);
    }

    /// <summary>
    /// Update a complaint.
    /// </summary>
    [HttpPut("complaints/{complaintId}")]
    public async Task<IActionResult> UpdateComplaint(Guid complaintId, [FromBody] UpdateComplaintRequest request)
    {
        var complaint = await _auComplianceService.UpdateComplaintAsync(complaintId, request);
        return Ok(complaint);
    }
}

public record RecordLevyPaymentRequest(decimal Amount, DateTime PaidDate, string? Reference);
