using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermitPal.Application.DTOs.EuRegistration;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Services;

public class EuRegistrationService : IEuRegistrationService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ILogger<EuRegistrationService> _logger;

    private static readonly Dictionary<string, EuRegistrationRequirementDto> CountryRequirements = new()
    {
        ["FR"] = new EuRegistrationRequirementDto(
            "FR", "France", null,
            new List<string> { "Proof of identity", "Property ownership/lease", "Insurance certificate" },
            new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
            "https://www.service-public.fr/",
            "Registration required for all short-term rentals in France. Paris has additional restrictions."
        ),
        ["ES"] = new EuRegistrationRequirementDto(
            "ES", "Spain", null,
            new List<string> { "Proof of identity", "Property deed", "Habitability certificate", "Tourism license application" },
            new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
            "https://www.registrodeturismo.es/",
            "Requirements vary by autonomous community. Check local regulations."
        ),
        ["IT"] = new EuRegistrationRequirementDto(
            "IT", "Italy", null,
            new List<string> { "Proof of identity", "Property documentation", "SCIA filing", "CIN registration" },
            new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
            "https://bdsr.ministeroturismo.gov.it/",
            "CIN (Codice Identificativo Nazionale) required from 2025."
        ),
        ["DE"] = new EuRegistrationRequirementDto(
            "DE", "Germany", null,
            new List<string> { "Proof of identity", "Property registration", "Misuse prohibition exemption (if applicable)" },
            new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
            null,
            "Registration requirements vary by city/state. Berlin, Munich, Hamburg have strict rules."
        ),
        ["PT"] = new EuRegistrationRequirementDto(
            "PT", "Portugal", null,
            new List<string> { "Proof of identity", "Property documentation", "AL license application" },
            new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
            "https://eportugal.gov.pt/",
            "Alojamento Local (AL) registration required."
        ),
        ["NL"] = new EuRegistrationRequirementDto(
            "NL", "Netherlands", null,
            new List<string> { "Proof of identity", "Property ownership proof", "Registration number application" },
            new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
            "https://www.registratienummer.nl/",
            "Amsterdam limits short-term rentals to 30 nights per year."
        ),
        ["AT"] = new EuRegistrationRequirementDto(
            "AT", "Austria", null,
            new List<string> { "Proof of identity", "Property documentation", "Trade license (Gewerbeschein)" },
            new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
            null,
            "Requirements vary by state (Bundesland). Vienna has specific regulations."
        ),
        ["IE"] = new EuRegistrationRequirementDto(
            "IE", "Ireland", null,
            new List<string> { "Proof of identity", "Property documentation", "Planning permission (if applicable)", "Fáilte Ireland registration" },
            new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
            "https://www.failteireland.ie/",
            "Short-term let registration required. RPZ areas have additional restrictions."
        )
    };

    public EuRegistrationService(
        IApplicationDbContext dbContext,
        ILogger<EuRegistrationService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<EuRegistrationProgressDto> GetProgressAsync(Guid propertyId)
    {
        var progress = await _dbContext.EuRegistrationProgress
            .Include(p => p.Property)
            .FirstOrDefaultAsync(p => p.PropertyId == propertyId.ToString());

        if (progress == null)
        {
            var property = await _dbContext.Properties
                .FirstOrDefaultAsync(p => p.Id == propertyId.ToString())
                ?? throw new InvalidOperationException($"Property {propertyId} not found.");

            return new EuRegistrationProgressDto(
                PropertyId: propertyId,
                PropertyName: property.Name,
                Status: "not_started",
                CompletedSteps: 0,
                TotalSteps: 5,
                PercentComplete: 0,
                Steps: GetDefaultSteps(),
                RegistrationNumber: null,
                CompletedAt: null
            );
        }

        var steps = DeserializeSteps(progress.StepsData);
        var completedSteps = steps.Count(s => s.IsCompleted);
        var totalSteps = steps.Count;
        var percentComplete = totalSteps > 0 ? Math.Round((decimal)completedSteps / totalSteps * 100, 1) : 0;

        var status = progress.RegistrationStatus switch
        {
            EuRegistrationStatus.NotStarted => "not_started",
            EuRegistrationStatus.InProgress => "in_progress",
            EuRegistrationStatus.Submitted => "in_progress",
            EuRegistrationStatus.Active => "completed",
            _ => "in_progress"
        };

        return new EuRegistrationProgressDto(
            PropertyId: propertyId,
            PropertyName: progress.Property?.Name ?? "",
            Status: status,
            CompletedSteps: completedSteps,
            TotalSteps: totalSteps,
            PercentComplete: percentComplete,
            Steps: steps,
            RegistrationNumber: progress.RegistrationNumber,
            CompletedAt: progress.RegistrationStatus == EuRegistrationStatus.Active ? progress.UpdatedAt : null
        );
    }

    public async Task<EuRegistrationProgressDto> UpdateStepAsync(Guid propertyId, string stepName, bool completed)
    {
        var progress = await _dbContext.EuRegistrationProgress
            .Include(p => p.Property)
            .FirstOrDefaultAsync(p => p.PropertyId == propertyId.ToString());

        if (progress == null)
        {
            var property = await _dbContext.Properties
                .FirstOrDefaultAsync(p => p.Id == propertyId.ToString())
                ?? throw new InvalidOperationException($"Property {propertyId} not found.");

            progress = new Domain.Entities.EuRegistrationProgress
            {
                Id = Guid.NewGuid().ToString(),
                OrganisationId = property.OrganisationId,
                PropertyId = propertyId.ToString(),
                CountryCode = property.CountryCode,
                SchemeName = "EU-STR",
                TotalSteps = 5,
                CurrentStep = 1,
                RegistrationStatus = EuRegistrationStatus.InProgress,
                StepsData = JsonSerializer.Serialize(GetDefaultSteps()),
                Property = property
            };
            _dbContext.EuRegistrationProgress.Add(progress);
        }

        var steps = DeserializeSteps(progress.StepsData);
        var step = steps.FirstOrDefault(s => s.StepName == stepName);
        if (step != null)
        {
            var index = steps.IndexOf(step);
            steps[index] = step with
            {
                IsCompleted = completed,
                CompletedAt = completed ? DateTime.UtcNow : null
            };
        }

        progress.StepsData = JsonSerializer.Serialize(steps);
        progress.CurrentStep = (byte)(steps.Count(s => s.IsCompleted) + 1);
        progress.RegistrationStatus = steps.All(s => s.IsCompleted)
            ? EuRegistrationStatus.Active
            : EuRegistrationStatus.InProgress;
        progress.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Updated EU registration step '{Step}' to {Completed} for property {PropertyId}",
            stepName, completed, propertyId);

        return await GetProgressAsync(propertyId);
    }

    public async Task<string> GenerateRegistrationNumberAsync(Guid propertyId)
    {
        var progress = await _dbContext.EuRegistrationProgress
            .Include(p => p.Property)
            .FirstOrDefaultAsync(p => p.PropertyId == propertyId.ToString())
            ?? throw new InvalidOperationException($"No EU registration progress found for property {propertyId}.");

        var random = new Random();
        var randomPart = random.Next(100000, 999999).ToString();
        var registrationNumber = $"EU-STR-{progress.CountryCode}-{randomPart}";

        progress.RegistrationNumber = registrationNumber;
        progress.RegistrationStatus = EuRegistrationStatus.Active;
        progress.UpdatedAt = DateTime.UtcNow;
        
        if (progress.Property != null)
        {
            progress.Property.RegistrationNumber = registrationNumber;
            progress.Property.UpdatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Generated registration number {RegNumber} for property {PropertyId}",
            registrationNumber, propertyId);

        return registrationNumber;
    }

    public Task<List<EuRegistrationRequirementDto>> GetRequirementsAsync(string countryCode, string? stateCode)
    {
        var results = new List<EuRegistrationRequirementDto>();

        if (CountryRequirements.TryGetValue(countryCode.ToUpperInvariant(), out var requirement))
        {
            results.Add(requirement);
        }
        else
        {
            // Return generic EU requirements
            results.Add(new EuRegistrationRequirementDto(
                countryCode.ToUpperInvariant(),
                countryCode.ToUpperInvariant(),
                stateCode,
                new List<string> { "Proof of identity", "Property documentation", "Local registration" },
                new List<string> { "identity_verification", "property_details", "local_registration", "platform_submission", "confirmation_received" },
                null,
                "Check local regulations for specific requirements."
            ));
        }

        return Task.FromResult(results);
    }

    private static List<RegistrationStepDto> GetDefaultSteps()
    {
        return new List<RegistrationStepDto>
        {
            new("identity_verification", "Identity Verification", "Verify your identity with government-issued ID", false, null, 1),
            new("property_details", "Property Details", "Provide property address, type, and capacity details", false, null, 2),
            new("local_registration", "Local Registration", "Register with your local authority or municipality", false, null, 3),
            new("platform_submission", "Platform Submission", "Submit registration number to booking platforms", false, null, 4),
            new("confirmation_received", "Confirmation Received", "Receive official confirmation of registration", false, null, 5)
        };
    }

    private static List<RegistrationStepDto> DeserializeSteps(string? stepsData)
    {
        if (string.IsNullOrEmpty(stepsData))
            return GetDefaultSteps();

        try
        {
            return JsonSerializer.Deserialize<List<RegistrationStepDto>>(stepsData) ?? GetDefaultSteps();
        }
        catch
        {
            return GetDefaultSteps();
        }
    }
}
