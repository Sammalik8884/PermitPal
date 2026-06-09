using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermitPal.Application.DTOs.NightCaps;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Controllers;

[Authorize]
public class NightCapsController : BaseController
{
    private readonly INightCapService _nightCapService;

    public NightCapsController(INightCapService nightCapService)
    {
        _nightCapService = nightCapService;
    }

    /// <summary>
    /// Get night cap summary for a property and year.
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<NightCapSummaryDto>> GetSummary(
        [FromQuery] string propertyId,
        [FromQuery] short year)
    {
        var summary = await _nightCapService.GetNightCapSummaryAsync(propertyId, year);
        return Ok(summary);
    }

    /// <summary>
    /// Gets night cap summaries for all properties for a specific year
    /// </summary>
    [HttpGet("summaries")]
    public async Task<ActionResult<IEnumerable<NightCapSummaryDto>>> GetSummaries([FromQuery] short year)
    {
        var summaries = await _nightCapService.GetNightCapSummariesAsync("org-001", year);
        return Ok(summaries);
    }

    /// <summary>
    /// Get booked nights for a property in a given month.
    /// </summary>
    [HttpGet("booked")]
    public async Task<ActionResult<List<BookedNightDto>>> GetBookedNights(
        [FromQuery] string propertyId,
        [FromQuery] short year,
        [FromQuery] int month)
    {
        var nights = await _nightCapService.GetBookedNightsAsync(propertyId, year, month);
        return Ok(nights);
    }

    /// <summary>
    /// Add manual booked nights for a property.
    /// </summary>
    [HttpPost("manual")]
    public async Task<IActionResult> AddManualNights([FromBody] AddManualNightsRequest request)
    {
        var orgId = GetOrganisationId();
        await _nightCapService.AddManualNightsAsync(request.PropertyId, orgId, request.Dates, request.GuestName);
        return Ok(new { message = "Manual nights added successfully." });
    }

    /// <summary>
    /// Trigger recalculation of night cap for a property and year.
    /// </summary>
    [HttpPost("recalculate")]
    public async Task<IActionResult> Recalculate([FromBody] RecalculateRequest request)
    {
        await _nightCapService.RecalculateNightsAsync(request.PropertyId, request.Year);
        return Ok(new { message = "Night cap recalculated successfully." });
    }
}
