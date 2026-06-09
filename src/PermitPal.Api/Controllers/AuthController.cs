using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermitPal.Application.DTOs.Auth;
using PermitPal.Application.Interfaces;

namespace PermitPal.Api.Controllers;

public class AuthController : BaseController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Register a new user and organisation.
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Login with email and password.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Refresh an access token using a refresh token.
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken);
        return Ok(result);
    }

    /// <summary>
    /// Revoke a refresh token (logout).
    /// </summary>
    [HttpPost("revoke")]
    [Authorize]
    public async Task<IActionResult> Revoke([FromBody] RefreshTokenRequest request)
    {
        // Find user and clear refresh token
        await _authService.RefreshTokenAsync(request.RefreshToken);
        return NoContent();
    }

    /// <summary>
    /// Request a password reset email.
    /// </summary>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        await _authService.ForgotPasswordAsync(request.Email);
        return Ok(new { message = "If the email exists, a reset link has been sent." });
    }

    /// <summary>
    /// Reset password using a token.
    /// </summary>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        await _authService.ResetPasswordAsync(request);
        return Ok(new { message = "Password has been reset successfully." });
    }
}

public record RefreshTokenRequest(string RefreshToken);
public record ForgotPasswordRequest(string Email);
