using System.Net;
using System.Text.Json;

namespace PermitPal.Api.Middleware;

/// <summary>
/// Global exception handler middleware.
/// Catches exceptions, logs them, and returns standardized JSON error responses.
/// </summary>
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            FluentValidation.ValidationException validationEx =>
                (HttpStatusCode.BadRequest, FormatValidationErrors(validationEx)),
            UnauthorizedAccessException =>
                (HttpStatusCode.Unauthorized, "Unauthorized access."),
            KeyNotFoundException =>
                (HttpStatusCode.NotFound, "The requested resource was not found."),
            ArgumentException argEx =>
                (HttpStatusCode.BadRequest, argEx.Message),
            InvalidOperationException invEx =>
                (HttpStatusCode.BadRequest, invEx.Message),
            _ =>
                (HttpStatusCode.InternalServerError, "An unexpected error occurred.")
        };

        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        }
        else
        {
            _logger.LogWarning(exception, "Handled exception ({StatusCode}): {Message}", (int)statusCode, exception.Message);
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = new ErrorResponse
        {
            Status = (int)statusCode,
            Message = message,
            TraceId = context.TraceIdentifier
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }

    private static string FormatValidationErrors(FluentValidation.ValidationException ex)
    {
        var errors = ex.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
        return string.Join("; ", errors);
    }
}

internal class ErrorResponse
{
    public int Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? TraceId { get; set; }
}
