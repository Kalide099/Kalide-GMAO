const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');
const { t } = require('../utils/i18n');
const pool = require('../config/db');
const { config, getEnv } = require('../config/env');

const JWT_SECRET = getEnv('JWT_SECRET', 'kgmao_development_secret_321');

/**
 * Middleware to authenticate user via JWT
 */
exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const lang = req.lang || 'en';
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 401, t('auth.unauthorized', lang));
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded.company_id && decoded.role !== 'super_admin') {
            return errorResponse(res, 401, t('auth.invalid_token', lang));
        }

        const [users] = await pool.query(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [decoded.id]
        );

        if (users.length === 0) {
            return errorResponse(res, 401, t('auth.invalid_token', lang));
        }

        const user = users[0];
        if (user.status !== 'active' || user.deleted_at !== null) {
            return errorResponse(res, 401, t('auth.invalid_token', lang));
        }

        const currentTokenVersion = Number(user.token_version || 0);
        const tokenVersion = Number(decoded.token_version || 0);
        if (currentTokenVersion !== tokenVersion) {
            return errorResponse(res, 401, t('auth.invalid_token', lang));
        }

        req.user = decoded;
        
        next();
    } catch (error) {
        const lang = req.lang || 'en';
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 401, t('auth.token_expired', lang));
        }
        return errorResponse(res, 401, t('auth.invalid_token', lang));
    }
};

/**
 * Middleware for Role-Based Access Control
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        const lang = req.lang || 'en';
        // Super Admins bypass Role-Based Access Control checks globally
        if (req.user && req.user.role === 'super_admin') {
            return next();
        }

        if (!req.user || !roles.includes(req.user.role)) {
            return errorResponse(res, 403, t('auth.permission_denied', lang));
        }
        next();
    };
};

/**
 * Middleware to enforce MFA for privileged roles
 */
exports.enforceMfa = (req, res, next) => {
    const lang = req.lang || 'en';
    const MFA_ENFORCED_ROLES = ['admin', 'super_admin'];
    
    if (config.mfaEnforcementEnabled && MFA_ENFORCED_ROLES.includes(req.user.role) && !req.user.mfa_enabled) {
        return errorResponse(res, 403, 'MFA setup is required to access this resource.', 'MFA_REQUIRED');
    }
    
    next();
};
