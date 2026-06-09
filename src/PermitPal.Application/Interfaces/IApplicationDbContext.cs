using Microsoft.EntityFrameworkCore;
using PermitPal.Domain.Entities;

namespace PermitPal.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Organisation> Organisations { get; }
    DbSet<User> Users { get; }
    DbSet<Country> Countries { get; }
    DbSet<StateRegion> StatesRegions { get; }
    DbSet<Jurisdiction> Jurisdictions { get; }
    DbSet<JurisdictionPostcode> JurisdictionPostcodes { get; }
    DbSet<RegulatoryChange> RegulatoryChanges { get; }
    DbSet<Property> Properties { get; }
    DbSet<Permit> Permits { get; }
    DbSet<NightCapRecord> NightCapRecords { get; }
    DbSet<BookedNight> BookedNights { get; }
    DbSet<ICalFeed> ICalFeeds { get; }
    DbSet<Document> Documents { get; }
    DbSet<AlertSubscription> AlertSubscriptions { get; }
    DbSet<NotificationLog> NotificationLogs { get; }
    DbSet<RegulatoryAlertLog> RegulatoryAlertLogs { get; }
    DbSet<EuRegistrationProgress> EuRegistrationProgress { get; }
    DbSet<AuLevyRecord> AuLevyRecords { get; }
    DbSet<AuFireSafetyRecord> AuFireSafetyRecords { get; }
    DbSet<AuComplaintLog> AuComplaintLogs { get; }
    DbSet<UsTaxRecord> UsTaxRecords { get; }
    DbSet<AuditLog> AuditLogs { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    void SetTenantId(string tenantId);
}
