using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;

namespace PermitPal.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    private static readonly Dictionary<string, (string Subject, string Template)> Templates = new()
    {
        ["permit-expiring"] = (
            "Permit Expiring Soon",
            """
            <html><body>
            <h2>Permit Expiring Soon</h2>
            <p>Your permit for property <strong>{{PropertyName}}</strong> is expiring on <strong>{{ExpiryDate}}</strong>.</p>
            <p>Please renew your permit before it expires to maintain compliance.</p>
            <p>— The PermitPal Team</p>
            </body></html>
            """
        ),
        ["night-cap-warning"] = (
            "Night Cap Warning",
            """
            <html><body>
            <h2>Night Cap Warning</h2>
            <p>Your property <strong>{{PropertyName}}</strong> has used <strong>{{NightsUsed}}</strong> of <strong>{{NightCap}}</strong> allowed nights.</p>
            <p>You are approaching your annual night cap limit. Please plan accordingly.</p>
            <p>— The PermitPal Team</p>
            </body></html>
            """
        ),
        ["regulatory-change"] = (
            "Regulatory Change Alert",
            """
            <html><body>
            <h2>Regulatory Change Alert</h2>
            <p>A regulatory change has been detected in <strong>{{JurisdictionName}}</strong>.</p>
            <p><strong>Summary:</strong> {{ChangeSummary}}</p>
            <p>Please review this change and ensure your properties remain compliant.</p>
            <p>— The PermitPal Team</p>
            </body></html>
            """
        ),
        ["welcome"] = (
            "Welcome to PermitPal",
            """
            <html><body>
            <h2>Welcome to PermitPal!</h2>
            <p>Hi <strong>{{UserName}}</strong>,</p>
            <p>Thank you for joining PermitPal. We're here to help you manage your short-term rental permits and stay compliant.</p>
            <p>Get started by adding your first property and we'll help you track permits, night caps, and regulatory changes.</p>
            <p>— The PermitPal Team</p>
            </body></html>
            """
        ),
        ["forgot-password"] = (
            "Reset your PermitPal password",
            """
            <html><body>
            <h2>Reset Your Password</h2>
            <p>You recently requested to reset your password for your PermitPal account.</p>
            <p>Click the link below to set a new password:</p>
            <p><a href="{{ResetLink}}">Reset Password</a></p>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>This password reset link is only valid for the next hour.</p>
            <p>— The PermitPal Team</p>
            </body></html>
            """
        )
    };

    public EmailService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<EmailService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        var apiKey = _configuration["Email:ApiKey"] ?? "";
        var fromAddress = _configuration["Email:FromAddress"] ?? "noreply@fieldzenpro.com";
        var fromName = _configuration["Email:FromName"] ?? "PermitPal";

        var client = _httpClientFactory.CreateClient("Resend");

        var payload = new
        {
            from = $"{fromName} <{fromAddress}>",
            to = new[] { to },
            subject,
            html = htmlBody
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
        {
            Content = JsonContent.Create(payload)
        };
        request.Headers.Add("Authorization", $"Bearer {apiKey}");

        try
        {
            var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Resend API error: {StatusCode} - {Body}", response.StatusCode, errorBody);
            }
            else
            {
                _logger.LogInformation("Email sent to {To} with subject '{Subject}'", to, subject);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
            throw;
        }
    }

    public async Task SendTemplateAsync(string to, string templateName, object data)
    {
        if (!Templates.TryGetValue(templateName, out var template))
        {
            _logger.LogWarning("Email template '{TemplateName}' not found", templateName);
            return;
        }

        var htmlBody = template.Template;
        var subject = template.Subject;

        // Replace {{variable}} placeholders using reflection on the data object
        if (data is Dictionary<string, string> dict)
        {
            foreach (var kvp in dict)
            {
                htmlBody = htmlBody.Replace($"{{{{{kvp.Key}}}}}", kvp.Value);
                subject = subject.Replace($"{{{{{kvp.Key}}}}}", kvp.Value);
            }
        }
        else
        {
            var properties = data.GetType().GetProperties();
            foreach (var prop in properties)
            {
                var value = prop.GetValue(data)?.ToString() ?? "";
                htmlBody = htmlBody.Replace($"{{{{{prop.Name}}}}}", value);
                subject = subject.Replace($"{{{{{prop.Name}}}}}", value);
            }
        }

        _logger.LogInformation("Preparing to send email to {To}. Subject: {Subject}\nBody:\n{Body}", to, subject, htmlBody);

        await SendAsync(to, subject, htmlBody);
    }
}
