using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PermitPal.Application.DTOs.Auth;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Services;

/// <summary>
/// Implements IAuthService with JWT generation, BCrypt password hashing,
/// and refresh token management.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public AuthService(IApplicationDbContext dbContext, IConfiguration configuration, IEmailService emailService)
    {
        _dbContext = dbContext;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if email already exists
        var existingUser = await _dbContext.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
            throw new InvalidOperationException("A user with this email already exists.");

        // Create Organisation
        var organisation = new Organisation
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.OrganisationName,
            Slug = GenerateSlug(request.OrganisationName),
            Country = request.Country ?? "",
            Timezone = request.Timezone ?? "UTC",
            Email = request.Email,
            SubscriptionPlan = SubscriptionPlan.Solo,
            SubscriptionStatus = SubscriptionStatus.Trialing,
            TrialEndsAt = DateTime.UtcNow.AddDays(14),
            MaxProperties = 1,
            MaxTeamSeats = 1
        };

        _dbContext.Organisations.Add(organisation);

        // Create User with hashed password
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = organisation.Id,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = UserRole.Owner,
            IsActive = true,
            LastLoginAt = DateTime.UtcNow
        };

        // Generate refresh token
        var refreshToken = GenerateRefreshToken();
        var refreshTokenExpiryDays = _configuration.GetValue<int>("Jwt:RefreshTokenExpiryDays", 30);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpires = DateTime.UtcNow.AddDays(refreshTokenExpiryDays);

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        // Generate JWT
        var accessToken = GenerateJwtToken(user, organisation);
        var expiryMinutes = _configuration.GetValue<int>("Jwt:AccessTokenExpiryMinutes", 30);

        return new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            ExpiresAt: DateTime.UtcNow.AddMinutes(expiryMinutes),
            User: MapToUserDto(user, organisation)
        );
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _dbContext.Users
            .IgnoreQueryFilters()
            .Include(u => u.Organisation)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account is deactivated.");

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;

        // Generate new refresh token
        var refreshToken = GenerateRefreshToken();
        var refreshTokenExpiryDays = _configuration.GetValue<int>("Jwt:RefreshTokenExpiryDays", 30);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpires = DateTime.UtcNow.AddDays(refreshTokenExpiryDays);
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        // Generate JWT
        var accessToken = GenerateJwtToken(user, user.Organisation);
        var expiryMinutes = _configuration.GetValue<int>("Jwt:AccessTokenExpiryMinutes", 30);

        return new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            ExpiresAt: DateTime.UtcNow.AddMinutes(expiryMinutes),
            User: MapToUserDto(user, user.Organisation)
        );
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var user = await _dbContext.Users
            .IgnoreQueryFilters()
            .Include(u => u.Organisation)
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid refresh token.");

        if (user.RefreshTokenExpires < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token has expired.");

        // Generate new tokens
        var newRefreshToken = GenerateRefreshToken();
        var refreshTokenExpiryDays = _configuration.GetValue<int>("Jwt:RefreshTokenExpiryDays", 30);
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpires = DateTime.UtcNow.AddDays(refreshTokenExpiryDays);
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        var accessToken = GenerateJwtToken(user, user.Organisation);
        var expiryMinutes = _configuration.GetValue<int>("Jwt:AccessTokenExpiryMinutes", 30);

        return new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: newRefreshToken,
            ExpiresAt: DateTime.UtcNow.AddMinutes(expiryMinutes),
            User: MapToUserDto(user, user.Organisation)
        );
    }

    public async Task ForgotPasswordAsync(string email)
    {
        var user = await _dbContext.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
            return; // Don't reveal whether email exists

        user.ResetToken = GenerateRefreshToken();
        user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        var appUrl = _configuration["AppUrl"] ?? "http://localhost:5173";
        var resetLink = $"{appUrl}/reset-password?token={Uri.EscapeDataString(user.ResetToken)}";

        await _emailService.SendTemplateAsync(user.Email, "forgot-password", new { ResetLink = resetLink });
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _dbContext.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.ResetToken == request.Token);

        if (user == null || user.ResetTokenExpires < DateTime.UtcNow)
            throw new InvalidOperationException("Invalid or expired reset token.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.ResetToken = null;
        user.ResetTokenExpires = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
    }

    private string GenerateJwtToken(User user, Organisation organisation)
    {
        var secretKey = _configuration["Jwt:SecretKey"]
            ?? throw new InvalidOperationException("JWT SecretKey not configured");
        var issuer = _configuration["Jwt:Issuer"] ?? "permitpal-api";
        var audience = _configuration["Jwt:Audience"] ?? "permitpal-app";
        var expiryMinutes = _configuration.GetValue<int>("Jwt:AccessTokenExpiryMinutes", 30);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName),
            new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName),
            new Claim("org_id", organisation.Id),
            new Claim("org_name", organisation.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("role", user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private static string GenerateSlug(string name)
    {
        return name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "");
    }

    private static UserDto MapToUserDto(User user, Organisation organisation)
    {
        return new UserDto(
            Id: user.Id,
            Email: user.Email,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Role: user.Role.ToString(),
            OrganisationId: organisation.Id,
            OrganisationName: organisation.Name
        );
    }
}
