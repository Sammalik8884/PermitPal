# PermitPal — Complete Project File Map

> Auto-generated reference of every source file in the PermitPal monorepo.
> Excludes `bin/`, `obj/`, `node_modules/`, and `dist/` build artifacts.

---

## Root Files

| File | Description |
|------|-------------|
| `.dockerignore` | Files/dirs excluded from Docker build context |
| `.env.example` | Template for environment variables (secrets, DB strings, API keys) |
| `.gitignore` | Git ignore rules for the monorepo |
| `docker-compose.yml` | Local dev Docker Compose (API, Worker, Postgres, Redis) |
| `docker-compose.prod.yml` | Production Docker Compose overrides |
| `Dockerfile` | Multi-stage Dockerfile for the .NET API |
| `Dockerfile.worker` | Dockerfile for the background Worker service |
| `permitpal.slnx` | .NET solution file linking all backend projects |
| `README.md` | Project overview and setup instructions |

---

## `.github/`

| File | Description |
|------|-------------|
| `.github/workflows/ci.yml` | GitHub Actions CI pipeline (build, test, lint, deploy) |

---

## `scripts/`

| File | Description |
|------|-------------|
| `scripts/init.sql` | Database initialisation SQL (schema bootstrap / seed data) |

---

## `src/PermitPal.Api/` — ASP.NET Core Web API

| File | Description |
|------|-------------|
| `Program.cs` | Application entry point; DI registration, middleware pipeline |
| `WeatherForecast.cs` | Scaffold sample model (can be removed) |
| `PermitPal.Api.csproj` | Project file with NuGet dependencies |
| `PermitPal.Api.http` | HTTP request samples for manual testing |
| `appsettings.json` | Base configuration (connection strings, JWT settings) |
| `appsettings.Development.json` | Development-specific config overrides |
| `Properties/launchSettings.json` | Kestrel/IIS Express launch profiles |

### Controllers

| File | Description |
|------|-------------|
| `Controllers/BaseController.cs` | Abstract base with shared helpers (tenant, user context) |
| `Controllers/AlertsController.cs` | CRUD + preferences for alert subscriptions |
| `Controllers/AuComplianceController.cs` | Australian compliance endpoints (levies, fire safety) |
| `Controllers/AuthController.cs` | Register, login, refresh, password reset |
| `Controllers/BillingController.cs` | Subscription plans, invoices, Stripe webhooks |
| `Controllers/DocumentsController.cs` | Upload, list, download permit documents |
| `Controllers/EuRegistrationController.cs` | EU STR registration wizard endpoints |
| `Controllers/ICalFeedsController.cs` | iCal feed CRUD and sync trigger |
| `Controllers/JurisdictionsController.cs` | Jurisdiction lookup and search |
| `Controllers/NightCapsController.cs` | Night-cap tracking and calendar data |
| `Controllers/NotificationsController.cs` | In-app notification list and mark-read |
| `Controllers/PermitsController.cs` | Permit lifecycle CRUD |
| `Controllers/PropertiesController.cs` | Property CRUD with compliance scores |
| `Controllers/UsTaxController.cs` | US occupancy tax record endpoints |
| `Controllers/WeatherForecastController.cs` | Scaffold sample controller (can be removed) |

### Middleware

| File | Description |
|------|-------------|
| `Middleware/ExceptionMiddleware.cs` | Global exception handler → ProblemDetails JSON |
| `Middleware/TenantMiddleware.cs` | Resolves tenant (organisation) from JWT claims |

### Services

| File | Description |
|------|-------------|
| `Services/CurrentUserService.cs` | Extracts authenticated user info from HttpContext |
| `Services/TenantContext.cs` | Scoped tenant state for the current request |

---

## `src/PermitPal.Application/` — Application Layer (CQRS / Use Cases)

| File | Description |
|------|-------------|
| `DependencyInjection.cs` | Registers MediatR, FluentValidation, AutoMapper |
| `PermitPal.Application.csproj` | Project file with package references |

### DTOs

