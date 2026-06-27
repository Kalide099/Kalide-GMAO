const authService = require('../services/auth.service');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, mfaVerifySchema, mfaDisableSchema, mfaRegenerateBackupCodesSchema } = require('../validations/auth.validation');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { t } = require('../utils/i18n');
const { config } = require('../config/env');
const logger = require('../config/logger');
const { writeAuthAudit } = require('../utils/auditLogger');

const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const SSO_COLUMNS = {
    provider_name: "ALTER TABLE sso_configs ADD COLUMN provider_name VARCHAR(100) NOT NULL DEFAULT '' AFTER company_id",
    idp_entity_id: "ALTER TABLE sso_configs ADD COLUMN idp_entity_id VARCHAR(512) NOT NULL DEFAULT '' AFTER provider_name",
    sso_url: "ALTER TABLE sso_configs ADD COLUMN sso_url VARCHAR(512) NOT NULL DEFAULT '' AFTER idp_entity_id",
    public_certificate: "ALTER TABLE sso_configs ADD COLUMN public_certificate TEXT NULL AFTER sso_url",
    is_enabled: "ALTER TABLE sso_configs ADD COLUMN is_enabled BOOLEAN NOT NULL DEFAULT TRUE AFTER public_certificate",
    updated_at: "ALTER TABLE sso_configs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at"
};

const ensureSSOConfigSchema = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS sso_configs (
            id CHAR(36) PRIMARY KEY,
            company_id CHAR(36) NOT NULL,
            provider_name VARCHAR(100) NOT NULL DEFAULT '',
            idp_entity_id VARCHAR(512) NOT NULL DEFAULT '',
            sso_url VARCHAR(512) NOT NULL DEFAULT '',
            public_certificate TEXT NULL,
            is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_sso_company (company_id),
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
        )
    `);

    const [columns] = await pool.query(
        `SELECT column_name AS column_name
         FROM information_schema.columns
         WHERE table_schema = DATABASE()
           AND table_name = 'sso_configs'`
    );

    const existingColumns = new Set(columns.map((column) => column.column_name));
    for (const [columnName, alterSql] of Object.entries(SSO_COLUMNS)) {
        if (!existingColumns.has(columnName)) {
            try {
                await pool.query(alterSql);
            } catch (error) {
                if (error.code !== 'ER_DUP_FIELDNAME') {
                    throw error;
                }
            }
        }
    }

    const refreshedColumns = new Set([...existingColumns, ...Object.keys(SSO_COLUMNS)]);
    if (refreshedColumns.has('provider') || refreshedColumns.has('entry_point') || refreshedColumns.has('cert')) {
        await pool.query(`
            UPDATE sso_configs
            SET provider_name = COALESCE(NULLIF(provider_name, ''), provider, 'SAML'),
                sso_url = COALESCE(NULLIF(sso_url, ''), entry_point, ''),
                public_certificate = COALESCE(public_certificate, cert)
            WHERE (provider_name = '' OR sso_url = '' OR public_certificate IS NULL)
        `).catch((error) => {
            if (error.code !== 'ER_BAD_FIELD_ERROR') {
                throw error;
            }
        });
    }
};

const normalizeSSOConfigPayload = (body) => ({
    provider_name: String(body.provider_name || '').trim(),
    idp_entity_id: String(body.idp_entity_id || '').trim(),
    sso_url: String(body.sso_url || '').trim(),
    public_certificate: String(body.public_certificate || '').trim() || null
});

const isValidUrl = (value) => {
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'https:';
    } catch (_) {
        return false;
    }
};

exports.getSSOConfigs = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        await ensureSSOConfigSchema();
        const [rows] = await pool.query(
            `SELECT id, company_id, provider_name, idp_entity_id, sso_url, public_certificate, is_enabled, created_at, updated_at
             FROM sso_configs
             WHERE company_id = ?
             ORDER BY created_at DESC`,
            [req.user.company_id]
        );
        return successResponse(res, 200, t('auth.sso_retrieved', lang), rows);
    } catch (err) {
        next(err);
    }
};

exports.createSSOConfig = async (req, res, next) => {
    try {
        const id = uuidv4();
        const lang = req.lang || 'en';
        const payload = normalizeSSOConfigPayload(req.body);

        if (!payload.provider_name || !payload.idp_entity_id || !payload.sso_url) {
            return errorResponse(res, 400, 'Provider name, IDP entity ID, and SSO URL are required.');
        }

        if (!isValidUrl(payload.idp_entity_id) || !isValidUrl(payload.sso_url)) {
            return errorResponse(res, 400, 'IDP entity ID and SSO URL must be valid HTTPS URLs.');
        }

        await ensureSSOConfigSchema();

        try {
            await pool.query(
                `INSERT INTO sso_configs (id, company_id, provider_name, idp_entity_id, sso_url, public_certificate, is_enabled)
                 VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
                [id, req.user.company_id, payload.provider_name, payload.idp_entity_id, payload.sso_url, payload.public_certificate]
            );
        } catch (error) {
            if (error.code !== 'ER_DUP_ENTRY') {
                throw error;
            }

            await pool.query(
                `UPDATE sso_configs
                 SET provider_name = ?, idp_entity_id = ?, sso_url = ?, public_certificate = ?, is_enabled = TRUE
                 WHERE company_id = ?`,
                [payload.provider_name, payload.idp_entity_id, payload.sso_url, payload.public_certificate, req.user.company_id]
            );
        }

        return successResponse(res, 201, t('auth.sso_established', lang), { id, provider_name: payload.provider_name });
    } catch (err) {
        next(err);
    }
};

