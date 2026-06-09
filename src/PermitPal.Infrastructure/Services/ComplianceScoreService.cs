using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.Properties;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Services;

/// <summary>
/// Implements IComplianceScoreService — calculates 0-100 compliance scores for properties.
/// </summary>
public class ComplianceScoreService : IComplianceScoreService
{
    private readonly IApplicationDbContext _dbContext;

    public ComplianceScoreService(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<byte> CalculateScoreAsync(Property property)
    {
        var score = await CalculateScoreInternalAsync(property.Id);
        return (byte)Math.Clamp(score, 0, 100);
    }

    public async Task RecalculateAllAsync(string organisationId)
    {
        var properties = await _dbContext.Properties
            .Where(p => p.OrganisationId == organisationId && p.IsActive)
            .ToListAsync();

        foreach (var property in properties)
        {
            var score = await CalculateScoreInternalAsync(property.Id);
            property.ComplianceScore = (byte)Math.Clamp(score, 0, 100);
            property.ComplianceStatus = score >= 80 ? ComplianceStatus.Compliant
                : score >= 50 ? ComplianceStatus.Warning
                : ComplianceStatus.NonCompliant;
            property.ScoreCalculatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task<int> CalculateScoreAsync(string propertyId)
    {
        var score = await CalculateScoreInternalAsync(propertyId);

        var property = await _dbContext.Properties.FirstOrDefaultAsync(p => p.Id == propertyId);
        if (property != null)
        {
            property.ComplianceScore = (byte)Math.Clamp(score, 0, 100);
            property.ComplianceStatus = score >= 80 ? ComplianceStatus.Compliant
                : score >= 50 ? ComplianceStatus.Warning
                : ComplianceStatus.NonCompliant;
            property.ScoreCalculatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }

        return score;
    }

    public async Task<ComplianceBreakdownDto> GetBreakdownAsync(string propertyId)
    {
        var property = await _dbContext.Properties
            .Include(p => p.Jurisdiction)
            .FirstOrDefaultAsync(p => p.Id == propertyId);

        if (property == null)
            throw new InvalidOperationException($"Property {propertyId} not found.");

        var permitComponent = await CalculatePermitComponentAsync(propertyId, property.Jurisdiction);
        var nightCapComponent = await CalculateNightCapComponentAsync(propertyId, property);
        var registrationComponent = CalculateRegistrationComponent(property);
        var documentsComponent = await CalculateDocumentsComponentAsync(propertyId, property.Jurisdiction);
        var renewalComponent = await CalculateRenewalComponentAsync(propertyId);

        var totalScore = permitComponent.EarnedPoints + nightCapComponent.EarnedPoints
            + registrationComponent.EarnedPoints + documentsComponent.EarnedPoints
            + renewalComponent.EarnedPoints;

        var recommendations = new List<string>();

        if (permitComponent.Status == "fail")
            recommendations.Add("Obtain a valid permit for your property to improve compliance.");
        else if (permitComponent.Status == "partial")
            recommendations.Add("Your permit is pending — follow up to get it approved.");

        if (nightCapComponent.Status == "fail")
            recommendations.Add("Your night cap has been exceeded. Reduce bookings to stay compliant.");
        else if (nightCapComponent.Status == "partial")
            recommendations.Add("You are approaching your night cap limit. Monitor bookings closely.");

        if (registrationComponent.Status == "fail")
            recommendations.Add("Add your registration/permit number to your property listing.");

        if (documentsComponent.Status == "fail" || documentsComponent.Status == "partial")
            recommendations.Add("Upload all required documents for your jurisdiction.");

        if (renewalComponent.Status == "fail")
            recommendations.Add("You have overdue permit renewals. Renew immediately to stay compliant.");

        return new ComplianceBreakdownDto(
            PropertyId: propertyId,
            TotalScore: totalScore,
            PermitComponent: permitComponent,
            NightCapComponent: nightCapComponent,
            RegistrationComponent: registrationComponent,
            DocumentsComponent: documentsComponent,
            RenewalComponent: renewalComponent,
            Recommendations: recommendations
        );
    }

    private async Task<int> CalculateScoreInternalAsync(string propertyId)
    {
        var property = await _dbContext.Properties
            .Include(p => p.Jurisdiction)
            .FirstOrDefaultAsync(p => p.Id == propertyId);

        if (property == null)
            return 0;

        var permitComponent = await CalculatePermitComponentAsync(propertyId, property.Jurisdiction);
        var nightCapComponent = await CalculateNightCapComponentAsync(propertyId, property);
        var registrationComponent = CalculateRegistrationComponent(property);
        var documentsComponent = await CalculateDocumentsComponentAsync(propertyId, property.Jurisdiction);
        var renewalComponent = await CalculateRenewalComponentAsync(propertyId);

        return permitComponent.EarnedPoints + nightCapComponent.EarnedPoints
            + registrationComponent.EarnedPoints + documentsComponent.EarnedPoints
            + renewalComponent.EarnedPoints;
    }

    private async Task<ComplianceComponent> CalculatePermitComponentAsync(string propertyId, Jurisdiction? jurisdiction)
    {
        const int maxPoints = 30;

        // If jurisdiction doesn't require a permit, full points
        if (jurisdiction == null || !jurisdiction.PermitRequired)
        {
            return new ComplianceComponent("Permit", maxPoints, maxPoints, "pass", "Permit not required for this jurisdiction.");
        }

        var permit = await _dbContext.Permits
            .Where(p => p.PropertyId == propertyId)
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefaultAsync();

        if (permit == null)
            return new ComplianceComponent("Permit", maxPoints, 0, "fail", "No permit found. A permit is required.");

        if (permit.Status == PermitStatus.Active)
            return new ComplianceComponent("Permit", maxPoints, 30, "pass", "Active permit on file.");

        if (permit.Status == PermitStatus.Pending)
            return new ComplianceComponent("Permit", maxPoints, 15, "partial", "Permit application is pending.");

        return new ComplianceComponent("Permit", maxPoints, 0, "fail", $"Permit status: {permit.Status}. A valid permit is required.");
    }

    private async Task<ComplianceComponent> CalculateNightCapComponentAsync(string propertyId, Property property)
    {
        const int maxPoints = 25;

        var jurisdiction = property.Jurisdiction;
        int? capLimit = property.HostedType == HostedType.Hosted
            ? jurisdiction?.NightCapHosted
            : jurisdiction?.NightCapUnhosted;

        if (capLimit == null || capLimit == 0)
            return new ComplianceComponent("Night Cap", maxPoints, maxPoints, "pass", "No night cap applies to this property.");

        var currentYear = (short)DateTime.UtcNow.Year;
        var record = await _dbContext.NightCapRecords
            .FirstOrDefaultAsync(r => r.PropertyId == propertyId && r.CalendarYear == currentYear);

        int nightsUsed = record?.NightsUsed ?? 0;
        decimal pct = (decimal)nightsUsed / capLimit.Value * 100;

        if (pct < 80)
            return new ComplianceComponent("Night Cap", maxPoints, 25, "pass", $"Night cap usage: {pct:F0}% ({nightsUsed}/{capLimit}).");

        if (pct < 100)
            return new ComplianceComponent("Night Cap", maxPoints, 15, "partial", $"Night cap usage: {pct:F0}% ({nightsUsed}/{capLimit}). Approaching limit.");

        return new ComplianceComponent("Night Cap", maxPoints, 0, "fail", $"Night cap exceeded: {nightsUsed}/{capLimit} nights used.");
    }

    private static ComplianceComponent CalculateRegistrationComponent(Property property)
    {
        const int maxPoints = 15;

        // Check if the property has a permit number set (registration number)
        var hasRegistration = !string.IsNullOrEmpty(property.AirbnbListingId)
            || !string.IsNullOrEmpty(property.VrboListingId)
            || !string.IsNullOrEmpty(property.BookingListingId);

        if (hasRegistration)
            return new ComplianceComponent("Registration", maxPoints, 15, "pass", "Registration/listing IDs are set.");

        return new ComplianceComponent("Registration", maxPoints, 0, "fail", "No registration or listing IDs configured.");
    }

    private async Task<ComplianceComponent> CalculateDocumentsComponentAsync(string propertyId, Jurisdiction? jurisdiction)
    {
        const int maxPoints = 15;

        // If no jurisdiction or no specific requirements, give full points
        if (jurisdiction == null)
            return new ComplianceComponent("Documents", maxPoints, maxPoints, "pass", "No specific document requirements.");

        var documents = await _dbContext.Documents
            .Where(d => d.PropertyId == propertyId)
            .ToListAsync();

        if (!documents.Any())
        {
            // Check if jurisdiction requires documents
            if (jurisdiction.PermitRequired || !string.IsNullOrEmpty(jurisdiction.AuFireSafetyStandard))
                return new ComplianceComponent("Documents", maxPoints, 0, "fail", "No documents uploaded. Required documents are missing.");

            return new ComplianceComponent("Documents", maxPoints, maxPoints, "pass", "No documents required.");
        }

        // Basic check: has at least one document
        var hasPermitDoc = documents.Any(d => d.DocumentType == DocumentType.Permit);
        var hasFireCert = documents.Any(d => d.DocumentType == DocumentType.FireCert);

        bool allRequired = true;
        if (jurisdiction.PermitRequired && !hasPermitDoc)
            allRequired = false;
        if (!string.IsNullOrEmpty(jurisdiction.AuFireSafetyStandard) && !hasFireCert)
            allRequired = false;

        if (allRequired)
            return new ComplianceComponent("Documents", maxPoints, 15, "pass", "All required documents are uploaded.");

        return new ComplianceComponent("Documents", maxPoints, 8, "partial", "Some required documents are missing.");
    }

    private async Task<ComplianceComponent> CalculateRenewalComponentAsync(string propertyId)
    {
        const int maxPoints = 15;

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var overduePermits = await _dbContext.Permits
            .Where(p => p.PropertyId == propertyId
                && p.ExpiryDate != null
                && p.ExpiryDate < today
                && p.Status != PermitStatus.Cancelled)
            .CountAsync();

        if (overduePermits == 0)
            return new ComplianceComponent("Renewal", maxPoints, 15, "pass", "No overdue renewals.");

        return new ComplianceComponent("Renewal", maxPoints, 0, "fail", $"{overduePermits} permit(s) are overdue for renewal.");
    }
}
