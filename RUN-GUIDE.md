# PermitPal — Local Development Run Guide (Windows)

> **Project Location:** `D:\healthdesk saas\new saas healthdesk\permitpal\`

This guide explains how to run the PermitPal full-stack application locally on Windows. Choose the method that best fits your workflow.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Method 1: Docker (Easiest — Full Stack)](#method-1-docker-easiest--full-stack)
- [Method 2: Run Individually (Development Mode)](#method-2-run-individually-development-mode)
- [Method 3: Quick Start (Minimal)](#method-3-quick-start-minimal)
- [Troubleshooting](#troubleshooting)
- [Environment Variables Reference](#environment-variables-reference)

---

## Architecture Overview

| Component | Technology | Location |
|-----------|-----------|----------|
| **Backend API** | .NET 8 Web API (Clean Architecture) | `src/PermitPal.Api/` |
| **Worker** | Hangfire background jobs (.NET 8) | `src/PermitPal.Worker/` |
| **Frontend** | React 19 + Vite + TypeScript | `frontend/` |
| **Database** | MySQL 8.0 | Docker or local install |
| **Cache/Queue** | Redis 7 | Docker or local install |
| **File Storage** | Cloudflare R2 (S3-compatible) | Cloud service |

**Clean Architecture Layers:**
- `src/PermitPal.Domain/` — Entities, value objects, domain events
- `src/PermitPal.Application/` — Use cases, interfaces, DTOs
- `src/PermitPal.Infrastructure/` — EF Core, external services, repositories
- `src/PermitPal.Api/` — Controllers, middleware, DI configuration
- `src/PermitPal.Worker/` — Hangfire jobs (iCal sync, alerts, compliance scoring)

---

## Method 1: Docker (Easiest — Full Stack)

This method runs the entire stack with a single command.

### Prerequisites

- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) (with WSL 2 backend recommended)
- At least 4 GB RAM allocated to Docker

### Steps

**cmd.exe:**
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal"
docker-compose up --build
```

**PowerShell:**
```powershell
Set-Location "D:\healthdesk saas\new saas healthdesk\permitpal"
docker-compose up --build
```

> 💡 Add `-d` flag to run in detached (background) mode: `docker-compose up --build -d`

### What It Starts

| Service | Port | Description |
|---------|------|-------------|
| **MySQL 8** | `3306` | Database (auto-initialized with `scripts/init.sql`) |
| **Redis 7** | `6379` | Cache & Hangfire queue |
| **.NET API** | `5000` | Backend REST API |
| **Worker** | — | Background job processor (no exposed port) |
| **Frontend** | `3000` | React app (served via nginx) |

### Access URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Frontend application |
| http://localhost:5000/swagger | Swagger API documentation |
| http://localhost:5000/api | API base URL |

### Stop & Clean Up

```cmd
:: Stop all containers
docker-compose down

:: Stop and remove volumes (resets database)
docker-compose down -v
```

---

## Method 2: Run Individually (Development Mode)

Best for active development — gives you hot-reload on both frontend and backend.

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| .NET SDK | 8.0+ | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Node.js | 18+ (LTS recommended) | https://nodejs.org/ |
| npm | 9+ (comes with Node.js) | — |
| MySQL | 8.0 | https://dev.mysql.com/downloads/ or via Docker |
| Redis | 7+ | Via Docker (recommended on Windows) |

Verify installations:

```cmd
dotnet --version
node --version
npm --version
```

---

### Step 1: Database Setup (MySQL 8)

**Option A — Run MySQL via Docker (Recommended):**

```cmd
docker run -d ^
  --name permitpal-mysql ^
  -e MYSQL_ROOT_PASSWORD=root ^
  -e MYSQL_DATABASE=permitpal ^
  -e MYSQL_USER=permitpal ^
  -e MYSQL_PASSWORD=permitpal_local ^
  -p 3306:3306 ^
  -v permitpal-mysql-data:/var/lib/mysql ^
  mysql:8.0
```

