using Microsoft.EntityFrameworkCore;
using PermitPal.Infrastructure.Persistence;

namespace PermitPal.Tests.Helpers;

/// <summary>
/// Creates an in-memory PermitPalDbContext for testing.
/// Uses a derived context that skips relational-only configuration (ToTable, etc.)
/// which is incompatible with the InMemory provider.
/// </summary>
public static class TestDbContextFactory
{
    /// <summary>
    /// Creates a fresh in-memory database context for each test.
    /// </summary>
    public static PermitPalDbContext Create(string? tenantId = null)
    {
        var options = new DbContextOptionsBuilder<PermitPalDbContext>()
            .UseInMemoryDatabase(databaseName: $"PermitPalTest_{Guid.NewGuid()}")
            .ConfigureWarnings(w => w.Ignore(
                Microsoft.EntityFrameworkCore.Diagnostics.InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        var context = new TestPermitPalDbContext(options);

        if (tenantId != null)
        {
            context.SetTenantId(tenantId);
        }

        context.Database.EnsureCreated();

        // Seed basic test data
        SeedTestData(context);

        return context;
    }

    private static void SeedTestData(PermitPalDbContext context)
    {
        var org = TestData.TestOrganisation();
        context.Organisations.Add(org);

        var user = TestData.TestUser();
        context.Users.Add(user);

        var jurisdiction = TestData.TestJurisdiction();
        context.Jurisdictions.Add(jurisdiction);

        context.SaveChanges();
    }
}

/// <summary>
/// A test-specific DbContext that overrides OnModelCreating to skip relational-only
/// configuration (ToTable, HasColumnType, etc.) that is incompatible with InMemory provider.
/// </summary>
public class TestPermitPalDbContext : PermitPalDbContext
{
    public TestPermitPalDbContext(DbContextOptions<PermitPalDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // Skip the base OnModelCreating which uses ToTable() and other relational extensions.
        // Instead, just configure the entity keys and relationships needed for InMemory testing.
        ConfigureEntitiesForInMemory(mb);
    }

    private static void ConfigureEntitiesForInMemory(ModelBuilder mb)
    {
        // Organisation
        mb.Entity<Domain.Entities.Organisation>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // User
        mb.Entity<Domain.Entities.User>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Organisation)
                .WithMany(o => o.Users)
                .HasForeignKey(x => x.OrganisationId);
        });

        // Country
        mb.Entity<Domain.Entities.Country>(e =>
        {
            e.HasKey(x => x.Code);
        });

        // StateRegion
        mb.Entity<Domain.Entities.StateRegion>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // Jurisdiction
        mb.Entity<Domain.Entities.Jurisdiction>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.StateRegion)
                .WithMany()
                .HasForeignKey(x => x.StateRegionId);
        });

        // JurisdictionPostcode
        mb.Entity<Domain.Entities.JurisdictionPostcode>(e =>
        {
            e.HasKey(x => new { x.Postcode, x.CountryCode, x.JurisdictionId });
            e.HasOne(x => x.Jurisdiction)
                .WithMany()
                .HasForeignKey(x => x.JurisdictionId);
        });

        // RegulatoryChange
        mb.Entity<Domain.Entities.RegulatoryChange>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // Property
        mb.Entity<Domain.Entities.Property>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Organisation)
                .WithMany()
                .HasForeignKey(x => x.OrganisationId);
            e.HasOne(x => x.Jurisdiction)
                .WithMany()
                .HasForeignKey(x => x.JurisdictionId);
        });

        // Permit
        mb.Entity<Domain.Entities.Permit>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Property)
                .WithMany(p => p.Permits)
                .HasForeignKey(x => x.PropertyId);
        });

        // NightCapRecord
        mb.Entity<Domain.Entities.NightCapRecord>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Property)
                .WithMany()
                .HasForeignKey(x => x.PropertyId);
        });

        // BookedNight
        mb.Entity<Domain.Entities.BookedNight>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Property)
                .WithMany()
                .HasForeignKey(x => x.PropertyId);
        });

        // ICalFeed
        mb.Entity<Domain.Entities.ICalFeed>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Property)
                .WithMany()
                .HasForeignKey(x => x.PropertyId);
        });

        // Document
        mb.Entity<Domain.Entities.Document>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // AlertSubscription
        mb.Entity<Domain.Entities.AlertSubscription>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // NotificationLog
        mb.Entity<Domain.Entities.NotificationLog>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // RegulatoryAlertLog
        mb.Entity<Domain.Entities.RegulatoryAlertLog>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // EuRegistrationProgress
        mb.Entity<Domain.Entities.EuRegistrationProgress>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Property)
                .WithMany()
                .HasForeignKey(x => x.PropertyId);
        });

        // AuLevyRecord
        mb.Entity<Domain.Entities.AuLevyRecord>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // AuFireSafetyRecord
        mb.Entity<Domain.Entities.AuFireSafetyRecord>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // AuComplaintLog
        mb.Entity<Domain.Entities.AuComplaintLog>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // UsTaxRecord
        mb.Entity<Domain.Entities.UsTaxRecord>(e =>
        {
            e.HasKey(x => x.Id);
        });

        // AuditLog
        mb.Entity<Domain.Entities.AuditLog>(e =>
        {
            e.HasKey(x => x.Id);
        });
    }
}
