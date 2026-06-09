using Microsoft.EntityFrameworkCore;
using PermitPal.Application.Interfaces;
using PermitPal.Domain.Entities;
using PermitPal.Domain.Enums;

namespace PermitPal.Infrastructure.Persistence;

public class PermitPalDbContext : DbContext, IApplicationDbContext
{
    private string? _currentTenantId;

    public PermitPalDbContext(DbContextOptions<PermitPalDbContext> options) : base(options) { }

    public DbSet<Organisation> Organisations => Set<Organisation>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Country> Countries => Set<Country>();
    public DbSet<StateRegion> StatesRegions => Set<StateRegion>();
    public DbSet<Jurisdiction> Jurisdictions => Set<Jurisdiction>();
    public DbSet<JurisdictionPostcode> JurisdictionPostcodes => Set<JurisdictionPostcode>();
    public DbSet<RegulatoryChange> RegulatoryChanges => Set<RegulatoryChange>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Permit> Permits => Set<Permit>();
    public DbSet<NightCapRecord> NightCapRecords => Set<NightCapRecord>();
    public DbSet<BookedNight> BookedNights => Set<BookedNight>();
    public DbSet<ICalFeed> ICalFeeds => Set<ICalFeed>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<AlertSubscription> AlertSubscriptions => Set<AlertSubscription>();
    public DbSet<NotificationLog> NotificationLogs => Set<NotificationLog>();
    public DbSet<RegulatoryAlertLog> RegulatoryAlertLogs => Set<RegulatoryAlertLog>();
    public DbSet<EuRegistrationProgress> EuRegistrationProgress => Set<EuRegistrationProgress>();
    public DbSet<AuLevyRecord> AuLevyRecords => Set<AuLevyRecord>();
    public DbSet<AuFireSafetyRecord> AuFireSafetyRecords => Set<AuFireSafetyRecord>();
    public DbSet<AuComplaintLog> AuComplaintLogs => Set<AuComplaintLog>();
    public DbSet<UsTaxRecord> UsTaxRecords => Set<UsTaxRecord>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    public void SetTenantId(string tenantId) => _currentTenantId = tenantId;

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);

        // Organisation
        mb.Entity<Organisation>(e =>
        {
            e.ToTable("organisations");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.Slug).HasMaxLength(200).IsRequired();
            e.Property(x => x.Country).HasMaxLength(2).IsRequired();
            e.Property(x => x.Timezone).HasMaxLength(50).IsRequired();
            e.Property(x => x.Email).HasMaxLength(255).IsRequired();
            e.Property(x => x.Phone).HasMaxLength(30);
            e.Property(x => x.SubscriptionPlan).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.SubscriptionStatus).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.StripeCustomerId).HasMaxLength(100);
            e.Property(x => x.StripeSubscriptionId).HasMaxLength(100);
            e.HasIndex(x => x.Slug).IsUnique();
            e.HasIndex(x => x.Email).IsUnique();
            e.HasIndex(x => x.StripeCustomerId).IsUnique();
        });

        // User
        mb.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.Email).HasMaxLength(255).IsRequired();
            e.Property(x => x.PasswordHash).HasMaxLength(255).IsRequired();
            e.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
            e.Property(x => x.LastName).HasMaxLength(100).IsRequired();
            e.Property(x => x.Role).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.MfaSecret).HasMaxLength(255);
            e.Property(x => x.ResetToken).HasMaxLength(255);
            e.Property(x => x.RefreshToken).HasMaxLength(500);
            e.HasIndex(x => x.Email).IsUnique();
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.Organisation).WithMany(o => o.Users).HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // Country (no tenant filter)
        mb.Entity<Country>(e =>
        {
            e.ToTable("countries");
            e.HasKey(x => x.Code);
            e.Property(x => x.Code).HasMaxLength(2);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Currency).HasMaxLength(3).IsRequired();
            e.Property(x => x.StrLegalStatus).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.NationalFrameworkUrl).HasMaxLength(500);
            e.Property(x => x.Notes).HasMaxLength(2000);
        });

        // StateRegion (no tenant filter)
        mb.Entity<StateRegion>(e =>
        {
            e.ToTable("states_regions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.CountryCode).HasMaxLength(2).IsRequired();
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.Code).HasMaxLength(10);
            e.Property(x => x.RegistrationUrl).HasMaxLength(500);
            e.Property(x => x.LevyPct).HasColumnType("decimal(5,2)");
            e.Property(x => x.LevyAuthority).HasMaxLength(200);
            e.Property(x => x.LevyReportUrl).HasMaxLength(500);
            e.Property(x => x.Notes).HasMaxLength(2000);
            e.HasIndex(x => new { x.CountryCode, x.Code }).IsUnique();
            e.HasOne(x => x.Country).WithMany(c => c.StatesRegions).HasForeignKey(x => x.CountryCode).OnDelete(DeleteBehavior.Cascade);
        });

        // Jurisdiction (no tenant filter)
        mb.Entity<Jurisdiction>(e =>
        {
            e.ToTable("jurisdictions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.CountryCode).HasMaxLength(2).IsRequired();
            e.Property(x => x.StateRegionId).HasMaxLength(36);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.Slug).HasMaxLength(200).IsRequired();
            e.Property(x => x.JurisdictionType).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.PermitType).HasMaxLength(100);
            e.Property(x => x.PermitDescription).HasMaxLength(2000);
            e.Property(x => x.PermitPortalUrl).HasMaxLength(500);
            e.Property(x => x.NightCapNotes).HasMaxLength(500);
            e.Property(x => x.ZoningNotes).HasMaxLength(2000);
            e.Property(x => x.TotRatePct).HasColumnType("decimal(5,2)");
            e.Property(x => x.TotName).HasMaxLength(100);
            e.Property(x => x.TotFilingUrl).HasMaxLength(500);
            e.Property(x => x.AdditionalTaxes).HasColumnType("json");
            e.Property(x => x.EuRegistrationScheme).HasMaxLength(200);
            e.Property(x => x.EuRegistrationUrl).HasMaxLength(500);
            e.Property(x => x.AuFireSafetyStandard).HasMaxLength(200);
            e.Property(x => x.FineCurrency).HasMaxLength(3);
            e.Property(x => x.FineNotes).HasMaxLength(1000);
            e.Property(x => x.EnforcementLevel).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.VerifiedBy).HasMaxLength(100);
            e.Property(x => x.SourceUrls).HasColumnType("json");
            e.HasIndex(x => x.Slug).IsUnique();
            e.HasIndex(x => x.CountryCode);
            e.HasIndex(x => x.StateRegionId);
            e.HasOne(x => x.Country).WithMany(c => c.Jurisdictions).HasForeignKey(x => x.CountryCode).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.StateRegion).WithMany(s => s.Jurisdictions).HasForeignKey(x => x.StateRegionId).OnDelete(DeleteBehavior.SetNull);
        });

        // JurisdictionPostcode (no tenant filter)
        mb.Entity<JurisdictionPostcode>(e =>
        {
            e.ToTable("jurisdiction_postcodes");
            e.HasKey(x => new { x.Postcode, x.CountryCode, x.JurisdictionId });
            e.Property(x => x.Postcode).HasMaxLength(20);
            e.Property(x => x.CountryCode).HasMaxLength(2);
            e.Property(x => x.JurisdictionId).HasMaxLength(36);
            e.HasIndex(x => new { x.Postcode, x.CountryCode });
            e.HasOne(x => x.Jurisdiction).WithMany(j => j.Postcodes).HasForeignKey(x => x.JurisdictionId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Country).WithMany().HasForeignKey(x => x.CountryCode).OnDelete(DeleteBehavior.Cascade);
        });

        // RegulatoryChange (no tenant filter)
        mb.Entity<RegulatoryChange>(e =>
        {
            e.ToTable("regulatory_changes");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.JurisdictionId).HasMaxLength(36).IsRequired();
            e.Property(x => x.ChangeType).HasConversion<string>().HasMaxLength(30);
            e.Property(x => x.ChangeSummary).HasMaxLength(2000).IsRequired();
            e.Property(x => x.OldValue).HasMaxLength(500);
            e.Property(x => x.NewValue).HasMaxLength(500);
            e.Property(x => x.SourceUrl).HasMaxLength(500);
            e.Property(x => x.AiSummary).HasMaxLength(2000);
            e.Property(x => x.Severity).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(x => x.JurisdictionId);
            e.HasIndex(x => x.CreatedAt);
            e.HasOne(x => x.Jurisdiction).WithMany(j => j.RegulatoryChanges).HasForeignKey(x => x.JurisdictionId).OnDelete(DeleteBehavior.Cascade);
        });

        // Property
        mb.Entity<Property>(e =>
        {
            e.ToTable("properties");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.AddressLine1).HasMaxLength(300).IsRequired();
            e.Property(x => x.AddressLine2).HasMaxLength(300);
            e.Property(x => x.City).HasMaxLength(100).IsRequired();
            e.Property(x => x.StateRegion).HasMaxLength(100);
            e.Property(x => x.Postcode).HasMaxLength(20).IsRequired();
            e.Property(x => x.CountryCode).HasMaxLength(2).IsRequired();
            e.Property(x => x.Lat).HasColumnType("decimal(10,7)");
            e.Property(x => x.Lng).HasColumnType("decimal(10,7)");
            e.Property(x => x.JurisdictionId).HasMaxLength(36);
            e.Property(x => x.PropertyType).HasConversion<string>().HasMaxLength(30);
            e.Property(x => x.HostedType).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.AirbnbListingId).HasMaxLength(100);
            e.Property(x => x.AirbnbListingUrl).HasMaxLength(500);
            e.Property(x => x.VrboListingId).HasMaxLength(100);
            e.Property(x => x.BookingListingId).HasMaxLength(100);
            e.Property(x => x.ComplianceStatus).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.Notes).HasMaxLength(2000);
            e.HasIndex(x => x.OrganisationId);
            e.HasIndex(x => x.JurisdictionId);
            e.HasIndex(x => new { x.Postcode, x.CountryCode });
            e.HasOne(x => x.Organisation).WithMany(o => o.Properties).HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Jurisdiction).WithMany().HasForeignKey(x => x.JurisdictionId).OnDelete(DeleteBehavior.SetNull);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // Permit
        mb.Entity<Permit>(e =>
        {
            e.ToTable("permits");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.Property(x => x.JurisdictionId).HasMaxLength(36);
            e.Property(x => x.PermitType).HasMaxLength(100).IsRequired();
            e.Property(x => x.PermitNumber).HasMaxLength(100);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.IssuingAuthority).HasMaxLength(200);
            e.Property(x => x.RenewalUrl).HasMaxLength(500);
            e.Property(x => x.EuRegistrationNumber).HasMaxLength(100);
            e.Property(x => x.EuRegistrationCountry).HasMaxLength(2);
            e.Property(x => x.Notes).HasMaxLength(2000);
            e.HasIndex(x => x.OrganisationId);
            e.HasIndex(x => x.PropertyId);
            e.HasIndex(x => x.ExpiryDate);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany(p => p.Permits).HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Jurisdiction).WithMany().HasForeignKey(x => x.JurisdictionId).OnDelete(DeleteBehavior.SetNull);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // NightCapRecord
        mb.Entity<NightCapRecord>(e =>
        {
            e.ToTable("night_cap_records");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.HasIndex(x => new { x.PropertyId, x.CalendarYear }).IsUnique();
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany(p => p.NightCapRecords).HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // BookedNight
        mb.Entity<BookedNight>(e =>
        {
            e.ToTable("booked_nights");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.Property(x => x.Source).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.BookingRef).HasMaxLength(200);
            e.Property(x => x.ICalUid).HasMaxLength(500);
            e.HasIndex(x => new { x.PropertyId, x.NightDate, x.Source }).IsUnique();
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany(p => p.BookedNights).HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // ICalFeed
        mb.Entity<ICalFeed>(e =>
        {
            e.ToTable("ical_feeds");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.Property(x => x.Platform).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.ICalUrl).HasMaxLength(1000).IsRequired();
            e.Property(x => x.LastSyncStatus).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.LastSyncError).HasMaxLength(2000);
            e.HasIndex(x => x.PropertyId);
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany(p => p.ICalFeeds).HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // Document
        mb.Entity<Document>(e =>
        {
            e.ToTable("documents");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36);
            e.Property(x => x.PermitId).HasMaxLength(36);
            e.Property(x => x.DocumentType).HasConversion<string>().HasMaxLength(30);
            e.Property(x => x.Name).HasMaxLength(300).IsRequired();
            e.Property(x => x.FileUrl).HasMaxLength(1000).IsRequired();
            e.Property(x => x.MimeType).HasMaxLength(100);
            e.Property(x => x.UploadedByUserId).HasMaxLength(36);
            e.HasIndex(x => x.OrganisationId);
            e.HasIndex(x => x.PropertyId);
            e.HasIndex(x => x.PermitId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany(p => p.Documents).HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Permit).WithMany(p => p.Documents).HasForeignKey(x => x.PermitId).OnDelete(DeleteBehavior.SetNull);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // AlertSubscription
        mb.Entity<AlertSubscription>(e =>
        {
            e.ToTable("alert_subscriptions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.UserId).HasMaxLength(36).IsRequired();
            e.Property(x => x.JurisdictionId).HasMaxLength(36);
            e.Property(x => x.PropertyId).HasMaxLength(36);
            e.Property(x => x.AlertType).HasConversion<string>().HasMaxLength(30);
            e.Property(x => x.Channel).HasMaxLength(20).IsRequired();
            e.HasIndex(x => x.OrganisationId);
            e.HasIndex(x => x.UserId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // NotificationLog (no tenant filter - system access)
        mb.Entity<NotificationLog>(e =>
        {
            e.ToTable("notification_log");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.UserId).HasMaxLength(36);
            e.Property(x => x.PropertyId).HasMaxLength(36);
            e.Property(x => x.PermitId).HasMaxLength(36);
            e.Property(x => x.AlertType).HasMaxLength(50).IsRequired();
            e.Property(x => x.Channel).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.Recipient).HasMaxLength(255).IsRequired();
            e.Property(x => x.Subject).HasMaxLength(500);
            e.Property(x => x.Body).IsRequired();
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.ProviderMessageId).HasMaxLength(200);
            e.Property(x => x.ErrorMessage).HasMaxLength(2000);
            e.HasIndex(x => x.OrganisationId);
            e.HasIndex(x => x.CreatedAt);
        });

        // RegulatoryAlertLog
        mb.Entity<RegulatoryAlertLog>(e =>
        {
            e.ToTable("regulatory_alert_log");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.RegulatoryChangeId).HasMaxLength(36).IsRequired();
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.UserId).HasMaxLength(36).IsRequired();
            e.Property(x => x.Channel).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(x => new { x.RegulatoryChangeId, x.UserId }).IsUnique();
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.RegulatoryChange).WithMany().HasForeignKey(x => x.RegulatoryChangeId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // EuRegistrationProgress
        mb.Entity<EuRegistrationProgress>(e =>
        {
            e.ToTable("eu_registration_progress");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.Property(x => x.CountryCode).HasMaxLength(2).IsRequired();
            e.Property(x => x.SchemeName).HasMaxLength(200).IsRequired();
            e.Property(x => x.StepsData).HasColumnType("json");
            e.Property(x => x.RegistrationNumber).HasMaxLength(100);
            e.Property(x => x.RegistrationStatus).HasConversion<string>().HasMaxLength(30);
            e.Property(x => x.PortalUrl).HasMaxLength(500);
            e.Property(x => x.Notes).HasMaxLength(2000);
            e.HasIndex(x => new { x.PropertyId, x.CountryCode, x.SchemeName }).IsUnique();
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany().HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // AuLevyRecord
        mb.Entity<AuLevyRecord>(e =>
        {
            e.ToTable("au_levy_records");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.Property(x => x.StateCode).HasMaxLength(10).IsRequired();
            e.Property(x => x.LevyRatePct).HasColumnType("decimal(5,2)");
            e.Property(x => x.LodgementReference).HasMaxLength(200);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(x => new { x.PropertyId, x.Quarter, x.CalendarYear }).IsUnique();
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany().HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // AuFireSafetyRecord
        mb.Entity<AuFireSafetyRecord>(e =>
        {
            e.ToTable("au_fire_safety_records");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.Property(x => x.StateCode).HasMaxLength(10).IsRequired();
            e.Property(x => x.SmokeAlarmStandard).HasMaxLength(50);
            e.Property(x => x.FireExtinguisherType).HasMaxLength(50);
            e.Property(x => x.EvacuationDiagramLocation).HasMaxLength(200);
            e.Property(x => x.InspectionCertificateUrl).HasMaxLength(500);
            e.Property(x => x.Notes).HasMaxLength(2000);
            e.HasIndex(x => new { x.PropertyId, x.StateCode }).IsUnique();
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany().HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // AuComplaintLog
        mb.Entity<AuComplaintLog>(e =>
        {
            e.ToTable("au_complaint_log");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.Property(x => x.ComplaintSource).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.ComplaintDescription).HasMaxLength(2000);
            e.Property(x => x.ResponseNotes).HasMaxLength(2000);
            e.Property(x => x.ResolutionNotes).HasMaxLength(2000);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(x => x.OrganisationId);
            e.HasIndex(x => x.PropertyId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany().HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // UsTaxRecord
        mb.Entity<UsTaxRecord>(e =>
        {
            e.ToTable("us_tax_records");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(36);
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.PropertyId).HasMaxLength(36).IsRequired();
            e.Property(x => x.JurisdictionId).HasMaxLength(36).IsRequired();
            e.Property(x => x.TaxType).HasConversion<string>().HasMaxLength(30);
            e.Property(x => x.TaxRatePct).HasColumnType("decimal(5,2)");
            e.Property(x => x.FilingUrl).HasMaxLength(500);
            e.Property(x => x.FilingReference).HasMaxLength(200);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(x => new { x.PropertyId, x.TaxPeriodStart, x.TaxType }).IsUnique();
            e.HasIndex(x => x.OrganisationId);
            e.HasOne(x => x.Organisation).WithMany().HasForeignKey(x => x.OrganisationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Property).WithMany().HasForeignKey(x => x.PropertyId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Jurisdiction).WithMany().HasForeignKey(x => x.JurisdictionId).OnDelete(DeleteBehavior.Cascade);
            e.HasQueryFilter(x => _currentTenantId == null || x.OrganisationId == _currentTenantId);
        });

        // AuditLog (no tenant filter - system access)
        mb.Entity<AuditLog>(e =>
        {
            e.ToTable("audit_log");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).ValueGeneratedOnAdd();
            e.Property(x => x.OrganisationId).HasMaxLength(36).IsRequired();
            e.Property(x => x.UserId).HasMaxLength(36);
            e.Property(x => x.Action).HasMaxLength(100).IsRequired();
            e.Property(x => x.ResourceType).HasMaxLength(100).IsRequired();
            e.Property(x => x.ResourceId).HasMaxLength(36);
            e.Property(x => x.OldValues).HasColumnType("json");
            e.Property(x => x.NewValues).HasColumnType("json");
            e.Property(x => x.IpAddress).HasMaxLength(45);
            e.HasIndex(x => x.OrganisationId);
            e.HasIndex(x => x.CreatedAt);
            e.HasIndex(x => new { x.ResourceType, x.ResourceId });
        });

        // Cascade deletes are allowed in MySQL and match our SQL schema

    }
}