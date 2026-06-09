namespace PermitPal.Application.Interfaces;

public interface IStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string folder);
    Task<string> GetPresignedUrlAsync(string fileUrl, int expiryMinutes = 15);
    Task DeleteAsync(string fileUrl);
    Task<Stream> DownloadAsync(string objectKey);
}
