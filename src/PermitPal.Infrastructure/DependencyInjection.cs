using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PermitPal.Application.Interfaces;
using PermitPal.Infrastructure.Persistence;
using PermitPal.Infrastructure.Services;
using Stripe;

namespace PermitPal.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<PermitPalDbContext>(options =>
            options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 36)), 
                mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<PermitPalDbContext>());
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuditService, AuditService>();

        // Core Business Services
        services.AddScoped<INightCapService, NightCapService>();
        services.AddScoped<IICalParserService, ICalParserService>();
        services.AddScoped<IComplianceScoreService, ComplianceScoreService>();
        services.AddScoped<IJurisdictionResolverService, JurisdictionResolverService>();

        // Notification Services
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ISmsService, SmsService>();
        services.AddScoped<INotificationService, NotificationService>();

        // Billing & Compliance Services
        services.AddScoped<IBillingService, Services.BillingService>();
        services.AddScoped<IEuRegistrationService, EuRegistrationService>();
        services.AddScoped<IAuComplianceService, AuComplianceService>();
        services.AddScoped<IUsTaxService, UsTaxService>();

        // External API Clients
        services.AddScoped<PermitPal.Infrastructure.External.IExternalJurisdictionApiClient, PermitPal.Infrastructure.External.SimulatedJurisdictionApiClient>();

        // Configure Stripe
        StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];

        // HttpClient for ICalParserService
        services.AddHttpClient("ICalParser", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(30);
            client.DefaultRequestHeaders.Add("User-Agent", "PermitPal/1.0");
        });

        // HttpClient for Resend (Email)
        services.AddHttpClient("Resend", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(30);
            client.DefaultRequestHeaders.Add("User-Agent", "PermitPal/1.0");
        });

        // HttpClient for Twilio (SMS)
        services.AddHttpClient("Twilio", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(30);
            client.DefaultRequestHeaders.Add("User-Agent", "PermitPal/1.0");
        });

        // AWS S3 Client for Cloudflare R2
        var r2AccessKey = configuration["Storage:R2:AccessKeyId"];
        if (string.IsNullOrEmpty(r2AccessKey) || r2AccessKey.Contains("your-r2-access-key-id"))
        {
            // Use local file storage in development if real S3 credentials are not set
            services.AddScoped<IStorageService, LocalFileStorageService>();
        }
        else
        {
            services.AddSingleton<IAmazonS3>(sp =>
            {
                var config = sp.GetRequiredService<IConfiguration>();
                var endpoint = config["Storage:R2:AccountId"] != null 
                    ? $"https://{config["Storage:R2:AccountId"]}.r2.cloudflarestorage.com"
                    : config["Storage:Endpoint"] ?? "";
                
                var accessKey = r2AccessKey;
                var secretKey = config["Storage:R2:SecretAccessKey"] ?? config["Storage:SecretKey"] ?? "";

                var s3Config = new AmazonS3Config
                {
                    ServiceURL = endpoint,
                    ForcePathStyle = true
                };

                return new AmazonS3Client(accessKey, secretKey, s3Config);
            });

            services.AddScoped<IStorageService, StorageService>();
        }

        return services;
    }
}
