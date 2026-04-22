const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');
const { t } = require('../utils/i18n');

/**
 * Middleware to authenticate user via JWT
 */
exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const lang = req.lang || 'en';
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 401, t('auth.unauthorized', lang));
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.company_id && decoded.role !== 'super_admin') {
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
