# PermitPal

**Short-Term Rental Compliance Platform** — Helping hosts, property managers, and operators stay compliant with local regulations across the US, EU, and Australia.

[![CI/CD](https://github.com/your-org/permitpal/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/permitpal/actions/workflows/ci.yml)

---

## Overview

PermitPal is a multi-tenant SaaS platform that automates short-term rental (STR) compliance management. It tracks permits, night caps, regulatory changes, tax obligations, and fire safety requirements across multiple jurisdictions.

### Key Features

- **Jurisdiction Database** — Comprehensive regulatory data for cities/counties across US, EU, and Australia
- **Permit Tracking** — Monitor permit status, expiry dates, and renewal deadlines with automated alerts
- **Night Cap Monitoring** — iCal sync from Airbnb/VRBO/Booking.com with automatic night counting
- **Regulatory Change Alerts** — Real-time notifications when local laws change
- **EU Registration Wizard** — Step-by-step guidance for EU country registration schemes
- **AU Fire Safety Compliance** — Track smoke alarms, extinguishers, and inspection schedules
- **US Tax/TOT Tracking** — Calculate and track transient occupancy tax obligations
- **Document Vault** — Secure storage for permits, certificates, and inspection reports
- **Compliance Score** — Real-time compliance scoring per property
- **Multi-Property Management** — Manage portfolios with team collaboration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend API** | .NET 8, ASP.NET Core, MediatR, FluentValidation |
| **Database** | MySQL 8.0 |
| **Cache/Queue** | Redis 7 |
| **Background Jobs** | Hangfire |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Object Storage** | Cloudflare R2 (S3-compatible) |
| **Email** | Resend |
| **SMS** | Twilio |
| **Payments** | Stripe |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |

---

## Project Structure

```
permitpal/
├── src/
│   ├── PermitPal.Api/          # ASP.NET Core Web API
│   ├── PermitPal.Application/  # CQRS commands/queries, services
│   ├── PermitPal.Domain/       # Domain entities, enums, interfaces
│   ├── PermitPal.Infrastructure/ # EF Core, external services
│   ├── PermitPal.Worker/       # Hangfire background job host
│   └── PermitPal.Tests/        # Unit & integration tests
├── frontend/                   # React SPA (Vite + TypeScript)
├── scripts/
│   └── init.sql               # MySQL schema (22 tables)
├── .github/workflows/
│   └── ci.yml                 # CI/CD pipeline
├── Dockerfile                 # API container
├── Dockerfile.worker          # Worker container
├── docker-compose.yml         # Development stack
├── docker-compose.prod.yml    # Production overrides
└── .env.example               # Environment variable template
```

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/permitpal.git
cd permitpal

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker compose up -d

# 4. Access the application
#    Frontend: http://localhost:3000
#    API:      http://localhost:5000
#    Swagger:  http://localhost:5000/swagger
```

### Local Development

#### Backend

```bash
cd src

# Restore packages
dotnet restore

# Run the API (with hot reload)
dotnet watch run --project PermitPal.Api

# Run the Worker
dotnet run --project PermitPal.Worker

# Run tests
dotnet test
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

---

## Environment Variables

See [`.env.example`](.env.example) for all required configuration. Key sections:

| Category | Variables |
|----------|-----------|
| Database | `ConnectionStrings__DefaultConnection` |
| Redis | `Redis__ConnectionString` |
| JWT Auth | `Jwt__Secret`, `Jwt__Issuer`, `Jwt__Audience` |
| Storage | `Storage__Endpoint`, `Storage__AccessKey`, `Storage__SecretKey` |
| Email | `Email__ApiKey`, `Email__FromAddress` |
| SMS | `Sms__AccountSid`, `Sms__AuthToken` |
| Stripe | `Stripe__SecretKey`, `Stripe__WebhookSecret` |

---

## Database

The MySQL schema is defined in [`scripts/init.sql`](scripts/init.sql) with 22 tables:

1. `organisations` — Multi-tenant organisations
2. `users` — Authentication & team members
3. `countries` — Supported countries with STR legal status
4. `state_regions` — States/provinces with registration requirements
5. `jurisdictions` — Cities/counties with detailed regulatory rules
6. `jurisdiction_postcodes` — Postcode-to-jurisdiction mapping
7. `regulatory_changes` — Tracked changes in regulations
8. `properties` — Rental properties
9. `permits` — Permit records with expiry tracking
10. `night_cap_records` — Annual night cap tracking
11. `booked_nights` — Individual booked nights from iCal sync
12. `ical_feeds` — iCal feed configurations
13. `documents` — Uploaded documents/certificates
14. `alert_subscriptions` — User notification preferences
15. `notification_logs` — Sent notification history
16. `regulatory_alert_logs` — Regulatory change alert delivery
17. `eu_registration_progress` — EU registration wizard state
18. `au_levy_records` — Australian state levy calculations
19. `au_fire_safety_records` — AU fire safety compliance
20. `au_complaint_logs` — AU complaint management
21. `us_tax_records` — US TOT/tax filing records
22. `audit_logs` — System audit trail

---

## Background Jobs

The Hangfire worker processes these recurring jobs:

| Job | Schedule | Description |
|-----|----------|-------------|
| `ICalSyncJob` | Every 4 hours | Syncs iCal feeds and updates booked nights |
| `PermitExpiryCheckJob` | Daily | Checks for expiring permits and sends alerts |
| `NightCapAlertJob` | Daily | Monitors night cap usage thresholds |
| `ComplianceScoreJob` | Daily | Recalculates compliance scores |
| `RegulatoryChangeCheckJob` | Daily | Checks for regulatory updates |

---

## API Documentation

When running locally, Swagger UI is available at:
- **Development**: http://localhost:5000/swagger

---

## Deployment

### Docker Compose (Production)

```bash
# Build and deploy with production overrides
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) handles:

1. **Backend** — Restore, build, and test .NET projects
2. **Frontend** — Install, lint, and build React app
3. **Docker** — Build and push images to GitHub Container Registry (on `main` branch)

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Nginx     │────▶│   .NET API  │
│   (React)   │     │   (Proxy)   │     │   (Port 5000)│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                    ┌───────────────────────────┼───────────────┐
                    │                           │               │
              ┌─────▼─────┐             ┌──────▼──────┐  ┌─────▼─────┐
              │   MySQL   │             │    Redis    │  │  Worker   │
              │   (Data)  │             │  (Cache/Q)  │  │ (Hangfire)│
              └───────────┘             └─────────────┘  └───────────┘
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Proprietary — All rights reserved.
