using System.Net.Http.Headers;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PermitPal.Application.Interfaces;

namespace PermitPal.Infrastructure.Services;

public class SmsService : ISmsService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmsService> _logger;

    public SmsService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<SmsService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendAsync(string phoneNumber, string message)
    {
        var accountSid = _configuration["Sms:AccountSid"] ?? "";
        var authToken = _configuration["Sms:AuthToken"] ?? "";
        var fromNumber = _configuration["Sms:FromNumber"] ?? "";

        var client = _httpClientFactory.CreateClient("Twilio");

        var url = $"https://api.twilio.com/2010-04-01/Accounts/{accountSid}/Messages.json";

        var formData = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("From", fromNumber),
            new KeyValuePair<string, string>("To", phoneNumber),
            new KeyValuePair<string, string>("Body", message)
        });

        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = formData
        };

        // Basic auth: AccountSid:AuthToken
        var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{accountSid}:{authToken}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

        try
        {
            var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Twilio API error: {StatusCode} - {Body}", response.StatusCode, errorBody);
            }
            else
            {
                _logger.LogInformation("SMS sent to {PhoneNumber}", phoneNumber);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SMS to {PhoneNumber}", phoneNumber);
            throw;
        }
    }
}
