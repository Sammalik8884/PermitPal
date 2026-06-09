namespace PermitPal.Application.Interfaces;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string htmlBody);
    Task SendTemplateAsync(string to, string templateName, object data);
}
