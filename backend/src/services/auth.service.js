const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { config, getEnv } = require('../config/env');
const logger = require('../config/logger');

const JWT_SECRET = getEnv('JWT_SECRET', 'kgmao_development_secret_321');
const JWT_EXPIRES_IN = getEnv('JWT_EXPIRES_IN', '24h');

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const MFA_ENFORCED_ROLES = new Set(['admin', 'super_admin']);

const normalizeBackupCode = (code) => String(code || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

const isMissingCompanyDefaultLanguageColumn = (error) => (
    error &&
    error.code === 'ER_BAD_FIELD_ERROR' &&
    String(error.sqlMessage || '').toLowerCase().includes('default_language')
);

const isMissingUserPreferredLanguageColumn = (error) => (
    error &&
    error.code === 'ER_BAD_FIELD_ERROR' &&
    String(error.sqlMessage || '').toLowerCase().includes('preferred_language')
);

const isMissingPasswordResetTokensTable = (error) => (
    error &&
    error.code === 'ER_NO_SUCH_TABLE' &&
    String(error.sqlMessage || '').toLowerCase().includes('password_reset_tokens')
);

const generateBackupCodes = (count) => {
    const size = Math.max(1, Number(count || 10));
    return Array.from({ length: size }, () => crypto.randomBytes(4).toString('hex').toUpperCase());
};

const getUserForMfa = async (userId) => {
    const [users] = await pool.query(
        `SELECT id, email, role, company_id, status, deleted_at, mfa_enabled, mfa_secret, mfa_temp_secret
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [userId]
    );

    if (users.length === 0) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    const user = users[0];
    if (user.status !== 'active' || user.deleted_at !== null) {
        const err = new Error('Account is inactive or suspended.');
        err.statusCode = 401;
        throw err;
    }

    if (!MFA_ENFORCED_ROLES.has(user.role)) {
        const err = new Error('MFA is restricted to privileged roles.');
        err.statusCode = 403;
        throw err;
    }

    return user;
};

const storeBackupCodes = async (connection, userId, backupCodes) => {
    await connection.query('DELETE FROM mfa_backup_codes WHERE user_id = ?', [userId]);

    for (const code of backupCodes) {
        const hash = await bcrypt.hash(code, 10);
        await connection.query(
            'INSERT INTO mfa_backup_codes (id, user_id, code_hash) VALUES (?, ?, ?)',
            [uuidv4(), userId, hash]
        );
    }
};

const consumeBackupCode = async (connection, userId, backupCode) => {
    const normalized = normalizeBackupCode(backupCode);
    if (!normalized) return false;

    const [rows] = await connection.query(
        'SELECT id, code_hash FROM mfa_backup_codes WHERE user_id = ? AND used_at IS NULL',
        [userId]
    );

    for (const row of rows) {
        const matched = await bcrypt.compare(normalized, row.code_hash);
        if (matched) {
            await connection.query('UPDATE mfa_backup_codes SET used_at = NOW() WHERE id = ?', [row.id]);
            return true;
        }
    }

    return false;
};

exports.registerCompanyAndAdmin = async (data) => {
    const { firstName, lastName, email, password, companyName, industry, preferredLanguage } = data;
    
    // Start transaction since we'll insert into multiple tables
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Check if user already exists
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            const err = new Error('Email is already registered');
            err.statusCode = 409;
            err.isOperational = true;
            throw err;
        }

        const companyId = uuidv4();
        const userId = uuidv4();

        // 2. Create Company
        try {
            await connection.query(
                'INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, plan, default_language) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [companyId, companyName, companyName, industry, industry, 'active', 'basic', preferredLanguage || 'en']
            );
        } catch (error) {
            if (!isMissingCompanyDefaultLanguageColumn(error)) {
                throw error;
            }

            await connection.query(
                'INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, plan) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [companyId, companyName, companyName, industry, industry, 'active', 'basic']
            );
        }

        // 3. Hash password and Create User (Admin of the company)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        try {
            await connection.query(
                'INSERT INTO users (id, company_id, first_name, last_name, email, password_hash, role, preferred_language) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, companyId, firstName, lastName, email, passwordHash, 'admin', preferredLanguage || 'en']
            );
        } catch (error) {
            if (!isMissingUserPreferredLanguageColumn(error)) {
                throw error;
            }

            await connection.query(
                'INSERT INTO users (id, company_id, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, companyId, firstName, lastName, email, passwordHash, 'admin']
            );
        }

        await connection.commit();
        
        return {
            userId,
            companyId,
            role: 'admin'
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.loginUser = async (email, password, mfaOptions = {}) => {
    let users;
    try {
        [users] = await pool.query(`
            SELECT u.*, c.industry_en as industry, c.enabled_modules, c.plan, c.default_language as company_default_language
            FROM users u 
            LEFT JOIN companies c ON u.company_id = c.id 
            WHERE u.email = ?
        `, [email]);
    } catch (error) {
        if (!isMissingCompanyDefaultLanguageColumn(error)) {
            throw error;
        }

        [users] = await pool.query(`
            SELECT u.*, c.industry_en as industry, c.enabled_modules, c.plan, NULL as company_default_language
            FROM users u 
            LEFT JOIN companies c ON u.company_id = c.id 
            WHERE u.email = ?
        `, [email]);
    }
    
    if (users.length === 0) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const user = users[0];

    if (user.status !== 'active' || user.deleted_at !== null) {
        const err = new Error('Account is inactive or suspended.');
        err.statusCode = 401;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const requiresMfa = config.mfaEnforcementEnabled && MFA_ENFORCED_ROLES.has(user.role) && Boolean(user.mfa_enabled);
    if (requiresMfa) {
        const mfaCode = String(mfaOptions.mfaCode || '').trim();
        const backupCode = String(mfaOptions.backupCode || '').trim();

        if (!mfaCode && !backupCode) {
            const err = new Error('MFA verification required.');
            err.statusCode = 401;
            err.errorCode = 'MFA_REQUIRED';
            throw err;
        }

        let mfaValid = false;
        if (mfaCode) {
            mfaValid = speakeasy.totp.verify({
                secret: user.mfa_secret,
                encoding: 'base32',
                token: mfaCode,
                window: 1
            });
        }

        if (!mfaValid && backupCode) {
            const connection = await pool.getConnection();
            try {
                mfaValid = await consumeBackupCode(connection, user.id, backupCode);
            } finally {
                connection.release();
            }
        }

        if (!mfaValid) {
            const err = new Error('Invalid MFA code.');
            err.statusCode = 401;
            err.errorCode = 'MFA_INVALID';
            throw err;
        }
    }

    // Parse enabled_modules if it exists
    let enabledModules = [];
    try {
        enabledModules = typeof user.enabled_modules === 'string' 
            ? JSON.parse(user.enabled_modules) 
            : (user.enabled_modules || []);
    } catch (e) {
        console.error("Failed to parse modules for user", user.id);
    }

    const tokenVersion = Number(user.token_version || 0);

    // Generate JWT Token
    const payload = {
        id: user.id,
        company_id: user.company_id,
        role: user.role,
        industry: user.industry,
        plan: user.plan || 'enterprise', // Default for system admins
        enabled_modules: enabledModules,
        preferred_language: user.preferred_language || user.company_default_language || 'en',
        mfa_enabled: Boolean(user.mfa_enabled),
        token_version: tokenVersion
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            companyId: user.company_id,
            industry: user.industry,
            preferredLanguage: user.preferred_language || user.company_default_language || 'en',
            mfaEnabled: Boolean(user.mfa_enabled)
        }
    };
};

exports.issuePasswordReset = async (email, requestMeta = {}) => {
    const [users] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND deleted_at IS NULL AND status = "active" LIMIT 1',
        [email]
    );

    if (users.length === 0) {
        return { requested: false, userId: null };
    }

    const user = users[0];
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + config.passwordResetTokenTtlMinutes * 60 * 1000);

    try {
        await pool.query(
            'UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL',
            [user.id]
        );

        await pool.query(
            `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, requested_ip, requested_user_agent)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                user.id,
                tokenHash,
                expiresAt,
                requestMeta.ip || null,
                requestMeta.userAgent || null
            ]
        );
    } catch (error) {
        if (!isMissingPasswordResetTokensTable(error)) {
            throw error;
        }

        logger.warn('password_reset_tokens table not found; returning generic reset response', { error });
        return { requested: false, userId: user.id };
    }

    return {
        requested: true,
        userId: user.id,
        token: rawToken
    };
};

