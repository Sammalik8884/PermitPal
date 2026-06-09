using PermitPal.Application.DTOs.Billing;

namespace PermitPal.Application.Interfaces;

public interface IBillingService
{
    Task<string> CreateCustomerAsync(Guid organisationId, string email, string name);
    Task<string> CreateCheckoutSessionAsync(Guid organisationId, string priceId, string successUrl, string cancelUrl);
    Task<string> CreatePortalSessionAsync(Guid organisationId, string returnUrl);
    Task HandleWebhookAsync(string json, string signature);
    Task<SubscriptionStatusDto> GetSubscriptionStatusAsync(Guid organisationId);
    Task CancelSubscriptionAsync(Guid organisationId);
}