| File | Description |
|------|-------------|
| `DTOs/AuCompliance/AuComplianceDTOs.cs` | Request/response models for AU compliance |
| `DTOs/Auth/AuthDTOs.cs` | Login, register, token response DTOs |
| `DTOs/Billing/BillingDTOs.cs` | Plan, invoice, subscription DTOs |
| `DTOs/EuRegistration/EuRegistrationDTOs.cs` | EU registration wizard step DTOs |
| `DTOs/Jurisdictions/JurisdictionDTOs.cs` | Jurisdiction search/detail DTOs |
| `DTOs/NightCaps/NightCapDTOs.cs` | Night-cap record and summary DTOs |
| `DTOs/Permits/PermitDTOs.cs` | Permit CRUD DTOs |
| `DTOs/Properties/PropertyDTOs.cs` | Property create/update/list DTOs |
| `DTOs/UsTax/UsTaxDTOs.cs` | US tax record DTOs |

### Interfaces

| File | Description |
|------|-------------|
| `Interfaces/IApplicationDbContext.cs` | EF Core DbContext abstraction |
| `Interfaces/IAuComplianceService.cs` | AU compliance business logic contract |
| `Interfaces/IAuditService.cs` | Audit trail logging contract |
| `Interfaces/IAuthService.cs` | Authentication/authorization contract |
| `Interfaces/IBillingService.cs` | Billing/subscription management contract |
| `Interfaces/IComplianceScoreService.cs` | Compliance score calculation contract |
| `Interfaces/ICurrentUserService.cs` | Current user accessor contract |
| `Interfaces/IEmailService.cs` | Transactional email sending contract |
| `Interfaces/IEuRegistrationService.cs` | EU registration workflow contract |
| `Interfaces/IICalParserService.cs` | iCal feed parsing contract |
| `Interfaces/IJurisdictionResolverService.cs` | Postcode → jurisdiction resolution contract |
| `Interfaces/INightCapService.cs` | Night-cap tracking business logic contract |
| `Interfaces/INotificationService.cs` | Push/in-app notification contract |
| `Interfaces/ISmsService.cs` | SMS sending contract |
| `Interfaces/IStorageService.cs` | File/blob storage contract (S3) |
| `Interfaces/IUsTaxService.cs` | US tax calculation contract |

---

## `src/PermitPal.Domain/` — Domain Layer (Entities & Enums)

| File | Description |
|------|-------------|
| `PermitPal.Domain.csproj` | Project file (no external dependencies) |

### Entities

| File | Description |
|------|-------------|
| `Entities/AlertSubscription.cs` | User alert channel + jurisdiction preferences |
| `Entities/AuFireSafetyRecord.cs` | Australian fire safety compliance record |
| `Entities/AuLevyRecord.cs` | Australian short-stay levy payment record |
| `Entities/BookedNight.cs` | Single booked night linked to a property |
| `Entities/Country.cs` | Country reference entity |
| `Entities/Document.cs` | Uploaded document metadata (S3 key, type) |
| `Entities/EuRegistrationProgress.cs` | EU STR registration wizard progress tracker |
| `Entities/ICalFeed.cs` | iCal feed URL + sync state per property |
| `Entities/Jurisdiction.cs` | Regulatory jurisdiction (city/county/state rules) |
| `Entities/JurisdictionPostcode.cs` | Postcode ↔ jurisdiction mapping |
| `Entities/NightCapRecord.cs` | Monthly night-cap summary per property |
| `Entities/NotificationLog.cs` | Sent notification audit record |
| `Entities/Organisation.cs` | Multi-tenant organisation (top-level tenant) |
| `Entities/Permit.cs` | Permit with type, status, expiry, jurisdiction |
| `Entities/Property.cs` | Short-term rental property with address + compliance |
| `Entities/RegulatoryAlertLog.cs` | Log of regulatory change alerts sent |
| `Entities/RegulatoryChange.cs` | Tracked regulatory change for a jurisdiction |
| `Entities/StateRegion.cs` | State/region within a country |
| `Entities/User.cs` | Application user (belongs to organisation) |
| `Entities/UsTaxRecord.cs` | US occupancy tax record |

### Enums

| File | Description |
|------|-------------|
| `Enums/Enums.cs` | Shared enumerations (PermitStatus, Role, AlertChannel, etc.) |

### Interfaces

