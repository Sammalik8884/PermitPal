using PermitPal.Domain.Enums;

namespace PermitPal.Domain.Entities;

public class Organisation
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Timezone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public SubscriptionPlan SubscriptionPlan { get; set; } = SubscriptionPlan.Solo;
    public SubscriptionStatus SubscriptionStatus { get; set; } = SubscriptionStatus.Trialing;
    public DateTime? TrialEndsAt { get; set; }
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public int MaxProperties { get; set; } = 1;
    public int MaxTeamSeats { get; set; } = 1;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Property> Properties { get; set; } = new List<Property>();
}