exports.deleteSSOConfig = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { id } = req.params;

        await ensureSSOConfigSchema();

        const [result] = await pool.query(
            'DELETE FROM sso_configs WHERE id = ? AND company_id = ?',
            [id, req.user.company_id]
        );

        if (result.affectedRows === 0) {
            return errorResponse(res, 404, t('errors.not_found', lang));
        }

        return successResponse(res, 200, t('common.delete_success', lang));
    } catch (err) {
        next(err);
    }
};

exports.register = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        const result = await authService.registerCompanyAndAdmin(value);
        return successResponse(res, 201, t('common.save_success', lang), result);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        // Enforce strict 4-second timeout to prevent Hostinger 503 HTML from taking over
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('DATABASE_TIMEOUT: Database unreachable or taking too long.')), 4000)
        );

        const result = await Promise.race([
            authService.loginUser(value.email, value.password, {
                mfaCode: value.mfaCode,
                backupCode: value.backupCode
            }),
            timeoutPromise
        ]);

        // Audit log is fire-and-forget — must never block or fail the login response
        writeAuthAudit({
            action: 'auth_login',
            entityId: result.user.id,
            companyId: result.user.companyId || null,
            userId: result.user.id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            email: value.email,
            outcome: 'success'
        }).catch(auditErr => logger.warn('Login audit log failed (non-blocking)', { error: auditErr }));

        return successResponse(res, 200, t('auth.login_success', lang), result);
    } catch (err) {
        logger.warn('Login failed', { error: err, email: req.body?.email });

        if (err.errorCode === 'MFA_REQUIRED') {
            return res.status(401).json({
                success: false,
                message: 'MFA verification required.',
                error_code: 'MFA_REQUIRED',
                data: { mfaRequired: true }
            });
        }

        if (err.errorCode === 'MFA_INVALID') {
            return res.status(401).json({
                success: false,
                message: 'Invalid MFA code.',
                error_code: 'MFA_INVALID'
            });
        }

        try {
            await writeAuthAudit({
                action: 'auth_login',
                entityId: null,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                email: req.body?.email || null,
                outcome: 'failed',
                reason: err.message
            });
        } catch (auditError) {
            logger.warn('Failed to write login audit', { error: auditError });
        }

        next(err);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = forgotPasswordSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        const result = await authService.issuePasswordReset(value.email, {
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        await writeAuthAudit({
            action: 'auth_password_reset_requested',
            entityId: result.userId,
            userId: result.userId,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            email: value.email,
            outcome: result.requested ? 'success' : 'accepted'
        });

        const payload = {};
        if (!config.isProd && result.token) {
            payload.resetToken = result.token;
        }

        return successResponse(
            res,
            200,
            t('auth.reset_link_sent', lang) || 'If the account exists, recovery instructions have been sent.',
            payload
        );
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = resetPasswordSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        const resetResult = await authService.resetPassword(value.token, value.password);

        await writeAuthAudit({
            action: 'auth_password_reset_completed',
            entityId: resetResult.userId,
            userId: resetResult.userId,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            outcome: 'success'
        });

        return successResponse(res, 200, t('auth.password_reset_success', lang) || 'Password reset successfully.');
    } catch (err) {
        try {
            await writeAuthAudit({
                action: 'auth_password_reset_completed',
                entityId: null,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                outcome: 'failed',
                reason: err.message
            });
        } catch (auditError) {
            logger.warn('Failed to write reset-password audit', { error: auditError });
        }

        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        await authService.revokeUserSessions(req.user.id);

        await writeAuthAudit({
            action: 'auth_logout',
            entityId: req.user.id,
            companyId: req.user.company_id || null,
            userId: req.user.id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            outcome: 'success'
        });

        return successResponse(res, 200, t('auth.logout_success', lang) || 'Logged out successfully.');
    } catch (err) {
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        // The user object is injected by the auth middleware
        return successResponse(res, 200, t('auth.profile_retrieved', lang), {
            user: req.user
        });
    } catch (err) {
        next(err);
    }
};

exports.setupMfa = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const result = await authService.createMfaSetup(req.user.id);

        await writeAuthAudit({
            action: 'auth_mfa_setup_initialized',
            entityId: req.user.id,
            companyId: req.user.company_id || null,
            userId: req.user.id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            outcome: 'success'
        });

        return successResponse(res, 200, t('auth.mfa_setup_initialized', lang) || 'MFA setup initialized.', result);
    } catch (err) {
        next(err);
    }
};