| File | Description |
|------|-------------|
| `Interfaces/IRepository.cs` | Generic repository pattern interface |
| `Interfaces/IUnitOfWork.cs` | Unit of Work pattern interface |

---

## `src/PermitPal.Infrastructure/` — Infrastructure Layer (EF Core, External Services)

| File | Description |
|------|-------------|
| `DependencyInjection.cs` | Registers DbContext, services, external clients |
| `PermitPal.Infrastructure.csproj` | Project file (EF Core, AWS SDK, Hangfire, etc.) |

### Persistence

| File | Description |
|------|-------------|
| `Persistence/PermitPalDbContext.cs` | EF Core DbContext with entity configurations |

### Services

| File | Description |
|------|-------------|
| `Services/AuComplianceService.cs` | AU levy + fire safety business logic |
| `Services/AuditService.cs` | Audit trail persistence |
| `Services/AuthService.cs` | JWT generation, password hashing, token refresh |
| `Services/BillingService.cs` | Stripe integration for subscriptions |
| `Services/ComplianceScoreService.cs` | Calculates per-property compliance percentage |
| `Services/EmailService.cs` | SMTP / SES transactional email sender |
| `Services/EuRegistrationService.cs` | EU STR registration step logic |
| `Services/ICalParserService.cs` | Parses iCal feeds into BookedNight records |
| `Services/JurisdictionResolverService.cs` | Resolves postcode to jurisdiction |
| `Services/NightCapService.cs` | Night-cap aggregation and threshold checks |
| `Services/NotificationService.cs` | In-app + push notification dispatch |
| `Services/SmsService.cs` | SMS sending via Twilio/SNS |
| `Services/StorageService.cs` | AWS S3 file upload/download |
| `Services/UsTaxService.cs` | US occupancy tax calculations |

---

## `src/PermitPal.Worker/` — Background Job Service (Hangfire)

| File | Description |
|------|-------------|
| `Program.cs` | Worker host entry point; Hangfire server config |
| `PermitPal.Worker.csproj` | Project file with Hangfire + shared project refs |
| `appsettings.json` | Base configuration for the worker |
| `appsettings.Development.json` | Dev config overrides |
| `Properties/launchSettings.json` | Launch profiles for local debugging |

### Jobs

| File | Description |
|------|-------------|
| `Jobs/ComplianceScoreJob.cs` | Recalculates compliance scores on schedule |
| `Jobs/ICalSyncJob.cs` | Fetches and syncs iCal feeds for all properties |
| `Jobs/NightCapAlertJob.cs` | Sends alerts when night-cap thresholds approached |
| `Jobs/PermitExpiryCheckJob.cs` | Checks for expiring permits and notifies owners |
| `Jobs/RegulatoryChangeCheckJob.cs` | Polls for new regulatory changes and alerts subscribers |

---

## `src/PermitPal.Tests/` — Unit & Integration Tests

| File | Description |
|------|-------------|
| `UnitTest1.cs` | Scaffold placeholder test |
| `PermitPal.Tests.csproj` | Test project (xUnit, Moq, EF InMemory) |

### Controllers

| File | Description |
|------|-------------|
| `Controllers/AuthControllerTests.cs` | Auth endpoint integration tests |
| `Controllers/PropertiesControllerTests.cs` | Properties endpoint integration tests |

### Helpers

| File | Description |
|------|-------------|
| `Helpers/TestData.cs` | Shared test fixture data builders |
| `Helpers/TestDbContextFactory.cs` | In-memory DbContext factory for tests |

### Services

| File | Description |
|------|-------------|
| `Services/AuthServiceTests.cs` | AuthService unit tests |
| `Services/ComplianceScoreServiceTests.cs` | Compliance score calculation tests |
| `Services/EuRegistrationServiceTests.cs` | EU registration workflow tests |
| `Services/ICalParserServiceTests.cs` | iCal parsing logic tests |
| `Services/JurisdictionResolverServiceTests.cs` | Jurisdiction resolution tests |
| `Services/NightCapServiceTests.cs` | Night-cap service tests |

---

## `frontend/` — React + Vite SPA

### Root Config

