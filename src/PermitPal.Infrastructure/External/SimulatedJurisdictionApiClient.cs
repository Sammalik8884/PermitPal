using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.External;

public class SimulatedJurisdictionApiClient : IExternalJurisdictionApiClient
{
    public async Task<IEnumerable<Jurisdiction>> FetchLatestJurisdictionsAsync(CancellationToken cancellationToken = default)
    {
        // Simulate network delay
        await Task.Delay(1000, cancellationToken);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Core realistic jurisdictions
        var jurisdictions = new List<Jurisdiction>
        {
            new Jurisdiction
            {
                Id = "jur-us-ca-la",
                CountryCode = "US",
                Name = "Los Angeles",
                Slug = "los-angeles",
                JurisdictionType = JurisdictionType.City,
                PermitRequired = true,
                PermitType = "Home-Sharing Registration",
                PermitDescription = "Required for short-term rentals under 30 days.",
                PermitFeeCents = 18300,
                PermitPortalUrl = "https://planning.lacity.org/zoning/home-sharing",
                PermitNumberInListing = true,
                NightCapUnhosted = 0,
                NightCapHosted = 120,
                PrimaryResidenceRequired = true,
                TotRatePct = 14.0m,
                TotName = "Transient Occupancy Tax",
                TotPlatformCollects = true,
                TotSelfRemitRequired = false,
                EnforcementLevel = EnforcementLevel.High,
                LastVerifiedAt = today
            },
            new Jurisdiction
            {
                Id = "jur-us-ny-nyc",
                CountryCode = "US",
                Name = "New York City",
                Slug = "new-york-city",
                JurisdictionType = JurisdictionType.City,
                PermitRequired = true,
                PermitType = "OSE Registration",
                PermitFeeCents = 14500,
                PermitNumberInListing = true,
                NightCapUnhosted = 0,
                NightCapHosted = 365,
                PrimaryResidenceRequired = true,
                TotRatePct = 5.875m,
                EnforcementLevel = EnforcementLevel.High,
                LastVerifiedAt = today
            },
            new Jurisdiction
            {
                Id = "jur-gb-eng-lon",
                CountryCode = "GB",
                Name = "London",
                Slug = "london",
                JurisdictionType = JurisdictionType.City,
                PermitRequired = false,
                NightCapUnhosted = 90,
                NightCapHosted = 90,
                PrimaryResidenceRequired = false,
                TotRatePct = 0.0m,
                EnforcementLevel = EnforcementLevel.Medium,
                LastVerifiedAt = today
            },
            new Jurisdiction
            {
                Id = "jur-fr-idf-par",
                CountryCode = "FR",
                Name = "Paris",
                Slug = "paris",
                JurisdictionType = JurisdictionType.City,
                PermitRequired = true,
                NightCapUnhosted = 120,
                NightCapHosted = 365,
                PrimaryResidenceRequired = true,
                TotRatePct = 5.0m,
                EnforcementLevel = EnforcementLevel.High,
                LastVerifiedAt = today
            },
            new Jurisdiction
            {
                Id = "jur-au-nsw-syd",
                CountryCode = "AU",
                Name = "Sydney",
                Slug = "sydney",
                JurisdictionType = JurisdictionType.City,
                PermitRequired = true,
                PermitFeeCents = 6500,
                NightCapUnhosted = 180,
                NightCapHosted = 365,
                EnforcementLevel = EnforcementLevel.Medium,
                LastVerifiedAt = today
            }
        };

        // Add a generic national jurisdiction for ~190 other countries
        string[] allCountries = { "AE", "AF", "AG", "AL", "AM", "AO", "AR", "AT", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BN", "BO", "BR", "BS", "BT", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "ER", "ES", "ET", "FI", "FJ", "FM", "GA", "GD", "GE", "GH", "GM", "GN", "GQ", "GR", "GT", "GW", "GY", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IN", "IQ", "IR", "IS", "IT", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MG", "MH", "MK", "ML", "MM", "MN", "MR", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NZ", "OM", "PA", "PE", "PG", "PH", "PK", "PL", "PT", "PW", "PY", "QA", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SY", "SZ", "TD", "TG", "TH", "TJ", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UY", "UZ", "VA", "VC", "VE", "VN", "VU", "WS", "YE", "ZA", "ZM", "ZW" };
        
        foreach (var code in allCountries)
        {
            jurisdictions.Add(new Jurisdiction
            {
                Id = $"jur-{code.ToLower()}-national",
                CountryCode = code,
                Name = $"{code} National Regulations",
                Slug = $"{code.ToLower()}-national",
                JurisdictionType = JurisdictionType.National,
                PermitRequired = false,
                NightCapUnhosted = 365, // No limit by default
                NightCapHosted = 365,
                PrimaryResidenceRequired = false,
                TotRatePct = 0.0m,
                EnforcementLevel = EnforcementLevel.Low,
                LastVerifiedAt = today
            });
        }

        return jurisdictions;
    }
}