**PowerShell:**
```powershell
docker run -d `
  --name permitpal-mysql `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=permitpal `
  -e MYSQL_USER=permitpal `
  -e MYSQL_PASSWORD=permitpal_local `
  -p 3306:3306 `
  -v permitpal-mysql-data:/var/lib/mysql `
  mysql:8.0
```

Wait ~15 seconds for MySQL to initialize, then run the schema script:

**cmd.exe:**
```cmd
docker exec -i permitpal-mysql mysql -u root -proot permitpal < "D:\healthdesk saas\new saas healthdesk\permitpal\scripts\init.sql"
```

**PowerShell:**
```powershell
Get-Content "D:\healthdesk saas\new saas healthdesk\permitpal\scripts\init.sql" | docker exec -i permitpal-mysql mysql -u root -proot permitpal
```

**Option B — Local MySQL Installation:**

1. Install MySQL 8.0 from https://dev.mysql.com/downloads/installer/
2. Create the database and user:
   ```sql
   CREATE DATABASE permitpal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'permitpal'@'localhost' IDENTIFIED BY 'permitpal_local';
   GRANT ALL PRIVILEGES ON permitpal.* TO 'permitpal'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Run the init script:
   ```cmd
   mysql -u root -p permitpal < "D:\healthdesk saas\new saas healthdesk\permitpal\scripts\init.sql"
   ```

---

### Step 2: Redis Setup

**Run Redis via Docker (Recommended for Windows):**

```cmd
docker run -d --name permitpal-redis -p 6379:6379 redis:7-alpine
```

Verify it's running:
```cmd
docker exec permitpal-redis redis-cli ping
```
Expected output: `PONG`

