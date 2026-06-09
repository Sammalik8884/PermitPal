namespace PermitPal.Application.DTOs.Auth;

public record RegisterRequest(
    string OrganisationName,
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? Country = null,
    string? Timezone = null
);

public record LoginRequest(string Email, string Password, string? MfaCode = null);

public record ResetPasswordRequest(string Token, string NewPassword);

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);

public record UserDto(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string OrganisationId,
    string OrganisationName
);
