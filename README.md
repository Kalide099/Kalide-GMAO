# KGMAO Multi-tenant Enterprise Backend

KGMAO is a scalable, state-of-the-art multi-tenant Maintenance Management System (GMAO) built for scalability across different industries.

## Tech Stack
- **Node.js** & **Express.js**
- **MySQL2** (with Connection Pooling)
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)
- **Joi** (Input Validation)

## Directory Structure
- `/src/config`: MySQL setup.
- `/src/middlewares`: Security (JWT logic), RBAC (`authorize`), Error Handling.
- `/src/routes`: Express Routers defining API endpoints.
- `/src/controllers`: Request/Response HTTP logic.
- `/src/services`: Core business logic interacting with DB securely.
- `/src/validations`: Input schemas mapping req.body to safely validated objects.
- `/database/schema.sql`: Contains the fully normalized Database architecture script natively built for Multi-Tenancy.

## Multi-Tenancy Security Approach
The database utilizes a **Shared Database / Shared Schema** multi-tenancy model. Every tenant-affiliated table features a `company_id` column.
The `src/middlewares/auth.middleware.js` automatically binds the `company_id` to `req.user`. Every model query mandates `WHERE company_id = ?` dynamically locking tenants to their native data.

## Getting Started

1. Set up Environment:
   ```bash
   cp .env.example .env
   # Update the database credentials properly
   ```

2. Initialize DB:
   Execute `database/schema.sql` into your target MySQL instance.

3. Install and Run:
   ```bash
   npm install
   npm run dev
   ```

## Production Readiness Commands

1. Run full quality gate (backend syntax + frontend lint + frontend build):
   ```bash
   npm run quality
   ```

2. Build deployment backup artifact:
   ```bash
   npm run release:backup
   ```

3. Rollback frontend dist from a known release archive:
   ```bash
   npm run release:rollback -- -ArchivePath releases/dist-YYYYMMDD-HHMMSS.zip
   ```

4. Backup database snapshot (requires `mysqldump` and DB env vars):
   ```bash
   npm run release:backup-db
   ```

5. Restore database snapshot:
   ```bash
   npm run release:restore-db -- -DumpPath releases/db-<name>-YYYYMMDD-HHMMSS.sql
   ```

6. Required migration for auth hardening:
   - Apply `backend/database/migrations/v5_auth_security_hardening.sql`
   - Apply `backend/database/migrations/v6_mfa_security_hardening.sql`

## Runtime Probes

- Health: `/health`
- Readiness: `/ready`
- Metrics: `/metrics`

Set `APP_VERSION` and `BUILD_SHA` in deployment environment so health/readiness payloads expose release metadata.

## Production Deployment Secrets

The GitHub Actions deployment workflow reads all remote access settings from repository secrets. Configure these before deploying from `main`:

- `KGMAO_SSH_HOST`
- `KGMAO_SSH_USER`
- `KGMAO_SSH_KEY`
- `KGMAO_SSH_PASSPHRASE`
- `KGMAO_SSH_PORT`
- `KGMAO_DEPLOY_PATH`
- `KGMAO_GITHUB_TOKEN`

Production environments must also set a strong `JWT_SECRET`, database connection variables, explicit `CORS_ORIGIN`, `APP_VERSION`, and `BUILD_SHA`. Rotate any deployment credentials that were ever committed or shared before relying on this workflow.

## Sample Endpoints Flow

1. **Register Admin/Company** (`POST /api/v1/auth/register`)
2. **Login Admin** (`POST /api/v1/auth/login`) -> Extract `token`
3. **Add Asset** (`POST /api/v1/assets`) -> With Bearer Token.
4. **Create Work Order** (`POST /api/v1/work-orders`) -> Maps out to specific `assetId`.

## Desktop App (Offline Tenant Deployment)

KGMAO can now be packaged as a Windows desktop application using Electron.

### What this desktop mode does
- Runs your existing backend locally inside the desktop process.
- Serves the built frontend from the local backend.
- Opens the app in a native desktop window.
- Works without internet access as long as tenant data services are local.

### Prerequisites
- Node.js installed on build machine.
- Local tenant database accessible from desktop app (default MySQL settings).

### Setup
1. Copy desktop env template:
   ```bash
   copy .env.desktop.example .env.desktop
   ```

2. Update local DB and JWT settings in `.env.desktop`.

For packaged installs, place the tenant-specific `.env.desktop` beside `KGMAO Desktop.exe`. The packaged build also includes `.env.desktop.example` under the Electron resources folder as a template.

### Run Desktop App Locally
```bash
npm run desktop:start
```

### Build Installer (Windows)
```bash
npm run desktop:dist
```

Installer output is generated in `desktop-dist/`.

### Notes for Offline Tenants
- The desktop shell is offline-capable, but operational data still depends on the configured local tenant database.
- For fully disconnected tenant deployments, provision a local database instance per tenant machine/site.
