using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PermitPal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialMySql : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "audit_log",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Action = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResourceType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResourceId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OldValues = table.Column<string>(type: "json", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NewValues = table.Column<string>(type: "json", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IpAddress = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_log", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "countries",
                columns: table => new
                {
                    Code = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Currency = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StrLegalStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NationalFrameworkUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_countries", x => x.Code);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "notification_log",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PermitId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AlertType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Channel = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Recipient = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Subject = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Body = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProviderMessageId = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SentAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ErrorMessage = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification_log", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "organisations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Slug = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Country = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Timezone = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubscriptionPlan = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubscriptionStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TrialEndsAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    StripeCustomerId = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StripeSubscriptionId = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MaxProperties = table.Column<int>(type: "int", nullable: false),
                    MaxTeamSeats = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organisations", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "states_regions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CountryCode = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Code = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HasStateRegistration = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    RegistrationUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RegistrationFeeCents = table.Column<int>(type: "int", nullable: true),
                    RegistrationRenewalFeeCents = table.Column<int>(type: "int", nullable: true),
                    RegistrationValidityMonths = table.Column<int>(type: "int", nullable: true),
                    NightCapDefault = table.Column<int>(type: "int", nullable: true),
                    NightCapHosted = table.Column<int>(type: "int", nullable: true),
                    LevyPct = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    LevyAuthority = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LevyReportUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_states_regions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_states_regions_countries_CountryCode",
                        column: x => x.CountryCode,
                        principalTable: "countries",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FirstName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    MfaEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    MfaSecret = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastLoginAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ResetToken = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResetTokenExpires = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    RefreshToken = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RefreshTokenExpires = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_users_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "jurisdictions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CountryCode = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StateRegionId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Slug = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    JurisdictionType = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PermitRequired = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PermitType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PermitDescription = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PermitFeeCents = table.Column<int>(type: "int", nullable: true),
                    PermitRenewalFeeCents = table.Column<int>(type: "int", nullable: true),
                    PermitValidityMonths = table.Column<int>(type: "int", nullable: true),
                    PermitPortalUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PermitNumberInListing = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    NightCapUnhosted = table.Column<int>(type: "int", nullable: true),
                    NightCapHosted = table.Column<int>(type: "int", nullable: true),
                    NightCapNotes = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PrimaryResidenceRequired = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PrimaryResidenceDays = table.Column<int>(type: "int", nullable: true),
                    ZoningRestrictions = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ZoningNotes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TotRatePct = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    TotName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TotPlatformCollects = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TotSelfRemitRequired = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TotFilingUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdditionalTaxes = table.Column<string>(type: "json", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EuRegistrationScheme = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EuRegistrationUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EuDataSharingActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AuStraRegisterRequired = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AuFireSafetyStandard = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AuContactPersonRequired = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AuComplaintResponseMinutes = table.Column<int>(type: "int", nullable: true),
                    FineMinCents = table.Column<int>(type: "int", nullable: true),
                    FineMaxCents = table.Column<int>(type: "int", nullable: true),
                    FineCurrency = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FineNotes = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EnforcementLevel = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LastVerifiedAt = table.Column<DateOnly>(type: "date", nullable: true),
                    NextReviewDate = table.Column<DateOnly>(type: "date", nullable: true),
                    VerifiedBy = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SourceUrls = table.Column<string>(type: "json", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jurisdictions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_jurisdictions_countries_CountryCode",
                        column: x => x.CountryCode,
                        principalTable: "countries",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_jurisdictions_states_regions_StateRegionId",
                        column: x => x.StateRegionId,
                        principalTable: "states_regions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "alert_subscriptions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    JurisdictionId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AlertType = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Channel = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alert_subscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_alert_subscriptions_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_alert_subscriptions_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "jurisdiction_postcodes",
                columns: table => new
                {
                    Postcode = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CountryCode = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    JurisdictionId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsPrimary = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jurisdiction_postcodes", x => new { x.Postcode, x.CountryCode, x.JurisdictionId });
                    table.ForeignKey(
                        name: "FK_jurisdiction_postcodes_countries_CountryCode",
                        column: x => x.CountryCode,
                        principalTable: "countries",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_jurisdiction_postcodes_jurisdictions_JurisdictionId",
                        column: x => x.JurisdictionId,
                        principalTable: "jurisdictions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "properties",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AddressLine1 = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AddressLine2 = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    City = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StateRegion = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Postcode = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CountryCode = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Lat = table.Column<decimal>(type: "decimal(10,7)", nullable: true),
                    Lng = table.Column<decimal>(type: "decimal(10,7)", nullable: true),
                    JurisdictionId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyType = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsPrimaryResidence = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    OwnerOccupied = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    HostedType = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AirbnbListingId = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AirbnbListingUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    VrboListingId = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BookingListingId = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ComplianceScore = table.Column<byte>(type: "tinyint unsigned", nullable: true),
                    ComplianceStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ScoreCalculatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Notes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_properties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_properties_jurisdictions_JurisdictionId",
                        column: x => x.JurisdictionId,
                        principalTable: "jurisdictions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_properties_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "regulatory_changes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    JurisdictionId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChangeType = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChangeSummary = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OldValue = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NewValue = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EffectiveDate = table.Column<DateOnly>(type: "date", nullable: true),
                    SourceUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AiSummary = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Severity = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_regulatory_changes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_regulatory_changes_jurisdictions_JurisdictionId",
                        column: x => x.JurisdictionId,
                        principalTable: "jurisdictions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "au_complaint_log",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ComplaintReceivedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ComplaintSource = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ComplaintDescription = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResponseRequiredBy = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    RespondedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ResponseNotes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResolvedBy = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ResolvedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ResolutionNotes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CouncilReportDue = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CouncilReportSent = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_au_complaint_log", x => x.Id);
                    table.ForeignKey(
                        name: "FK_au_complaint_log_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_au_complaint_log_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "au_fire_safety_records",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StateCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SmokeAlarmsInstalled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SmokeAlarmStandard = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SmokeAlarmTestDate = table.Column<DateOnly>(type: "date", nullable: true),
                    SmokeAlarmExpiryDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Interconnected = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Photoelectric = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FireExtinguisher = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FireExtinguisherType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FireExtinguisherTestDate = table.Column<DateOnly>(type: "date", nullable: true),
                    FireBlanket = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EvacuationDiagram = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EvacuationDiagramLocation = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastInspectionDate = table.Column<DateOnly>(type: "date", nullable: true),
                    InspectionCertificateUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NextInspectionDue = table.Column<DateOnly>(type: "date", nullable: true),
                    Notes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_au_fire_safety_records", x => x.Id);
                    table.ForeignKey(
                        name: "FK_au_fire_safety_records_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_au_fire_safety_records_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "au_levy_records",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StateCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Quarter = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    CalendarYear = table.Column<short>(type: "smallint", nullable: false),
                    TotalBookingsCents = table.Column<int>(type: "int", nullable: false),
                    LevyRatePct = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    LevyAmountCents = table.Column<int>(type: "int", nullable: false),
                    PlatformCollectedCents = table.Column<int>(type: "int", nullable: false),
                    ReportGeneratedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LodgedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LodgementReference = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_au_levy_records", x => x.Id);
                    table.ForeignKey(
                        name: "FK_au_levy_records_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_au_levy_records_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "booked_nights",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NightDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Source = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BookingRef = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ICalUid = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GuestCount = table.Column<byte>(type: "tinyint unsigned", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booked_nights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_booked_nights_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_booked_nights_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "eu_registration_progress",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CountryCode = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SchemeName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CurrentStep = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    TotalSteps = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    StepsData = table.Column<string>(type: "json", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RegistrationNumber = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RegistrationStatus = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubmittedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ExpiryDate = table.Column<DateOnly>(type: "date", nullable: true),
                    PortalUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_eu_registration_progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_eu_registration_progress_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_eu_registration_progress_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ical_feeds",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Platform = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ICalUrl = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastSyncedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastSyncStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastSyncError = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NightsImported = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ical_feeds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ical_feeds_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ical_feeds_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "night_cap_records",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CalendarYear = table.Column<short>(type: "smallint", nullable: false),
                    CapLimit = table.Column<int>(type: "int", nullable: true),
                    NightsUsed = table.Column<int>(type: "int", nullable: false),
                    Alerted80Pct = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Alerted90Pct = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Alerted100Pct = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LastSyncedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_night_cap_records", x => x.Id);
                    table.ForeignKey(
                        name: "FK_night_cap_records_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_night_cap_records_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "permits",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    JurisdictionId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PermitType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PermitNumber = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IssuingAuthority = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IssuedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ExpiryDate = table.Column<DateOnly>(type: "date", nullable: true),
                    RenewalFeeCents = table.Column<int>(type: "int", nullable: true),
                    RenewalUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AutoRenewed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DisplayInListing = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EuRegistrationNumber = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EuRegistrationCountry = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EuRegistrationValid = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    EuRegistrationCheckedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Alerted90d = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Alerted30d = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Alerted7d = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AlertedExpired = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Notes = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_permits_jurisdictions_JurisdictionId",
                        column: x => x.JurisdictionId,
                        principalTable: "jurisdictions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_permits_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_permits_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "us_tax_records",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    JurisdictionId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TaxPeriodStart = table.Column<DateOnly>(type: "date", nullable: false),
                    TaxPeriodEnd = table.Column<DateOnly>(type: "date", nullable: false),
                    TaxType = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TotalRevenueCents = table.Column<int>(type: "int", nullable: false),
                    PlatformRevenueCents = table.Column<int>(type: "int", nullable: false),
                    DirectRevenueCents = table.Column<int>(type: "int", nullable: false),
                    TaxRatePct = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    TaxOwedCents = table.Column<int>(type: "int", nullable: false),
                    PlatformRemittedCents = table.Column<int>(type: "int", nullable: false),
                    FilingUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FiledAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FilingReference = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_us_tax_records", x => x.Id);
                    table.ForeignKey(
                        name: "FK_us_tax_records_jurisdictions_JurisdictionId",
                        column: x => x.JurisdictionId,
                        principalTable: "jurisdictions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_us_tax_records_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_us_tax_records_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "regulatory_alert_log",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RegulatoryChangeId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SentAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Channel = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReadAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_regulatory_alert_log", x => x.Id);
                    table.ForeignKey(
                        name: "FK_regulatory_alert_log_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_regulatory_alert_log_regulatory_changes_RegulatoryChangeId",
                        column: x => x.RegulatoryChangeId,
                        principalTable: "regulatory_changes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "documents",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrganisationId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PropertyId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PermitId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DocumentType = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FileUrl = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FileSizeBytes = table.Column<int>(type: "int", nullable: true),
                    MimeType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiryDate = table.Column<DateOnly>(type: "date", nullable: true),
                    AlertedExpiry = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UploadedByUserId = table.Column<string>(type: "varchar(36)", maxLength: 36, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_documents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_documents_organisations_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "organisations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_documents_permits_PermitId",
                        column: x => x.PermitId,
                        principalTable: "permits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_documents_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_alert_subscriptions_OrganisationId",
                table: "alert_subscriptions",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_alert_subscriptions_UserId",
                table: "alert_subscriptions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_au_complaint_log_OrganisationId",
                table: "au_complaint_log",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_au_complaint_log_PropertyId",
                table: "au_complaint_log",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_au_fire_safety_records_OrganisationId",
                table: "au_fire_safety_records",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_au_fire_safety_records_PropertyId_StateCode",
                table: "au_fire_safety_records",
                columns: new[] { "PropertyId", "StateCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_au_levy_records_OrganisationId",
                table: "au_levy_records",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_au_levy_records_PropertyId_Quarter_CalendarYear",
                table: "au_levy_records",
                columns: new[] { "PropertyId", "Quarter", "CalendarYear" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_audit_log_CreatedAt",
                table: "audit_log",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_audit_log_OrganisationId",
                table: "audit_log",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_audit_log_ResourceType_ResourceId",
                table: "audit_log",
                columns: new[] { "ResourceType", "ResourceId" });

            migrationBuilder.CreateIndex(
                name: "IX_booked_nights_OrganisationId",
                table: "booked_nights",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_booked_nights_PropertyId_NightDate_Source",
                table: "booked_nights",
                columns: new[] { "PropertyId", "NightDate", "Source" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_documents_OrganisationId",
                table: "documents",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_documents_PermitId",
                table: "documents",
                column: "PermitId");

            migrationBuilder.CreateIndex(
                name: "IX_documents_PropertyId",
                table: "documents",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_eu_registration_progress_OrganisationId",
                table: "eu_registration_progress",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_eu_registration_progress_PropertyId_CountryCode_SchemeName",
                table: "eu_registration_progress",
                columns: new[] { "PropertyId", "CountryCode", "SchemeName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ical_feeds_OrganisationId",
                table: "ical_feeds",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_ical_feeds_PropertyId",
                table: "ical_feeds",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_jurisdiction_postcodes_CountryCode",
                table: "jurisdiction_postcodes",
                column: "CountryCode");

            migrationBuilder.CreateIndex(
                name: "IX_jurisdiction_postcodes_JurisdictionId",
                table: "jurisdiction_postcodes",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_jurisdiction_postcodes_Postcode_CountryCode",
                table: "jurisdiction_postcodes",
                columns: new[] { "Postcode", "CountryCode" });

            migrationBuilder.CreateIndex(
                name: "IX_jurisdictions_CountryCode",
                table: "jurisdictions",
                column: "CountryCode");

            migrationBuilder.CreateIndex(
                name: "IX_jurisdictions_Slug",
                table: "jurisdictions",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_jurisdictions_StateRegionId",
                table: "jurisdictions",
                column: "StateRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_night_cap_records_OrganisationId",
                table: "night_cap_records",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_night_cap_records_PropertyId_CalendarYear",
                table: "night_cap_records",
                columns: new[] { "PropertyId", "CalendarYear" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_notification_log_CreatedAt",
                table: "notification_log",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_notification_log_OrganisationId",
                table: "notification_log",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_organisations_Email",
                table: "organisations",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_organisations_Slug",
                table: "organisations",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_organisations_StripeCustomerId",
                table: "organisations",
                column: "StripeCustomerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_permits_ExpiryDate",
                table: "permits",
                column: "ExpiryDate");

            migrationBuilder.CreateIndex(
                name: "IX_permits_JurisdictionId",
                table: "permits",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_permits_OrganisationId",
                table: "permits",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_permits_PropertyId",
                table: "permits",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_properties_JurisdictionId",
                table: "properties",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_properties_OrganisationId",
                table: "properties",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_properties_Postcode_CountryCode",
                table: "properties",
                columns: new[] { "Postcode", "CountryCode" });

            migrationBuilder.CreateIndex(
                name: "IX_regulatory_alert_log_OrganisationId",
                table: "regulatory_alert_log",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_regulatory_alert_log_RegulatoryChangeId_UserId",
                table: "regulatory_alert_log",
                columns: new[] { "RegulatoryChangeId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_regulatory_changes_CreatedAt",
                table: "regulatory_changes",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_regulatory_changes_JurisdictionId",
                table: "regulatory_changes",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_states_regions_CountryCode_Code",
                table: "states_regions",
                columns: new[] { "CountryCode", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_us_tax_records_JurisdictionId",
                table: "us_tax_records",
                column: "JurisdictionId");

            migrationBuilder.CreateIndex(
                name: "IX_us_tax_records_OrganisationId",
                table: "us_tax_records",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_us_tax_records_PropertyId_TaxPeriodStart_TaxType",
                table: "us_tax_records",
                columns: new[] { "PropertyId", "TaxPeriodStart", "TaxType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_OrganisationId",
                table: "users",
                column: "OrganisationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alert_subscriptions");

            migrationBuilder.DropTable(
                name: "au_complaint_log");

            migrationBuilder.DropTable(
                name: "au_fire_safety_records");

            migrationBuilder.DropTable(
                name: "au_levy_records");

            migrationBuilder.DropTable(
                name: "audit_log");

            migrationBuilder.DropTable(
                name: "booked_nights");

            migrationBuilder.DropTable(
                name: "documents");

            migrationBuilder.DropTable(
                name: "eu_registration_progress");

            migrationBuilder.DropTable(
                name: "ical_feeds");

            migrationBuilder.DropTable(
                name: "jurisdiction_postcodes");

            migrationBuilder.DropTable(
                name: "night_cap_records");

            migrationBuilder.DropTable(
                name: "notification_log");

            migrationBuilder.DropTable(
                name: "regulatory_alert_log");

            migrationBuilder.DropTable(
                name: "us_tax_records");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "permits");

            migrationBuilder.DropTable(
                name: "regulatory_changes");

            migrationBuilder.DropTable(
                name: "properties");

            migrationBuilder.DropTable(
                name: "jurisdictions");

            migrationBuilder.DropTable(
                name: "organisations");

            migrationBuilder.DropTable(
                name: "states_regions");

            migrationBuilder.DropTable(
                name: "countries");
        }
    }
}
