using Hangfire;
using Hangfire.Redis.StackExchange;
using PermitPal.Infrastructure;
using PermitPal.Worker.Jobs;

var builder = Host.CreateApplicationBuilder(args);

// Add Infrastructure services (DbContext, services, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Add Hangfire with Redis storage
var redisConnection = builder.Configuration["Redis:ConnectionString"] ?? "localhost:6379";
builder.Services.AddHangfire(config =>
{
    config.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
          .UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UseRedisStorage(redisConnection);
});

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = Environment.ProcessorCount * 2;
    options.Queues = new[] { "default", "notifications", "sync" };
});

// Register job classes
builder.Services.AddScoped<ICalSyncJob>();
builder.Services.AddScoped<PermitExpiryCheckJob>();
builder.Services.AddScoped<NightCapAlertJob>();
builder.Services.AddScoped<ComplianceScoreJob>();
builder.Services.AddScoped<RegulatoryChangeCheckJob>();

var host = builder.Build();

// Register recurring jobs
using (var scope = host.Services.CreateScope())
{
    var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

    // iCal sync — every 6 hours
    recurringJobManager.AddOrUpdate<ICalSyncJob>(
        "ical-sync",
        job => job.ExecuteAsync(CancellationToken.None),
        "0 */6 * * *",
        new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

    // Permit expiry check — daily at 9am UTC
    recurringJobManager.AddOrUpdate<PermitExpiryCheckJob>(
        "permit-expiry-check",
        job => job.ExecuteAsync(CancellationToken.None),
        "0 9 * * *",
        new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

    // Night cap alert — daily at 10am UTC
    recurringJobManager.AddOrUpdate<NightCapAlertJob>(
        "night-cap-alert",
        job => job.ExecuteAsync(CancellationToken.None),
        "0 10 * * *",
        new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

    // Compliance score recalculation — daily at 2am UTC
    recurringJobManager.AddOrUpdate<ComplianceScoreJob>(
        "compliance-score",
        job => job.ExecuteAsync(CancellationToken.None),
        "0 2 * * *",
        new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

    // Regulatory change check — every 12 hours
    recurringJobManager.AddOrUpdate<RegulatoryChangeCheckJob>(
        "regulatory-change-check",
        job => job.ExecuteAsync(CancellationToken.None),
        "0 */12 * * *",
        new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });
}

host.Run();
