using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.DTOs.Dashboard;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Enums;

namespace PermitPal.Api.Controllers;

public class DashboardController : BaseController
{
    private readonly IApplicationDbContext _dbContext;

    public DashboardController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryResponse>> GetSummary()
    {
        var orgId = GetOrganisationId();
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var properties = await _dbContext.Properties
            .Where(p => p.OrganisationId == orgId && p.IsActive)
            .ToListAsync();

        var permits = await _dbContext.Permits
            .Include(p => p.Property)
            .Where(p => p.OrganisationId == orgId)
            .ToListAsync();

        var nightCaps = await _dbContext.NightCapRecords
            .Include(n => n.Property)
            .Where(n => n.OrganisationId == orgId && n.CalendarYear == now.Year)
            .ToListAsync();

        var audits = await _dbContext.AuditLogs
            .Where(a => a.OrganisationId == orgId)
            .OrderByDescending(a => a.CreatedAt)
            .Take(10)
            .ToListAsync();

        // 1. Stats
        int totalProperties = properties.Count;
        int addedThisMonth = properties.Count(p => p.CreatedAt >= startOfMonth);
        int activePermits = permits.Count(p => p.Status == PermitStatus.Active);
        int avgCompliance = 0;
        if (totalProperties > 0)
        {
            var propertiesWithScore = properties.Where(p => p.ComplianceScore.HasValue && p.ComplianceScore.Value > 0).ToList();
            if (propertiesWithScore.Any())
            {
                avgCompliance = (int)propertiesWithScore.Average(p => p.ComplianceScore!.Value);
                Console.WriteLine($"[DEBUG] Using explicit scores: Average = {avgCompliance}");
            }
            else
            {
                // Fallback heuristic: calculate based on active permits
                int compliantProperties = properties.Count(p => permits.Any(perm => perm.PropertyId == p.Id && perm.Status == PermitStatus.Active));
                
                if (compliantProperties == 0 && activePermits > 0) 
                {
                    avgCompliance = (int)Math.Round((double)Math.Min(activePermits, totalProperties) / totalProperties * 100);
                }
                else 
                {
                    avgCompliance = (int)Math.Round((double)compliantProperties / totalProperties * 100);
                }
                Console.WriteLine($"[DEBUG] Using fallback: TotalProps={totalProperties}, CompliantProps={compliantProperties}, Avg={avgCompliance}");
            }
        }
        
        Console.WriteLine($"[DEBUG] Final ComplianceScore in StatsDto: {avgCompliance}");
        
        int totalNightsUsed = nightCaps.Sum(n => n.NightsUsed);
        int totalCapLimit = nightCaps.Sum(n => n.CapLimit ?? 0);

        var statsDto = new DashboardStatsDto(
            TotalProperties: totalProperties,
            PropertiesAddedThisMonth: addedThisMonth,
            ActivePermits: activePermits,
            ComplianceScore: avgCompliance,
            NightsUsed: totalNightsUsed,
            TotalNightCap: totalCapLimit
        );

        // 2. Compliance History (Flatline based on current score)
        var history = new List<ComplianceHistoryPointDto>();
        for (int i = 5; i >= 0; i--)
        {
            var monthDate = now.AddMonths(-i);
            history.Add(new ComplianceHistoryPointDto(
                Month: monthDate.ToString("MMM"),
                Score: avgCompliance
            ));
        }

        // 3. Properties at Risk
        var atRisk = new List<PropertyAtRiskDto>();
        foreach (var prop in properties.Where(p => (p.ComplianceScore ?? 0) < 70))
        {
            atRisk.Add(new PropertyAtRiskDto(
                Id: prop.Id,
                PropertyName: prop.Name,
                Issue: "Low Compliance Score",
                Severity: (prop.ComplianceScore ?? 0) < 50 ? "high" : "medium"
            ));
        }
        
        var expiredPermits = permits.Where(p => p.Status == PermitStatus.Expired || (p.ExpiryDate.HasValue && p.ExpiryDate.Value.ToDateTime(TimeOnly.MinValue) < now));
        foreach (var p in expiredPermits)
        {
            if (!atRisk.Any(a => a.Id == p.PropertyId && a.Issue == "Permit Expired"))
            {
                atRisk.Add(new PropertyAtRiskDto(
                    Id: p.PropertyId,
                    PropertyName: p.Property?.Name ?? "Unknown",
                    Issue: "Permit Expired",
                    Severity: "high"
                ));
            }
        }

        // 4. Upcoming Deadlines
        var deadlines = new List<UpcomingDeadlineDto>();
        var upcomingPermits = permits.Where(p => p.Status == PermitStatus.Active && p.ExpiryDate.HasValue && p.ExpiryDate.Value.ToDateTime(TimeOnly.MinValue) > now && p.ExpiryDate.Value.ToDateTime(TimeOnly.MinValue) <= now.AddDays(90));
        
        foreach (var p in upcomingPermits)
        {
            var daysRemaining = (p.ExpiryDate!.Value.ToDateTime(TimeOnly.MinValue) - now).Days;
            deadlines.Add(new UpcomingDeadlineDto(
                Id: p.Id,
                PropertyName: p.Property?.Name ?? "Unknown",
                DeadlineType: $"{p.PermitType} Renewal",
                Date: p.ExpiryDate.Value.ToString("yyyy-MM-dd"),
                DaysRemaining: daysRemaining
            ));
        }
        deadlines = deadlines.OrderBy(d => d.DaysRemaining).Take(5).ToList();

        // 5. Recent Activity
        var activity = audits.Select(a => new ActivityItemDto(
            Id: a.Id.ToString(),
            PropertyName: null,
            Action: $"{a.Action} {a.ResourceType}",
            Date: a.CreatedAt.ToString("o")
        )).ToList();

        // 6. Night Caps
        var capsDto = nightCaps.Select(n => {
            int limit = n.CapLimit ?? 0;
            int remaining = limit > 0 ? Math.Max(0, limit - n.NightsUsed) : 0;
            decimal pct = limit > 0 ? (decimal)n.NightsUsed / limit * 100m : 0m;
            string status = pct >= 100 ? "exceeded" : pct >= 80 ? "warning" : "good";
            
            return new NightCapDashboardDto(
                PropertyId: n.PropertyId,
                PropertyName: n.Property?.Name ?? "Unknown",
                Year: n.CalendarYear,
                NightCap: limit,
                NightsUsed: n.NightsUsed,
                NightsRemaining: remaining,
                Percentage: pct,
                Status: status
            );
        }).ToList();

        var response = new DashboardSummaryResponse(
            Stats: statsDto,
            ComplianceHistory: history,
            PropertiesAtRisk: atRisk.Take(5).ToList(),
            UpcomingDeadlines: deadlines,
            RecentActivity: activity,
            NightCaps: capsDto
        );

        return Ok(response);
    }
}