| File | Description |
|------|-------------|
| `frontend/.env` | Local environment variables (API URL) |
| `frontend/.env.example` | Template for frontend env vars |
| `frontend/.gitignore` | Frontend-specific git ignores |
| `frontend/Dockerfile` | Multi-stage Docker build for the SPA |
| `frontend/eslint.config.js` | ESLint flat config (React, TypeScript) |
| `frontend/index.html` | Vite HTML entry point |
| `frontend/nginx.conf` | Nginx config for serving the SPA in production |
| `frontend/package.json` | NPM dependencies and scripts |
| `frontend/package-lock.json` | Lockfile for reproducible installs |
| `frontend/README.md` | Frontend-specific readme |
| `frontend/tsconfig.json` | Base TypeScript config |
| `frontend/tsconfig.app.json` | App-specific TS config (extends base) |
| `frontend/tsconfig.node.json` | Node/Vite TS config |
| `frontend/vite.config.ts` | Vite build configuration (proxy, aliases) |

### `frontend/src/` — Source Code

| File | Description |
|------|-------------|
| `src/App.tsx` | Root component with router and providers |
| `src/main.tsx` | Vite entry; renders App into DOM |
| `src/index.css` | Global Tailwind CSS imports and base styles |
| `src/vite-env.d.ts` | Vite client type declarations |

### Assets

| File | Description |
|------|-------------|
| `src/assets/hero.png` | Landing/hero image |
| `src/assets/react.svg` | React logo SVG |
| `src/assets/vite.svg` | Vite logo SVG |

### Components — Shared UI

| File | Description |
|------|-------------|
| `src/components/error-boundary.tsx` | React error boundary wrapper |
| `src/components/password-strength.tsx` | Password strength indicator |
| `src/components/ui/alert.tsx` | Alert/banner component |
| `src/components/ui/avatar.tsx` | User avatar component |
| `src/components/ui/badge.tsx` | Status badge component |
| `src/components/ui/button.tsx` | Button variants (primary, outline, ghost) |
| `src/components/ui/card.tsx` | Card container component |
| `src/components/ui/checkbox.tsx` | Checkbox input component |
| `src/components/ui/dialog.tsx` | Modal dialog component |
| `src/components/ui/dropdown-menu.tsx` | Dropdown menu component |
| `src/components/ui/empty-state.tsx` | Empty state placeholder |
| `src/components/ui/input.tsx` | Text input component |
| `src/components/ui/label.tsx` | Form label component |
| `src/components/ui/loading-spinner.tsx` | Loading spinner animation |
| `src/components/ui/page-header.tsx` | Page title + breadcrumb header |
| `src/components/ui/progress.tsx` | Progress bar component |
| `src/components/ui/scroll-area.tsx` | Custom scrollable area |
| `src/components/ui/select.tsx` | Select dropdown component |
| `src/components/ui/separator.tsx` | Visual separator/divider |
| `src/components/ui/sheet.tsx` | Slide-over sheet panel |
| `src/components/ui/skeleton.tsx` | Loading skeleton placeholder |
| `src/components/ui/stat-card.tsx` | Dashboard statistic card |
| `src/components/ui/status-badge.tsx` | Permit/compliance status badge |
| `src/components/ui/switch.tsx` | Toggle switch component |
| `src/components/ui/table.tsx` | Data table component |
| `src/components/ui/tabs.tsx` | Tab navigation component |
| `src/components/ui/textarea.tsx` | Multi-line text input |
| `src/components/ui/tooltip.tsx` | Tooltip hover component |

### Hooks

| File | Description |
|------|-------------|
| `src/hooks/use-alerts.ts` | Alert subscriptions and notifications data hook |
| `src/hooks/use-au-compliance.ts` | AU compliance data fetching hook |
| `src/hooks/use-billing.ts` | Billing/subscription state hook |
| `src/hooks/use-dashboard-data.ts` | Dashboard aggregated data hook |
| `src/hooks/use-debounce.ts` | Input debounce utility hook |
| `src/hooks/use-documents.ts` | Document CRUD operations hook |
| `src/hooks/use-eu-registration.ts` | EU registration wizard state hook |
| `src/hooks/use-local-storage.ts` | LocalStorage persistence hook |
| `src/hooks/use-media-query.ts` | Responsive breakpoint detection hook |
| `src/hooks/use-night-caps.ts` | Night-cap data and calendar hook |
| `src/hooks/use-permits.ts` | Permit CRUD operations hook |
| `src/hooks/use-properties.ts` | Property CRUD operations hook |
| `src/hooks/use-settings.ts` | User/org settings hook |
| `src/hooks/use-toast.ts` | Toast notification trigger hook |
| `src/hooks/use-us-tax.ts` | US tax records hook |

