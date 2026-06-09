permitpal/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Build + test on every PR
│       ├── deploy-staging.yml
│       └── deploy-prod.yml
│
├── src/
│   ├── PermitPal.Api/                      # .NET 8 Web API
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── OrganisationsController.cs
│   │   │   ├── PropertiesController.cs
│   │   │   ├── JurisdictionsController.cs  # Postcode → ruleset resolver
│   │   │   ├── PermitsController.cs
│   │   │   ├── NightCapsController.cs
│   │   │   ├── DocumentsController.cs
│   │   │   ├── AlertsController.cs
│   │   │   ├── ReportsController.cs
│   │   │   ├── EU/
│   │   │   │   └── EuRegistrationController.cs  # Wizards per country
│   │   │   ├── AU/
│   │   │   │   ├── AuNswController.cs
│   │   │   │   ├── AuVictoriaController.cs      # Levy calculator + SRO report
│   │   │   │   ├── AuWaController.cs
│   │   │   │   ├── AuBrisbaneController.cs      # Complaint log + timer
│   │   │   │   └── AuFireSafetyController.cs
│   │   │   ├── US/
│   │   │   │   ├── UsCitiesController.cs        # City rules DB
│   │   │   │   ├── UsTaxController.cs           # TOT rates + filing
│   │   │   │   └── UsZoningController.cs        # GIS zoning check
│   │   │   └── Webhooks/
│   │   │       └── StripeWebhookController.cs
│   │   │
│   │   ├── Domain/
│   │   │   ├── Organisation.cs
│   │   │   ├── User.cs
│   │   │   ├── Country.cs
│   │   │   ├── StateRegion.cs
│   │   │   ├── Jurisdiction.cs             # Core — holds all rules per city/region
│   │   │   ├── JurisdictionPostcode.cs     # postcode → jurisdiction mapping
│   │   │   ├── RegulatoryChange.cs         # tracked changes to rules
│   │   │   ├── Property.cs
│   │   │   ├── Permit.cs
│   │   │   ├── NightCapRecord.cs
│   │   │   ├── BookedNight.cs
│   │   │   ├── ICalFeed.cs
│   │   │   ├── Document.cs
│   │   │   ├── AlertSubscription.cs
│   │   │   ├── NotificationLog.cs
│   │   │   ├── EuRegistrationProgress.cs
│   │   │   ├── AuLevyRecord.cs
│   │   │   ├── AuFireSafetyRecord.cs
│   │   │   ├── AuComplaintLog.cs
│   │   │   ├── UsTaxRecord.cs
│   │   │   └── AuditLog.cs
│   │   │
│   │   ├── DTOs/
│   │   │   ├── Properties/
│   │   │   │   ├── CreatePropertyRequest.cs
│   │   │   │   ├── PropertyResponse.cs
│   │   │   │   └── ComplianceProfileResponse.cs   # Full ruleset for a property
│   │   │   ├── Jurisdictions/
│   │   │   │   ├── JurisdictionLookupRequest.cs   # postcode + country
│   │   │   │   └── JurisdictionRulesetResponse.cs # full rules returned
│   │   │   ├── Permits/
│   │   │   │   ├── CreatePermitRequest.cs
│   │   │   │   └── PermitResponse.cs
│   │   │   ├── NightCaps/
│   │   │   │   ├── NightCapStatusResponse.cs
│   │   │   │   └── AddICalFeedRequest.cs
│   │   │   └── Reports/
│   │   │       ├── ComplianceReportRequest.cs
│   │   │       └── VicLevyReportRequest.cs
│   │   │
│   │   ├── Services/
│   │   │   ├── JurisdictionResolverService.cs     # Core: postcode → ruleset
│   │   │   ├── ComplianceScoreService.cs          # 0–100 score calculation
│   │   │   ├── ICalParserService.cs               # Parse .ics → booked nights
│   │   │   ├── NightCapService.cs                 # Count + alert logic
│   │   │   ├── TenantService.cs                   # organisation_id injection
│   │   │   ├── AuditService.cs
│   │   │   ├── PdfReportService.cs                # QuestPDF compliance reports
│   │   │   ├── StorageService.cs                  # R2 uploads/downloads
│   │   │   ├── EU/
│   │   │   │   ├── EuRegistrationWizardService.cs
│   │   │   │   └── EuRegNumberValidatorService.cs  # Validate against national registry
│   │   │   ├── AU/
│   │   │   │   ├── AuLevyCalculatorService.cs     # 7.5% VIC levy
│   │   │   │   └── AuSroReportService.cs          # Quarterly CSV for SRO lodgement
│   │   │   ├── US/
│   │   │   │   ├── UsZoningService.cs             # Google Maps GIS check
│   │   │   │   └── UsTotCalculatorService.cs
│   │   │   ├── Notifications/
│   │   │   │   ├── SmsService.cs                  # Twilio
│   │   │   │   └── EmailService.cs                # Resend
│   │   │   └── AI/
│   │   │       └── RegulatoryChangeService.cs     # Claude API summaries
│   │   │
│   │   ├── Infrastructure/
│   │   │   ├── Data/
│   │   │   │   ├── PermitPalDbContext.cs           # EF Core DbContext
│   │   │   │   ├── Configurations/
│   │   │   │   │   ├── JurisdictionConfiguration.cs
│   │   │   │   │   ├── PropertyConfiguration.cs
│   │   │   │   │   └── PermitConfiguration.cs
│   │   │   │   └── Migrations/
│   │   │   ├── BackgroundJobs/
│   │   │   │   ├── PermitRenewalAlertJob.cs        # Daily: check expiring permits
│   │   │   │   ├── NightCapAlertJob.cs             # Daily: check night-cap %
│   │   │   │   ├── ICalSyncJob.cs                  # Every 4h: sync all iCal feeds
│   │   │   │   ├── RegulatoryMonitorJob.cs         # Nightly: check for rule changes
│   │   │   │   ├── EuRegistrationCheckJob.cs       # Weekly: validate EU reg numbers
│   │   │   │   ├── ComplianceScoreJob.cs           # Nightly: recalculate all scores
│   │   │   │   └── VicLevyReminderJob.cs           # Quarterly: SRO lodgement reminder
│   │   │   └── ExternalClients/
│   │   │       ├── GoogleMapsClient.cs
│   │   │       ├── TwilioClient.cs
│   │   │       ├── ResendClient.cs
│   │   │       ├── StripeClient.cs
│   │   │       └── AnthropicClient.cs
│   │   │
│   │   ├── Middleware/
│   │   │   ├── TenantMiddleware.cs               # organisation_id global EF filter
│   │   │   └── ExceptionMiddleware.cs
│   │   │
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   └── PermitPal.Api.csproj
│   │
│   ├── PermitPal.Tests/                    # xUnit
│   │   ├── Unit/
│   │   │   ├── JurisdictionResolverTests.cs       # Core — test postcode → ruleset
│   │   │   ├── ComplianceScoreTests.cs
│   │   │   ├── ICalParserTests.cs                 # Test various .ics formats
│   │   │   ├── NightCapTests.cs
│   │   │   ├── AuLevyCalculatorTests.cs
│   │   │   └── EuRegValidatorTests.cs
│   │   ├── Integration/
│   │   │   ├── PropertiesControllerTests.cs
│   │   │   ├── PermitsControllerTests.cs
│   │   │   └── NightCapsControllerTests.cs
│   │   └── Fixtures/
│   │       ├── SampleICalFiles/            # Airbnb, VRBO, Booking .ics samples
│   │       └── SampleJurisdictions/        # Test jurisdiction rule sets
│   │
│   └── PermitPal.Worker/                   # Hangfire worker host
│       ├── Program.cs
│       └── PermitPal.Worker.csproj
│
├── frontend/                               # React 18 + Vite
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts                   # Axios + JWT interceptor
│   │   │   ├── properties.ts
│   │   │   ├── permits.ts
│   │   │   ├── nightCaps.ts
│   │   │   ├── jurisdictions.ts
│   │   │   └── eu.ts
│   │   ├── components/
│   │   │   ├── ui/                         # shadcn/ui components
│   │   │   ├── ComplianceScore/
│   │   │   │   ├── ScoreBadge.tsx          # Red/Amber/Green 0–100
│   │   │   │   └── ScoreBreakdown.tsx
│   │   │   ├── NightCap/
│   │   │   │   ├── NightCapBar.tsx         # Progress bar with alert thresholds
│   │   │   │   └── CalendarSync.tsx
│   │   │   ├── Permits/
│   │   │   │   ├── PermitCard.tsx
│   │   │   │   ├── RenewalAlert.tsx
│   │   │   │   └── DocumentVault.tsx
│   │   │   ├── EU/
│   │   │   │   ├── RegistrationWizard.tsx  # Step-by-step per country
│   │   │   │   └── RegNumberBadge.tsx
│   │   │   └── AU/
│   │   │       ├── LevyCalculator.tsx
│   │   │       ├── FireSafetyChecklist.tsx
│   │   │       └── ComplaintTimer.tsx      # 60-minute countdown
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/                  # Portfolio overview
│   │   │   ├── properties/
│   │   │   │   ├── [id]/                   # Property compliance profile
│   │   │   │   ├── [id]/permits/
│   │   │   │   ├── [id]/night-cap/
│   │   │   │   └── [id]/documents/
│   │   │   ├── eu-wizard/                  # EU registration wizard
│   │   │   ├── au/
│   │   │   │   ├── levy/
│   │   │   │   └── fire-safety/
│   │   │   ├── alerts/
│   │   │   └── settings/
│   │   ├── store/                          # Zustand
│   │   │   ├── authStore.ts
│   │   │   └── propertyStore.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── database/
│   ├── schema_mysql.sql                    # Full schema
│   ├── seeds/
│   │   ├── countries.sql                   # 12 countries seeded
│   │   ├── jurisdictions_au.sql            # NSW, VIC, WA, QLD, SA, TAS rules
│   │   ├── jurisdictions_eu.sql            # France, Spain, NL, DE, PT, IT, GR
│   │   ├── jurisdictions_us_top10.sql      # NYC, SF, Austin, Nashville, Miami…
│   │   └── postcodes_au.sql                # AU postcode → jurisdiction mapping
│   └── migrations/                         # EF Core migration files
│
├── docs/
│   ├── PRD.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── REGULATORY_DATA.md                  # How to update jurisdiction rules
│   ├── EU_COMPLIANCE.md                    # EU Reg 2024/1028 implementation guide
│   ├── AU_COMPLIANCE.md                    # AU state by state guide
│   ├── ICAL_PARSING.md                     # iCal format differences per platform
│   ├── SECURITY.md
│   └── DEPLOYMENT.md
│
├── infrastructure/
│   ├── docker-compose.yml                  # MySQL 8 + Redis + MailHog local dev
│   ├── Dockerfile.api
│   └── Dockerfile.worker
│
├── .env.example
├── permitpal.sln
└── README.md
