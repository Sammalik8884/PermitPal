using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PermitPal.Application.DTOs.Billing;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Enums;
using Stripe;
using Stripe.Checkout;

namespace PermitPal.Infrastructure.Services;

public class BillingService : IBillingService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly ILogger<BillingService> _logger;

    public BillingService(
        IApplicationDbContext dbContext,
        IConfiguration configuration,
        ILogger<BillingService> logger)
    {
        _dbContext = dbContext;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> CreateCustomerAsync(Guid organisationId, string email, string name)
    {
        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.Id == organisationId.ToString())
            ?? throw new InvalidOperationException($"Organisation {organisationId} not found.");

        if (!string.IsNullOrEmpty(organisation.StripeCustomerId))
            return organisation.StripeCustomerId;

        var options = new CustomerCreateOptions
        {
            Email = email,
            Name = name,
            Metadata = new Dictionary<string, string>
            {
                { "organisation_id", organisationId.ToString() }
            }
        };

        var service = new CustomerService();
        var customer = await service.CreateAsync(options);

        organisation.StripeCustomerId = customer.Id;
        organisation.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Created Stripe customer {CustomerId} for organisation {OrgId}", customer.Id, organisationId);

        return customer.Id;
    }

    public async Task<string> CreateCheckoutSessionAsync(Guid organisationId, string priceId, string successUrl, string cancelUrl)
    {
        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.Id == organisationId.ToString())
            ?? throw new InvalidOperationException($"Organisation {organisationId} not found.");

        if (string.IsNullOrEmpty(organisation.StripeCustomerId))
            throw new InvalidOperationException("Organisation does not have a Stripe customer. Create one first.");

        var options = new SessionCreateOptions
        {
            Customer = organisation.StripeCustomerId,
            Mode = "subscription",
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = priceId,
                    Quantity = 1
                }
            },
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            Metadata = new Dictionary<string, string>
            {
                { "organisation_id", organisationId.ToString() }
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        _logger.LogInformation("Created checkout session {SessionId} for organisation {OrgId}", session.Id, organisationId);

        return session.Url!;
    }

    public async Task<string> CreatePortalSessionAsync(Guid organisationId, string returnUrl)
    {
        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.Id == organisationId.ToString())
            ?? throw new InvalidOperationException($"Organisation {organisationId} not found.");

        if (string.IsNullOrEmpty(organisation.StripeCustomerId))
            throw new InvalidOperationException("Organisation does not have a Stripe customer.");

        var options = new Stripe.BillingPortal.SessionCreateOptions
        {
            Customer = organisation.StripeCustomerId,
            ReturnUrl = returnUrl
        };

        var service = new Stripe.BillingPortal.SessionService();
        var session = await service.CreateAsync(options);

        return session.Url;
    }

    public async Task HandleWebhookAsync(string json, string signature)
    {
        var webhookSecret = _configuration["Stripe:WebhookSecret"]
            ?? throw new InvalidOperationException("Stripe webhook secret not configured.");

        var stripeEvent = EventUtility.ConstructEvent(json, signature, webhookSecret);

        _logger.LogInformation("Processing Stripe webhook event: {EventType}", stripeEvent.Type);

        switch (stripeEvent.Type)
        {
            case "checkout.session.completed":
                await HandleCheckoutSessionCompleted(stripeEvent);
                break;
            case "customer.subscription.updated":
                await HandleSubscriptionUpdated(stripeEvent);
                break;
            case "customer.subscription.deleted":
                await HandleSubscriptionDeleted(stripeEvent);
                break;
            case "invoice.payment_failed":
                await HandlePaymentFailed(stripeEvent);
                break;
            default:
                _logger.LogInformation("Unhandled Stripe event type: {EventType}", stripeEvent.Type);
                break;
        }
    }

    public async Task<SubscriptionStatusDto> GetSubscriptionStatusAsync(Guid organisationId)
    {
        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.Id == organisationId.ToString())
            ?? throw new InvalidOperationException($"Organisation {organisationId} not found.");

        DateTime? currentPeriodEnd = null;
        bool cancelAtPeriodEnd = false;

        if (!string.IsNullOrEmpty(organisation.StripeSubscriptionId))
        {
            try
            {
                var service = new SubscriptionService();
                var subscription = await service.GetAsync(organisation.StripeSubscriptionId);
                currentPeriodEnd = subscription.Items?.Data?.FirstOrDefault()?.CurrentPeriodEnd
                    ?? subscription.Created;
                cancelAtPeriodEnd = subscription.CancelAtPeriodEnd;
            }
            catch (StripeException ex)
            {
                _logger.LogWarning(ex, "Failed to fetch Stripe subscription {SubId}", organisation.StripeSubscriptionId);
            }
        }

        return new SubscriptionStatusDto(
            Plan: organisation.SubscriptionPlan.ToString(),
            Status: organisation.SubscriptionStatus.ToString(),
            CurrentPeriodEnd: currentPeriodEnd,
            CancelAtPeriodEnd: cancelAtPeriodEnd,
            StripeCustomerId: organisation.StripeCustomerId,
            StripeSubscriptionId: organisation.StripeSubscriptionId
        );
    }

    public async Task CancelSubscriptionAsync(Guid organisationId)
    {
        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.Id == organisationId.ToString())
            ?? throw new InvalidOperationException($"Organisation {organisationId} not found.");

        if (string.IsNullOrEmpty(organisation.StripeSubscriptionId))
            throw new InvalidOperationException("No active subscription to cancel.");

        var options = new SubscriptionUpdateOptions
        {
            CancelAtPeriodEnd = true
        };

        var service = new SubscriptionService();
        await service.UpdateAsync(organisation.StripeSubscriptionId, options);

        _logger.LogInformation("Subscription {SubId} set to cancel at period end for organisation {OrgId}",
            organisation.StripeSubscriptionId, organisationId);
    }

    private async Task HandleCheckoutSessionCompleted(Event stripeEvent)
    {
        var session = stripeEvent.Data.Object as Session;
        if (session == null) return;

        var organisationId = session.Metadata.GetValueOrDefault("organisation_id");
        if (string.IsNullOrEmpty(organisationId)) return;

        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.Id == organisationId);
        if (organisation == null) return;

        organisation.StripeSubscriptionId = session.SubscriptionId;
        organisation.SubscriptionStatus = SubscriptionStatus.Active;
        organisation.UpdatedAt = DateTime.UtcNow;

        // Determine plan from price
        if (!string.IsNullOrEmpty(session.SubscriptionId))
        {
            var subService = new SubscriptionService();
            var subscription = await subService.GetAsync(session.SubscriptionId);
            var priceId = subscription.Items?.Data?.FirstOrDefault()?.Price?.Id;
            organisation.SubscriptionPlan = MapPriceIdToPlan(priceId);
        }

        await _dbContext.SaveChangesAsync();
        _logger.LogInformation("Activated subscription for organisation {OrgId}", organisationId);
    }

    private async Task HandleSubscriptionUpdated(Event stripeEvent)
    {
        var subscription = stripeEvent.Data.Object as Subscription;
        if (subscription == null) return;

        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.StripeSubscriptionId == subscription.Id);
        if (organisation == null) return;

        organisation.SubscriptionStatus = MapStripeStatus(subscription.Status);
        var priceId = subscription.Items?.Data?.FirstOrDefault()?.Price?.Id;
        if (!string.IsNullOrEmpty(priceId))
        {
            organisation.SubscriptionPlan = MapPriceIdToPlan(priceId);
        }
        organisation.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        _logger.LogInformation("Updated subscription for organisation {OrgId}", organisation.Id);
    }

    private async Task HandleSubscriptionDeleted(Event stripeEvent)
    {
        var subscription = stripeEvent.Data.Object as Subscription;
        if (subscription == null) return;

        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.StripeSubscriptionId == subscription.Id);
        if (organisation == null) return;

        organisation.SubscriptionStatus = SubscriptionStatus.Cancelled;
        organisation.SubscriptionPlan = SubscriptionPlan.Solo;
        organisation.StripeSubscriptionId = null;
        organisation.MaxProperties = 1;
        organisation.MaxTeamSeats = 1;
        organisation.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        _logger.LogInformation("Subscription deleted, downgraded organisation {OrgId} to free", organisation.Id);
    }

    private async Task HandlePaymentFailed(Event stripeEvent)
    {
        var invoice = stripeEvent.Data.Object as Invoice;
        if (invoice == null) return;

        var organisation = await _dbContext.Organisations
            .FirstOrDefaultAsync(o => o.StripeCustomerId == invoice.CustomerId);
        if (organisation == null) return;

        organisation.SubscriptionStatus = SubscriptionStatus.PastDue;
        organisation.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        _logger.LogWarning("Payment failed for organisation {OrgId}, marked as PastDue", organisation.Id);
    }

    private SubscriptionPlan MapPriceIdToPlan(string? priceId)
    {
        if (string.IsNullOrEmpty(priceId)) return SubscriptionPlan.Solo;

        var starterPriceId = _configuration["Stripe:PriceIds:Starter"];
        var professionalPriceId = _configuration["Stripe:PriceIds:Professional"];
        var enterprisePriceId = _configuration["Stripe:PriceIds:Enterprise"];

        if (priceId == starterPriceId) return SubscriptionPlan.Host;
        if (priceId == professionalPriceId) return SubscriptionPlan.Operator;
        if (priceId == enterprisePriceId) return SubscriptionPlan.Manager;

        return SubscriptionPlan.Solo;
    }

    private static SubscriptionStatus MapStripeStatus(string stripeStatus)
    {
        return stripeStatus switch
        {
            "active" => SubscriptionStatus.Active,
            "trialing" => SubscriptionStatus.Trialing,
            "past_due" => SubscriptionStatus.PastDue,
            "canceled" or "cancelled" => SubscriptionStatus.Cancelled,
            _ => SubscriptionStatus.Active
        };
    }
}
