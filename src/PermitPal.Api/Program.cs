using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PermitPal.Api.Middleware;
using PermitPal.Api.Services;
using PermitPal.Application;
using PermitPal.Application.Interfaces;
using PermitPal.Infrastructure;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ─── Serilog ────────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// ─── Clean Architecture DI ──────────────────────────────────
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// ─── Api Layer Services ─────────────────────────────────────
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<TenantContext>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// ─── Background Workers ─────────────────────────────────────
builder.Services.AddHostedService<JurisdictionSyncWorker>();

// ─── Authentication ─────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "permitpal-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "permitpal-app";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ─── CORS ───────────────────────────────────────────────────
var allowedOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"]?.Split(',') ?? new[] { "http://localhost:3000", "http://localhost:5173" };
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ─── Controllers ────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase));
    });

// ─── Swagger ────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ─── Redis ──────────────────────────────────────────────────
var redisConnection = builder.Configuration["Redis:ConnectionString"];
if (!string.IsNullOrEmpty(redisConnection))
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = redisConnection;
        options.InstanceName = "permitpal:";
    });
}
else
{
    builder.Services.AddDistributedMemoryCache();
}

// ─── HttpClient for external APIs ───────────────────────────
builder.Services.AddHttpClient();

var app = builder.Build();

// ─── Middleware Pipeline ────────────────────────────────────
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "PermitPal API v1"));
}

app.UseStaticFiles();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<TenantMiddleware>();

app.MapControllers();

// ─── Health Check ───────────────────────────────────────────
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();

// Make Program accessible for integration tests
public partial class Program { }