> ⚠️ Native Redis is not officially supported on Windows. Use Docker or [Memurai](https://www.memurai.com/) as an alternative.

---

### Step 3: Configure Environment

The `appsettings.Development.json` file in `src/PermitPal.Api/` should contain your local connection strings. A development-ready version is already provided with sensible defaults.

If you need to customize, edit:
```
D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Api\appsettings.Development.json
```

The base `appsettings.json` already contains default connection strings for local development:
- **MySQL:** `Server=localhost;Port=3306;Database=permitpal;User=permitpal;Password=permitpal_local`
- **Redis:** `localhost:6379`
- **JWT Secret:** Pre-configured for development (change in production!)

> 🔑 For third-party services (Stripe, Resend, Twilio, Cloudflare R2, Google Maps, Anthropic), you can leave the keys empty for initial development — the app will start but those features won't function.

---

### Step 4: Run Backend (.NET API)

**cmd.exe:**
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Api"
dotnet restore
dotnet run
```

**PowerShell:**
```powershell
Set-Location "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Api"
dotnet restore
dotnet run
```

**With hot-reload (recommended for development):**
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Api"
dotnet watch run
```

**Expected output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
      Now listening on: https://localhost:5001
```

**Access:**
| URL | Description |
|-----|-------------|
| http://localhost:5000 | HTTP API |
| https://localhost:5001 | HTTPS API |
| http://localhost:5000/swagger | Swagger UI (interactive API docs) |

> 💡 If you get an EF Core migration error, run:
> ```cmd
> dotnet ef database update --project "../PermitPal.Infrastructure" --startup-project "."
> ```
> (Requires `dotnet-ef` tool: `dotnet tool install --global dotnet-ef`)

---

### Step 5: Run Worker (Optional — for background jobs)

The Worker handles scheduled tasks: iCal feed syncing, permit expiry alerts, compliance score calculations, and regulatory change monitoring.

**cmd.exe (new terminal):**
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Worker"
dotnet restore
dotnet run
```

**PowerShell:**
```powershell
Set-Location "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Worker"
dotnet restore
dotnet run
```

> ℹ️ The Worker is optional for basic API/frontend development. You only need it if you're working on background job features.

---

### Step 6: Run Frontend (React + Vite)

**cmd.exe (new terminal):**
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\frontend"
npm install
npm run dev
```

**PowerShell:**
```powershell
Set-Location "D:\healthdesk saas\new saas healthdesk\permitpal\frontend"
npm install
npm run dev
```

**Expected output:**
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**Access:** http://localhost:5173

**Configure API URL:**

Create or edit `frontend/.env.local` (not committed to git):
```env
VITE_API_URL=http://localhost:5000/api
```

Or copy the example:
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\frontend"
copy .env.example .env.local
```

---

## Method 3: Quick Start (Minimal)

The fastest way to get up and running — uses Docker only for infrastructure services.

### 1. Start Infrastructure (MySQL + Redis)

```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal"
docker-compose up -d mysql redis
```

This starts only MySQL and Redis from the docker-compose file. MySQL will auto-initialize with `scripts/init.sql`.

### 2. Run Backend

```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Api"
dotnet run
```

### 3. Run Frontend

Open a **new terminal**:
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\frontend"
npm install
npm run dev
```

### Access

- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger

### Stop Infrastructure

```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal"
docker-compose down
```

---

## Troubleshooting

### Port Conflicts

**Problem:** `Address already in use` or `port is already allocated`

**Solution:** Check what's using the port:
```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :3306
netstat -ano | findstr :6379
netstat -ano | findstr :5173
```

Kill the process using the PID:
```cmd
taskkill /PID <PID> /F
```

Or change the port:
- **API:** Edit `Properties/launchSettings.json` in `src/PermitPal.Api/`
- **Frontend:** Run `npx vite --port 3001`
- **MySQL Docker:** Change `-p 3307:3306` and update connection string
- **Redis Docker:** Change `-p 6380:6379` and update config

---

### MySQL Connection Refused

**Problem:** `Unable to connect to any of the specified MySQL hosts`

**Checks:**
```cmd
:: Is MySQL container running?
docker ps | findstr mysql

:: Can you connect manually?
docker exec -it permitpal-mysql mysql -u permitpal -ppermitpal_local -e "SELECT 1"

:: Check container logs
docker logs permitpal-mysql
```

**Common fixes:**
- Wait 15-30 seconds after starting MySQL container (initialization takes time)
- Ensure port 3306 is not used by another MySQL instance
- Verify credentials match between `appsettings.json` and Docker environment variables

---

### CORS Errors in Browser

**Problem:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:** Ensure the `CORS_ALLOWED_ORIGINS` setting in `appsettings.json` includes your frontend URL:
```json
"CORS_ALLOWED_ORIGINS": "http://localhost:3000,http://localhost:5173"
```

---

### Redis Connection Failed

**Problem:** `It was not possible to connect to the redis server`

**Checks:**
```cmd
:: Is Redis container running?
docker ps | findstr redis

:: Test connection
docker exec permitpal-redis redis-cli ping
```

**Fix:** Start Redis container:
```cmd
docker start permitpal-redis
```

---

### EF Core Migration Errors

**Problem:** `The database does not exist` or `table doesn't exist`

**Solution:** Either run the init SQL script manually (see Step 1) or apply EF migrations:
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Api"
dotnet ef database update --project "../PermitPal.Infrastructure" --startup-project "."
```

---

### Frontend Build Errors

**Problem:** `Module not found` or TypeScript errors

**Solution:**
```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\frontend"
:: Clear node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

---

### How to Reset the Database

```cmd
:: Stop and remove MySQL container + volume
docker stop permitpal-mysql
docker rm permitpal-mysql
docker volume rm permitpal-mysql-data

:: Recreate
docker run -d ^
  --name permitpal-mysql ^
  -e MYSQL_ROOT_PASSWORD=root ^
  -e MYSQL_DATABASE=permitpal ^
  -e MYSQL_USER=permitpal ^
  -e MYSQL_PASSWORD=permitpal_local ^
  -p 3306:3306 ^
  -v permitpal-mysql-data:/var/lib/mysql ^
  mysql:8.0

:: Wait 15 seconds, then re-run init script
timeout /t 15
docker exec -i permitpal-mysql mysql -u root -proot permitpal < "D:\healthdesk saas\new saas healthdesk\permitpal\scripts\init.sql"
```

---

### How to Check if Services Are Running

```cmd
:: Check all Docker containers
docker ps

:: Check .NET API health
curl http://localhost:5000/swagger/index.html

:: Check frontend
curl http://localhost:5173

:: Check MySQL
docker exec permitpal-mysql mysqladmin ping -u root -proot

:: Check Redis
docker exec permitpal-redis redis-cli ping
```

---

## Environment Variables Reference

### Backend (`appsettings.json` / `appsettings.Development.json`)

| Key | Description | Default (Dev) |
|-----|-------------|---------------|
| `ConnectionStrings:DefaultConnection` | MySQL connection string | `Server=localhost;Port=3306;Database=permitpal;User=permitpal;Password=permitpal_local;...` |
| `Redis:ConnectionString` | Redis connection string | `localhost:6379` |
| `Jwt:SecretKey` | JWT signing secret (min 32 chars) | Pre-set dev key |
| `Jwt:Issuer` | JWT token issuer | `permitpal-api` |
| `Jwt:Audience` | JWT token audience | `permitpal-app` |
| `Jwt:AccessTokenExpiryMinutes` | Access token lifetime | `30` |
| `Jwt:RefreshTokenExpiryDays` | Refresh token lifetime | `30` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000,http://localhost:5173` |
| `Storage:R2:AccountId` | Cloudflare R2 account ID | _(empty — optional for dev)_ |
| `Storage:R2:AccessKeyId` | R2 access key | _(empty — optional for dev)_ |
| `Storage:R2:SecretAccessKey` | R2 secret key | _(empty — optional for dev)_ |
| `Storage:R2:BucketName` | R2 bucket name | `permitpal-documents` |
| `Storage:R2:PublicUrl` | Public URL for documents | `https://docs.permitpal.com` |
| `Stripe:SecretKey` | Stripe secret key (`sk_test_...`) | _(empty — optional for dev)_ |
| `Stripe:PublishableKey` | Stripe publishable key (`pk_test_...`) | _(empty — optional for dev)_ |
| `Stripe:WebhookSecret` | Stripe webhook signing secret | _(empty — optional for dev)_ |
| `Twilio:AccountSid` | Twilio account SID | _(empty — optional for dev)_ |
| `Twilio:AuthToken` | Twilio auth token | _(empty — optional for dev)_ |
| `Twilio:FromNumber` | Twilio sender phone number | _(empty — optional for dev)_ |
| `Resend:ApiKey` | Resend email API key | _(empty — optional for dev)_ |
| `Email:FromAddress` | Sender email address | `alerts@permitpal.com` |
| `Email:FromName` | Sender display name | `PermitPal` |
| `GoogleMaps:ApiKey` | Google Maps API key | _(empty — optional for dev)_ |
| `Anthropic:ApiKey` | Anthropic (Claude) API key | _(empty — optional for dev)_ |
| `Anthropic:Model` | Anthropic model to use | `claude-haiku-4-5-20251001` |

### Frontend (`frontend/.env` / `frontend/.env.local`)

| Key | Description | Default |
|-----|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application display name | `PermitPal` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

### Docker Compose Environment Variables

When using `docker-compose.yml`, environment variables are set inline in the compose file. Key differences from local development:
- MySQL host is `mysql` (Docker service name) instead of `localhost`
- Redis host is `redis` (Docker service name) instead of `localhost`

---

## Running Tests

```cmd
cd /d "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Tests"
dotnet test
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `docker-compose up --build` | Build and start all services |
| `docker-compose up -d mysql redis` | Start only infrastructure |
| `docker-compose down -v` | Stop all and delete volumes |
| `docker-compose logs -f api` | Follow API container logs |
| `dotnet watch run` | Run API with hot-reload |
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Lint frontend code |
| `dotnet ef migrations add <Name>` | Create new EF migration |
| `dotnet ef database update` | Apply pending migrations |

---

## Summary of Access URLs

| Service | Development (Individual) | Docker Compose |
|---------|-------------------------|----------------|
| Frontend | http://localhost:5173 | http://localhost:3000 |
| API (HTTP) | http://localhost:5000 | http://localhost:5000 |
| API (HTTPS) | https://localhost:5001 | — |
| Swagger UI | http://localhost:5000/swagger | http://localhost:5000/swagger |
| MySQL | localhost:3306 | localhost:3306 |
| Redis | localhost:6379 | localhost:6379 |
