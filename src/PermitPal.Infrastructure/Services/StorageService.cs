using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using PermitPal.Application.Interfaces;

namespace PermitPal.Infrastructure.Services;

/// <summary>
/// Implements IStorageService — uses Cloudflare R2 (S3-compatible) via AWS SDK for file storage.
/// </summary>
public class StorageService : IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public StorageService(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _bucketName = configuration["Storage:BucketName"] ?? "permitpal-documents";
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string folder)
    {
        var key = $"{folder}/{Guid.NewGuid()}/{fileName}";

        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType
        };

        await _s3Client.PutObjectAsync(request);

        return key;
    }

    public async Task<string> GetPresignedUrlAsync(string fileUrl, int expiryMinutes = 15)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = fileUrl,
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Verb = HttpVerb.GET
        };

        var url = await _s3Client.GetPreSignedURLAsync(request);
        return url;
    }

    public async Task DeleteAsync(string fileUrl)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = fileUrl
        };

        await _s3Client.DeleteObjectAsync(request);
    }

    public async Task<Stream> DownloadAsync(string objectKey)
    {
        var request = new GetObjectRequest
        {
            BucketName = _bucketName,
            Key = objectKey
        };

        var response = await _s3Client.GetObjectAsync(request);
        return response.ResponseStream;
    }
}