exports.verifyMfa = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = mfaVerifySchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        const result = await authService.verifyMfaSetup(req.user.id, value.code);

        await writeAuthAudit({
            action: 'auth_mfa_enabled',
            entityId: req.user.id,
            companyId: req.user.company_id || null,
            userId: req.user.id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            outcome: 'success'
        });

        return successResponse(res, 200, t('auth.mfa_enabled', lang) || 'MFA enabled successfully.', result);
    } catch (err) {
        next(err);
    }
};

exports.disableMfa = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = mfaDisableSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        await authService.disableMfa(req.user.id, value);

        await writeAuthAudit({
            action: 'auth_mfa_disabled',
            entityId: req.user.id,
            companyId: req.user.company_id || null,
            userId: req.user.id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            outcome: 'success'
        });

        return successResponse(res, 200, t('auth.mfa_disabled', lang) || 'MFA disabled successfully.');
    } catch (err) {
        next(err);
    }
};

exports.regenerateMfaBackupCodes = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = mfaRegenerateBackupCodesSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        const result = await authService.regenerateMfaBackupCodes(req.user.id, value.mfaCode);

        await writeAuthAudit({
            action: 'auth_mfa_backup_codes_regenerated',
            entityId: req.user.id,
            companyId: req.user.company_id || null,
            userId: req.user.id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            outcome: 'success'
        });

        return successResponse(res, 200, t('auth.mfa_backup_regenerated', lang) || 'MFA backup codes regenerated.', result);
    } catch (err) {
        next(err);
    }
};

exports.getMfaStatus = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const status = await authService.getMfaStatus(req.user.id);
        return successResponse(res, 200, t('auth.profile_retrieved', lang), status);
    } catch (err) {
        next(err);
    }
};
