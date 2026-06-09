using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PermitPal.Application.Interfaces;
using System.IO;

namespace PermitPal.Infrastructure.Services;

public class LocalFileStorageService : IStorageService
{
    private readonly string _uploadPath;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string? _configuredPublicUrl;

    public LocalFileStorageService(IConfiguration config, IHttpContextAccessor httpContextAccessor)
    {
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        _configuredPublicUrl = config["Storage:PublicUrl"];
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string folder)
    {
        var folderPath = Path.Combine(_uploadPath, folder);
        Directory.CreateDirectory(folderPath);

        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var filePath = Path.Combine(folderPath, uniqueFileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await fileStream.CopyToAsync(stream);

        return $"{folder}/{uniqueFileName}"; // The relative key
    }

    public Task<string> GetPresignedUrlAsync(string fileUrl, int expiryMinutes = 15)
    {
        var request = _httpContextAccessor.HttpContext?.Request;
        string baseUrl;
        
        if (!string.IsNullOrEmpty(_configuredPublicUrl))
        {
            baseUrl = _configuredPublicUrl;
        }
        else if (request != null)
        {
            baseUrl = $"{request.Scheme}://{request.Host}/uploads";
        }
        else
        {
            baseUrl = "http://localhost:5000/uploads";
        }

        return Task.FromResult($"{baseUrl.TrimEnd('/')}/{fileUrl}");
    }

    public Task DeleteAsync(string fileUrl)
    {
        var filePath = Path.Combine(_uploadPath, fileUrl);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
        return Task.CompletedTask;
    }

    public Task<Stream> DownloadAsync(string objectKey)
    {
        var filePath = Path.Combine(_uploadPath, objectKey);
        if (!File.Exists(filePath))
            throw new FileNotFoundException("File not found", filePath);
            
        return Task.FromResult<Stream>(new FileStream(filePath, FileMode.Open, FileAccess.Read));
    }
}