exports.resetPassword = async (token, newPassword) => {
    const tokenHash = hashResetToken(token);
    let tokens;
    try {
        [tokens] = await pool.query(
            `SELECT prt.id, prt.user_id, prt.expires_at, prt.used_at, u.status, u.deleted_at
             FROM password_reset_tokens prt
             INNER JOIN users u ON u.id = prt.user_id
             WHERE prt.token_hash = ?
             ORDER BY prt.created_at DESC
             LIMIT 1`,
            [tokenHash]
        );
    } catch (error) {
        if (!isMissingPasswordResetTokensTable(error)) {
            throw error;
        }

        const err = new Error('Invalid or expired reset token.');
        err.statusCode = 400;
        throw err;
    }

    if (tokens.length === 0) {
        const err = new Error('Invalid or expired reset token.');
        err.statusCode = 400;
        throw err;
    }

    const resetToken = tokens[0];
    const isExpired = new Date(resetToken.expires_at) < new Date();

    if (resetToken.used_at || isExpired) {
        const err = new Error('Invalid or expired reset token.');
        err.statusCode = 400;
        throw err;
    }

    if (resetToken.status !== 'active' || resetToken.deleted_at !== null) {
        const err = new Error('Account is inactive or suspended.');
        err.statusCode = 401;
        throw err;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await connection.query(
            'UPDATE users SET password_hash = ?, token_version = token_version + 1 WHERE id = ?',
            [passwordHash, resetToken.user_id]
        );

        await connection.query(
            'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?',
            [resetToken.id]
        );

        await connection.commit();
        return { userId: resetToken.user_id };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.revokeUserSessions = async (userId) => {
    await pool.query('UPDATE users SET token_version = token_version + 1 WHERE id = ?', [userId]);
};

exports.createMfaSetup = async (userId) => {
    const user = await getUserForMfa(userId);

    const secret = speakeasy.generateSecret({
        name: `${config.mfaIssuer} (${user.email})`,
        issuer: config.mfaIssuer,
        length: 32
    });

    await pool.query('UPDATE users SET mfa_temp_secret = ? WHERE id = ?', [secret.base32, user.id]);
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    return {
        issuer: config.mfaIssuer,
        otpauthUrl: secret.otpauth_url,
        qrCodeDataUrl,
        manualEntryKey: secret.base32
    };
};

exports.verifyMfaSetup = async (userId, code) => {
    const user = await getUserForMfa(userId);
    if (!user.mfa_temp_secret) {
        const err = new Error('No pending MFA setup found.');
        err.statusCode = 400;
        throw err;
    }

    const valid = speakeasy.totp.verify({
        secret: user.mfa_temp_secret,
        encoding: 'base32',
        token: code,
        window: 1
    });

    if (!valid) {
        const err = new Error('Invalid MFA verification code.');
        err.statusCode = 400;
        throw err;
    }

    const backupCodes = generateBackupCodes(config.mfaBackupCodesCount);
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await connection.query(
            'UPDATE users SET mfa_enabled = TRUE, mfa_secret = mfa_temp_secret, mfa_temp_secret = NULL, token_version = token_version + 1 WHERE id = ?',
            [user.id]
        );
        await storeBackupCodes(connection, user.id, backupCodes);
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    return { backupCodes };
};

exports.disableMfa = async (userId, data = {}) => {
    const user = await getUserForMfa(userId);
    if (!user.mfa_enabled) {
        return { disabled: false };
    }

    const mfaCode = String(data.mfaCode || '').trim();
    const backupCode = String(data.backupCode || '').trim();
    let valid = false;

    if (mfaCode) {
        valid = speakeasy.totp.verify({
            secret: user.mfa_secret,
            encoding: 'base32',
            token: mfaCode,
            window: 1
        });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        if (!valid && backupCode) {
            valid = await consumeBackupCode(connection, user.id, backupCode);
        }

        if (!valid) {
            const err = new Error('Invalid MFA verification.');
            err.statusCode = 400;
            throw err;
        }

        await connection.query(
            'UPDATE users SET mfa_enabled = FALSE, mfa_secret = NULL, mfa_temp_secret = NULL, token_version = token_version + 1 WHERE id = ?',
            [user.id]
        );
        await connection.query('DELETE FROM mfa_backup_codes WHERE user_id = ?', [user.id]);
        await connection.commit();
        return { disabled: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.regenerateMfaBackupCodes = async (userId, mfaCode) => {
    const user = await getUserForMfa(userId);
    if (!user.mfa_enabled) {
        const err = new Error('MFA must be enabled first.');
        err.statusCode = 400;
        throw err;
    }

    const valid = speakeasy.totp.verify({
        secret: user.mfa_secret,
        encoding: 'base32',
        token: mfaCode,
        window: 1
    });

    if (!valid) {
        const err = new Error('Invalid MFA verification code.');
        err.statusCode = 400;
        throw err;
    }

    const backupCodes = generateBackupCodes(config.mfaBackupCodesCount);
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await storeBackupCodes(connection, user.id, backupCodes);
        await connection.commit();
        return { backupCodes };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.getMfaStatus = async (userId) => {
    const user = await getUserForMfa(userId);
    const [backupCodes] = await pool.query(
        'SELECT COUNT(*) AS remaining FROM mfa_backup_codes WHERE user_id = ? AND used_at IS NULL',
        [userId]
    );

    return {
        enabled: Boolean(user.mfa_enabled),
        hasPendingSetup: Boolean(user.mfa_temp_secret),
        remainingBackupCodes: Number(backupCodes?.[0]?.remaining || 0)
    };
};