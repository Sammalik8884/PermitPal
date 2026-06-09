using Microsoft.Extensions.Configuration;
using PermitPal.Application.Interfaces;
using System.IO;

namespace PermitPal.Infrastructure.Services;

public class LocalFileStorageService : IStorageService
{
    private readonly string _uploadPath;
    private readonly string _publicUrl;

    public LocalFileStorageService(IConfiguration config)
    {
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        _publicUrl = config["Storage:PublicUrl"] ?? "http://localhost:5000/uploads";
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
        return Task.FromResult($"{_publicUrl.TrimEnd('/')}/{fileUrl}");
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
