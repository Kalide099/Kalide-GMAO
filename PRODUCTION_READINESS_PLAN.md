# KGMAO Production Readiness Plan

## Scope
This plan covers the remaining non-ready areas and the concrete implementation path to enterprise-grade operation.

## What Was Implemented Now
- Central environment config and production validation for critical settings.
- Structured JSON logging with request IDs.
- Global and auth rate limiting with environment-controlled limits.
- Hardened CORS policy from environment settings.
- Health and readiness endpoints (`/health`, `/ready`).
- Graceful shutdown and database pool close handling.
- Tenant module middleware bug fix (`company_id` usage).
- Robust module JSON parsing in plan/module access gates.
- Password reset and logout security hardening with token-version session revocation.
- Auth audit log coverage for login, logout, reset request, and reset completion events.
- Runtime metrics endpoint (`/metrics`) with request counts, status distribution, and latency buckets.
- Release backup/rollback scripts for frontend dist recovery workflows.
- MFA enforcement support for privileged users (admin/super_admin) with backup codes.

## Deployment Notes
- Apply migration `backend/database/migrations/v5_auth_security_hardening.sql` before enabling new auth flows.
- Apply migration `backend/database/migrations/v6_mfa_security_hardening.sql` to enable MFA tables and fields.
- Set `PASSWORD_RESET_TOKEN_TTL_MINUTES` in production environment (default: 15).
- Set `JWT_SECRET`, database connection variables, explicit `CORS_ORIGIN`, `APP_VERSION`, and `BUILD_SHA` during CI/CD deployment; production startup rejects unsafe placeholders.
- Configure deployment workflow secrets: `KGMAO_SSH_HOST`, `KGMAO_SSH_USER`, `KGMAO_SSH_KEY`, `KGMAO_SSH_PASSPHRASE`, `KGMAO_SSH_PORT`, `KGMAO_DEPLOY_PATH`, and `KGMAO_GITHUB_TOKEN`.
- Rotate any old deployment passwords, tokens, or SSH credentials that were previously committed or shared before going live.

## MFA API Surface
- `POST /api/v1/auth/mfa/setup`
- `POST /api/v1/auth/mfa/verify`
- `POST /api/v1/auth/mfa/disable`
- `POST /api/v1/auth/mfa/backup-codes/regenerate`
- `GET /api/v1/auth/mfa/status`

## Remaining Workstreams

### 1. Identity and Access Hardening
- Add MFA for admin and super_admin roles.
- Add password reset token expiration and one-time use enforcement.
- Add session revocation list for compromised tokens.

### 2. Observability and Incident Operations
- Integrate centralized telemetry (APM + log aggregation).
- Add SLO dashboards (auth success rate, API latency, DB availability).
- Add alert routing and runbook links for each critical alert.

### 3. Data Protection and Compliance
- Encrypt sensitive fields at rest where required.
- Define retention and purge policy jobs per tenant.
- Add audit export endpoint for compliance evidence bundles.

### 4. Reliability and Scale
- Introduce background job queue for heavy/async tasks.
- Add idempotency keys for create/update write APIs.
- Add load testing baseline and capacity thresholds.

### 5. Delivery Governance
- Keep CI gates enabled for lint, build, dependency audit, and migration verification.
- Add deployment strategy (blue/green or canary).
- Add rollback SOP and one-click restore checklist.

## Acceptance Criteria Before Enterprise Rollout
1. No critical vulnerabilities open.
2. Zero unresolved P1 defects in core flows.
3. Monitoring coverage for all critical services.
4. Backup and restore drill passed.
5. DR failover simulation passed.
6. Security review signoff completed.
