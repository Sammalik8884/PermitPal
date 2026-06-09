using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Controllers;

[Authorize]
[Route("api/eu-registration")]
public class EuRegistrationController : BaseController
{
    private readonly IEuRegistrationService _euRegistrationService;

    public EuRegistrationController(IEuRegistrationService euRegistrationService)
    {
        _euRegistrationService = euRegistrationService;
    }

    /// <summary>
    /// Get registration progress for a property.
    /// </summary>
    [HttpGet("{propertyId}/progress")]
    public async Task<IActionResult> GetProgress(Guid propertyId)
    {
        var progress = await _euRegistrationService.GetProgressAsync(propertyId);
        return Ok(progress);
    }

    /// <summary>
    /// Update a registration step.
    /// </summary>
    [HttpPut("{propertyId}/step")]
    public async Task<IActionResult> UpdateStep(Guid propertyId, [FromBody] UpdateStepRequest request)
    {
        var progress = await _euRegistrationService.UpdateStepAsync(propertyId, request.StepName, request.Completed);
        return Ok(progress);
    }

    /// <summary>
    /// Generate a registration number for a property.
    /// </summary>
    [HttpPost("{propertyId}/generate-number")]
    public async Task<IActionResult> GenerateNumber(Guid propertyId)
    {
        var registrationNumber = await _euRegistrationService.GenerateRegistrationNumberAsync(propertyId);
        return Ok(new { registrationNumber });
    }

    /// <summary>
    /// Get registration requirements for a country/state.
    /// </summary>
    [HttpGet("requirements")]
    public async Task<IActionResult> GetRequirements([FromQuery] string countryCode, [FromQuery] string? stateCode = null)
    {
        var requirements = await _euRegistrationService.GetRequirementsAsync(countryCode, stateCode);
        return Ok(requirements);
    }
}

public record UpdateStepRequest(string StepName, bool Completed);