### Layouts

| File | Description |
|------|-------------|
| `src/layouts/AuthLayout.tsx` | Unauthenticated pages layout (login, register) |
| `src/layouts/DashboardLayout.tsx` | Authenticated dashboard shell (sidebar, topbar) |

### Lib

| File | Description |
|------|-------------|
| `src/lib/api.ts` | Axios instance with interceptors (auth, refresh) |
| `src/lib/utils.ts` | Shared utility functions (cn, formatDate, etc.) |

### Stores (Zustand)

| File | Description |
|------|-------------|
| `src/stores/auth-store.ts` | Authentication state (user, tokens, login/logout) |
| `src/stores/sidebar-store.ts` | Sidebar open/collapsed state |
| `src/stores/theme-store.ts` | Light/dark theme preference |

### Types

| File | Description |
|------|-------------|
| `src/types/index.ts` | Shared TypeScript interfaces and type definitions |

### Pages

#### Auth

| File | Description |
|------|-------------|
| `src/pages/auth/login.tsx` | Login page with email/password form |
| `src/pages/auth/register.tsx` | Registration page with org creation |
| `src/pages/auth/forgot-password.tsx` | Forgot password email request page |
| `src/pages/auth/reset-password.tsx` | Password reset form (from email link) |

#### Dashboard

| File | Description |
|------|-------------|
| `src/pages/dashboard.tsx` | Dashboard page (stats, charts, activity) |
| `src/pages/dashboard/compliance-chart.tsx` | Compliance score donut/bar chart |
| `src/pages/dashboard/night-cap-bars.tsx` | Night-cap usage bar chart |
| `src/pages/dashboard/properties-at-risk.tsx` | Properties approaching non-compliance list |
| `src/pages/dashboard/recent-activity.tsx` | Recent activity feed |
| `src/pages/dashboard/upcoming-deadlines.tsx` | Upcoming permit deadlines widget |

#### Properties

| File | Description |
|------|-------------|
| `src/pages/properties/index.tsx` | Property list page (table + cards) |
| `src/pages/properties/[id].tsx` | Single property detail page |
| `src/pages/properties/components/compliance-breakdown.tsx` | Per-property compliance breakdown panel |
| `src/pages/properties/components/delete-property-dialog.tsx` | Confirm delete property dialog |
| `src/pages/properties/components/property-card.tsx` | Property summary card |
| `src/pages/properties/components/property-form-dialog.tsx` | Add/edit property form dialog |
| `src/pages/properties/components/property-table.tsx` | Properties data table |

#### Permits

| File | Description |
|------|-------------|
| `src/pages/permits.tsx` | Permits list page |
| `src/pages/permits/components/permit-detail-sheet.tsx` | Permit detail slide-over sheet |
| `src/pages/permits/components/permit-form-dialog.tsx` | Add/edit permit form dialog |
| `src/pages/permits/components/permit-status-timeline.tsx` | Permit status change timeline |

#### Night Caps

| File | Description |
|------|-------------|
| `src/pages/night-caps.tsx` | Night-cap tracking overview page |
| `src/pages/night-caps/components/add-feed-dialog.tsx` | Add iCal feed dialog |
| `src/pages/night-caps/components/add-nights-dialog.tsx` | Manually add booked nights dialog |
| `src/pages/night-caps/components/booking-calendar.tsx` | Calendar view of booked nights |
| `src/pages/night-caps/components/feed-list.tsx` | List of connected iCal feeds |
| `src/pages/night-caps/components/feed-preview.tsx` | Preview parsed feed events |
| `src/pages/night-caps/components/monthly-chart.tsx` | Monthly night usage chart |
| `src/pages/night-caps/components/night-cap-card.tsx` | Night-cap summary card per property |

#### Documents

