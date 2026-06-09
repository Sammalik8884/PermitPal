using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PermitPal.Api.Controllers;
using PermitPal.Application.DTOs.Auth;
using PermitPal.Application.Interfaces;

namespace PermitPal.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _mockAuthService;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _mockAuthService = new Mock<IAuthService>();
        _controller = new AuthController(_mockAuthService.Object);
    }

    [Fact]
    public async Task Register_WithValidRequest_ReturnsOkWithAuthResponse()
    {
        // Arrange
        var request = new RegisterRequest(
            "Test Org", "test@example.com", "Password123!",
            "John", "Doe", "AU", "Australia/Sydney");

        var expectedResponse = new AuthResponse(
            "access-token-123",
            "refresh-token-456",
            DateTime.UtcNow.AddMinutes(30),
            new UserDto("user-1", "test@example.com", "John", "Doe", "Owner", "org-1", "Test Org"));

        _mockAuthService.Setup(s => s.RegisterAsync(request))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.Register(request);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var response = okResult.Value.Should().BeOfType<AuthResponse>().Subject;
        response.AccessToken.Should().Be("access-token-123");
        response.User.Email.Should().Be("test@example.com");
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOkWithAuthResponse()
    {
        // Arrange
        var request = new LoginRequest("user@test.com", "Password123!");

        var expectedResponse = new AuthResponse(
            "access-token-789",
            "refresh-token-012",
            DateTime.UtcNow.AddMinutes(30),
            new UserDto("user-1", "user@test.com", "Test", "User", "Owner", "org-1", "Test Org"));

        _mockAuthService.Setup(s => s.LoginAsync(request))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.Login(request);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var response = okResult.Value.Should().BeOfType<AuthResponse>().Subject;
        response.AccessToken.Should().Be("access-token-789");
        response.User.Email.Should().Be("user@test.com");
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ThrowsUnauthorized()
    {
        // Arrange
        var request = new LoginRequest("bad@test.com", "WrongPass!");

        _mockAuthService.Setup(s => s.LoginAsync(request))
            .ThrowsAsync(new UnauthorizedAccessException("Invalid email or password."));

        // Act
        var act = () => _controller.Login(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task Refresh_WithValidToken_ReturnsNewTokens()
    {
        // Arrange
        var request = new RefreshTokenRequest("valid-refresh-token");

        var expectedResponse = new AuthResponse(
            "new-access-token",
            "new-refresh-token",
            DateTime.UtcNow.AddMinutes(30),
            new UserDto("user-1", "user@test.com", "Test", "User", "Owner", "org-1", "Test Org"));

        _mockAuthService.Setup(s => s.RefreshTokenAsync("valid-refresh-token"))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.Refresh(request);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var response = okResult.Value.Should().BeOfType<AuthResponse>().Subject;
        response.AccessToken.Should().Be("new-access-token");
        response.RefreshToken.Should().Be("new-refresh-token");
    }

    [Fact]
    public async Task Refresh_WithInvalidToken_ThrowsUnauthorized()
    {
        // Arrange
        var request = new RefreshTokenRequest("invalid-token");

        _mockAuthService.Setup(s => s.RefreshTokenAsync("invalid-token"))
            .ThrowsAsync(new UnauthorizedAccessException("Invalid or expired refresh token."));

        // Act
        var act = () => _controller.Refresh(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task ForgotPassword_ReturnsOk_RegardlessOfEmailExistence()
    {
        // Arrange
        var request = new ForgotPasswordRequest("any@email.com");

        _mockAuthService.Setup(s => s.ForgotPasswordAsync("any@email.com"))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.ForgotPassword(request);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task ResetPassword_WithValidToken_ReturnsOk()
    {
        // Arrange
        var request = new ResetPasswordRequest("valid-reset-token", "NewPassword123!");

        _mockAuthService.Setup(s => s.ResetPasswordAsync(request))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.ResetPassword(request);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }
}
