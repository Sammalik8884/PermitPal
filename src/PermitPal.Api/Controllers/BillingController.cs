using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermitPal.Application.DTOs.Billing;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Controllers;

[Authorize]
public class BillingController : BaseController
{
    private readonly IBillingService _billingService;

    public BillingController(IBillingService billingService)
    {
        _billingService = billingService;
    }

    /// <summary>
    /// Get current subscription status.
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var orgId = Guid.Parse(GetOrganisationId());
        var status = await _billingService.GetSubscriptionStatusAsync(orgId);
        return Ok(status);
    }

    /// <summary>
    /// Create a Stripe Checkout session for subscription.
    /// </summary>
    [HttpPost("checkout")]
    public async Task<IActionResult> CreateCheckout([FromBody] CreateCheckoutRequest request)
    {
        var orgId = Guid.Parse(GetOrganisationId());
        var sessionUrl = await _billingService.CreateCheckoutSessionAsync(
            orgId, request.PriceId, request.SuccessUrl, request.CancelUrl);
        return Ok(new { url = sessionUrl });
    }

    /// <summary>
    /// Create a Stripe Billing Portal session.
    /// </summary>
    [HttpPost("portal")]
    public async Task<IActionResult> CreatePortal([FromBody] PortalSessionRequest request)
    {
        var orgId = Guid.Parse(GetOrganisationId());
        var portalUrl = await _billingService.CreatePortalSessionAsync(orgId, request.ReturnUrl);
        return Ok(new { url = portalUrl });
    }

    /// <summary>
    /// Cancel subscription at period end.
    /// </summary>
    [HttpPost("cancel")]
    public async Task<IActionResult> CancelSubscription()
    {
        var orgId = Guid.Parse(GetOrganisationId());
        await _billingService.CancelSubscriptionAsync(orgId);
        return Ok(new { message = "Subscription will be cancelled at the end of the current billing period." });
    }

    /// <summary>
    /// Stripe webhook endpoint.
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"].FirstOrDefault() ?? "";

        try
        {
            await _billingService.HandleWebhookAsync(json, signature);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