| File | Description |
|------|-------------|
| `src/pages/documents.tsx` | Documents vault page |
| `src/pages/documents/components/document-card.tsx` | Document thumbnail card |
| `src/pages/documents/components/document-preview-dialog.tsx` | Document preview modal |
| `src/pages/documents/components/upload-dialog.tsx` | File upload dialog |

#### Alerts

| File | Description |
|------|-------------|
| `src/pages/alerts.tsx` | Alerts & notifications page |
| `src/pages/alerts/components/alert-preferences-form.tsx` | Alert channel preferences form |
| `src/pages/alerts/components/notification-item.tsx` | Single notification list item |
| `src/pages/alerts/components/regulatory-change-card.tsx` | Regulatory change alert card |

#### EU Registration

| File | Description |
|------|-------------|
| `src/pages/eu-registration/index.tsx` | EU registration overview (all properties) |
| `src/pages/eu-registration/[propertyId].tsx` | EU registration wizard for a property |
| `src/pages/eu-registration/components/registration-stepper.tsx` | Multi-step progress stepper |
| `src/pages/eu-registration/components/requirements-panel.tsx` | Jurisdiction requirements info panel |
| `src/pages/eu-registration/components/step-content.tsx` | Dynamic step content renderer |

#### AU Compliance

| File | Description |
|------|-------------|
| `src/pages/au-compliance/index.tsx` | Australian compliance dashboard |
| `src/pages/au-compliance/components/complaint-dialog.tsx` | Log complaint dialog |
| `src/pages/au-compliance/components/complaints-table.tsx` | Complaints history table |
| `src/pages/au-compliance/components/fire-safety-checklist.tsx` | Fire safety checklist component |
| `src/pages/au-compliance/components/fire-safety-edit-dialog.tsx` | Edit fire safety record dialog |
| `src/pages/au-compliance/components/levy-payment-dialog.tsx` | Record levy payment dialog |
| `src/pages/au-compliance/components/levy-summary.tsx` | Levy payment summary card |

#### US Tax

| File | Description |
|------|-------------|
| `src/pages/us-tax/index.tsx` | US occupancy tax tracking page |

#### Billing

| File | Description |
|------|-------------|
| `src/pages/billing.tsx` | Billing & subscription page |
| `src/pages/billing/components/current-plan-card.tsx` | Current plan details card |

#### Settings

| File | Description |
|------|-------------|
| `src/pages/settings.tsx` | Settings page (tabs layout) |
| `src/pages/settings/components/appearance-form.tsx` | Theme/appearance preferences form |
| `src/pages/settings/components/invite-member-dialog.tsx` | Invite team member dialog |
| `src/pages/settings/components/organisation-form.tsx` | Organisation details form |
| `src/pages/settings/components/profile-form.tsx` | User profile edit form |
| `src/pages/settings/components/security-form.tsx` | Password change / 2FA form |
| `src/pages/settings/components/team-members-list.tsx` | Team members list with roles |

---

## `permitpal helping file/` — Reference & Planning Documents

| File | Description |
|------|-------------|
| `files.zip` | Archived reference files |
| `healthdesk_icp_and_acquisition.html` | ICP and acquisition strategy doc |
| `permitpal_.env.example` | Reference env template |
| `permitpal_ci.yml` | Reference CI pipeline config |
| `permitpal_docker-compose.yml` | Reference Docker Compose |
| `permitpal_full_product_spec.html` | Full product specification document |
| `permitpal_PRD.md` | Product Requirements Document |
| `permitpal_project_structure.md` | Planned project structure reference |
| `permitpal_roadmap.xlsx` | Product roadmap spreadsheet |
| `permitpal_schema_mysql.sql` | Reference MySQL schema (migrated to Postgres) |

---

## Summary Statistics

| Layer | File Count |
|-------|-----------|
| Root config | 9 |
| CI/CD (`.github`) | 1 |
| Scripts | 1 |
| Backend API (`PermitPal.Api`) | 19 |
| Application Layer | 28 |
| Domain Layer | 24 |
| Infrastructure Layer | 16 |
| Worker Service | 10 |
| Tests | 10 |
| Frontend (config) | 14 |
| Frontend (source) | ~100 |
| Reference docs | 10 |
| **Total source files** | **~242** |
