namespace PermitPal.Application.Interfaces;

public interface INotificationService
{
    Task SendPermitExpiryAlertAsync(string propertyId, string permitId, DateOnly expiryDate);
    Task SendNightCapWarningAsync(string propertyId, int nightsUsed, int nightCap);
    Task SendRegulatoryChangeAlertAsync(string jurisdictionId, string regulatoryChangeId);
    Task SendWelcomeAsync(string userId);
}
