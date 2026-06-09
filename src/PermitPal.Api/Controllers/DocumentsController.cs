using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Api.Controllers;

[Authorize]
public class DocumentsController : BaseController
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IStorageService _storageService;

    public DocumentsController(IApplicationDbContext dbContext, IStorageService storageService)
    {
        _dbContext = dbContext;
        _storageService = storageService;
    }

    /// <summary>
    /// List documents for a property.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? propertyId)
    {
        var orgId = GetOrganisationId();

        var query = _dbContext.Documents.Where(d => d.OrganisationId == orgId);
        
        if (!string.IsNullOrEmpty(propertyId))
            query = query.Where(d => d.PropertyId == propertyId);

        var documents = await query
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new
            {
                d.Id,
                d.PropertyId,
                d.Name,
                d.DocumentType,
                d.MimeType,
                d.FileSizeBytes,
                d.ExpiryDate,
                d.CreatedAt,
                d.FileUrl
            })
            .ToListAsync();

        return Ok(documents);
    }

    /// <summary>
    /// Get a presigned download URL for a document.
    /// </summary>
    [HttpGet("{id}/download")]
    public async Task<IActionResult> Download(string id)
    {
        var orgId = GetOrganisationId();

        var document = await _dbContext.Documents
            .FirstOrDefaultAsync(d => d.Id == id && d.OrganisationId == orgId);

        if (document == null)
            return NotFound();

        var url = await _storageService.GetPresignedUrlAsync(document.FileUrl, 60);
        return Ok(new { url });
    }

    /// <summary>
    /// Upload a document (multipart form: file, propertyId, permitId?, documentType).
    /// </summary>
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(
        IFormFile file,
        [FromForm] string propertyId,
        [FromForm] string? permitId,
        [FromForm] DocumentType documentType)
    {
        var orgId = GetOrganisationId();
        var userId = GetUserId();

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file provided." });

        using var stream = file.OpenReadStream();
        var objectKey = await _storageService.UploadAsync(stream, file.FileName, file.ContentType, orgId);

        var document = new Document
        {
            Id = Guid.NewGuid().ToString(),
            OrganisationId = orgId,
            PropertyId = propertyId,
            PermitId = permitId,
            DocumentType = documentType,
            Name = file.FileName,
            FileUrl = objectKey,
            FileSizeBytes = (int)file.Length,
            MimeType = file.ContentType,
            UploadedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Documents.Add(document);
        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            document.Id,
            document.Name,
            document.DocumentType,
            document.FileSizeBytes,
            document.CreatedAt
        });
    }

    /// <summary>
    /// Delete a document (removes from R2 + soft delete in DB).
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var orgId = GetOrganisationId();

        var document = await _dbContext.Documents
            .FirstOrDefaultAsync(d => d.Id == id && d.OrganisationId == orgId);

        if (document == null)
            return NotFound();

        // Delete from storage
        await _storageService.DeleteAsync(document.FileUrl);

        // Remove from DB
        _dbContext.Documents.Remove(document);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
