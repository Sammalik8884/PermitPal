using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PermitPal.Application.DTOs.Auth;
using PermitPal.Infrastructure.Services;
using PermitPal.Tests.Helpers;
using System.IdentityModel.Tokens.Jwt;

namespace PermitPal.Tests.Services;

public class AuthServiceTests : IDisposable
{
    private readonly Infrastructure.Persistence.PermitPalDbContext _dbContext;
    private readonly AuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthServiceTests()
    {
        _dbContext = TestDbContextFactory.Create();
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:SecretKey"] = "ThisIsAVeryLongSecretKeyForTestingPurposesOnly1234567890!",
                ["Jwt:Issuer"] = "permitpal-test",
                ["Jwt:Audience"] = "permitpal-test-app",
                ["Jwt:AccessTokenExpiryMinutes"] = "30",
                ["Jwt:RefreshTokenExpiryDays"] = "7"
            })
            .Build();

        _authService = new AuthService(_dbContext, _configuration);
    }

    [Fact]
    public async Task RegisterAsync_CreatesOrganisationAndUser()
    {
        // Arrange
        var request = new RegisterRequest(
            OrganisationName: "New Org",
            Email: "newuser@example.com",
            Password: "SecurePass123!",
            FirstName: "Jane",
            LastName: "Doe",
            Country: "AU",
            Timezone: "Australia/Sydney"
        );

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.User.Email.Should().Be("newuser@example.com");
        result.User.FirstName.Should().Be("Jane");
        result.User.OrganisationName.Should().Be("New Org");

        var org = _dbContext.Organisations.FirstOrDefault(o => o.Email == "newuser@example.com");
        org.Should().NotBeNull();
        org!.Name.Should().Be("New Org");
    }

    [Fact]
    public async Task RegisterAsync_HashesPassword()
    {
        // Arrange
        var request = new RegisterRequest(
            OrganisationName: "Hash Test Org",
            Email: "hashtest@example.com",
            Password: "PlainTextPassword!",
            FirstName: "Hash",
            LastName: "Test",
            Country: "US",
            Timezone: "America/New_York"
        );

        // Act
        await _authService.RegisterAsync(request);

        // Assert
        var user = _dbContext.Users.FirstOrDefault(u => u.Email == "hashtest@example.com");
        user.Should().NotBeNull();
        user!.PasswordHash.Should().NotBe("PlainTextPassword!");
        BCrypt.Net.BCrypt.Verify("PlainTextPassword!", user.PasswordHash).Should().BeTrue();
    }

    [Fact]
    public async Task RegisterAsync_ReturnsValidJwt()
    {
        // Arrange
        var request = new RegisterRequest(
            OrganisationName: "JWT Test Org",
            Email: "jwttest@example.com",
            Password: "JwtPass123!",
            FirstName: "Jwt",
            LastName: "Test",
            Country: "AU",
            Timezone: "Australia/Sydney"
        );

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        result.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
        result.ExpiresAt.Should().BeAfter(DateTime.UtcNow);

        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(result.AccessToken);
        token.Claims.Should().Contain(c => c.Type == "email" && c.Value == "jwttest@example.com");
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsToken()
    {
        // Arrange - the seeded user has email "user@testorg.com" with password "TestPassword123!"
        var request = new LoginRequest("user@testorg.com", "TestPassword123!");

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
        result.User.Email.Should().Be("user@testorg.com");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ThrowsUnauthorized()
    {
        // Arrange
        var request = new LoginRequest("nonexistent@example.com", "SomePassword!");

        // Act
        var act = () => _authService.LoginAsync(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*Invalid email or password*");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ThrowsUnauthorized()
    {
        // Arrange
        var request = new LoginRequest("user@testorg.com", "WrongPassword!");

        // Act
        var act = () => _authService.LoginAsync(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*Invalid email or password*");
    }

    [Fact]
    public async Task RefreshTokenAsync_WithValidToken_ReturnsNewTokens()
    {
        // Arrange - first login to get a valid refresh token
        var loginResult = await _authService.LoginAsync(new LoginRequest("user@testorg.com", "TestPassword123!"));

        // Act
        var result = await _authService.RefreshTokenAsync(loginResult.RefreshToken);

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBe(loginResult.RefreshToken); // New token generated
    }

    [Fact]
    public async Task RefreshTokenAsync_WithExpiredToken_ThrowsUnauthorized()
    {
        // Arrange - set the user's refresh token to expired
        var user = _dbContext.Users.First(u => u.Email == "user@testorg.com");
        user.RefreshToken = "expired-token";
        user.RefreshTokenExpires = DateTime.UtcNow.AddDays(-1);
        await _dbContext.SaveChangesAsync();

        // Act
        var act = () => _authService.RefreshTokenAsync("expired-token");

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*expired*");
    }

    [Fact]
    public async Task RevokeRefreshTokenAsync_InvalidatesToken()
    {
        // Arrange - login to get a valid refresh token
        var loginResult = await _authService.LoginAsync(new LoginRequest("user@testorg.com", "TestPassword123!"));
        var refreshToken = loginResult.RefreshToken;

        // Refresh once to get a new token (old one is now invalid)
        var refreshResult = await _authService.RefreshTokenAsync(refreshToken);

        // Act - try to use the old refresh token
        var act = () => _authService.RefreshTokenAsync(refreshToken);

        // Assert - old token should no longer work
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}
