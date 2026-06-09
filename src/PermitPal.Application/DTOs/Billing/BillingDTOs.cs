namespace PermitPal.Application.DTOs.Billing;

public record SubscriptionStatusDto(
    string Plan,
    string Status,
    DateTime? CurrentPeriodEnd,
    bool CancelAtPeriodEnd,
    string? StripeCustomerId,
    string? StripeSubscriptionId
);

public record CreateCheckoutRequest(
    string PriceId,
    string SuccessUrl,
    string CancelUrl
);

public record PortalSessionRequest(
    string ReturnUrl
);
