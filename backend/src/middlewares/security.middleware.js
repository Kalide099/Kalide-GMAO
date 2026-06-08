const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/responseHandler');
const { config } = require('../config/env');

/**
 * Global Rate Limiter securing the generic API from basic DDOS vectors
 * Limits standard users to 500 requests per 15 minutes.
 */
exports.globalLimiter = rateLimit({
    windowMs: config.globalRateLimitWindowMs,
    max: config.globalRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        errorResponse(res, 429, 'Too many requests from this IP, please try again after 15 minutes.');
    }
});

/**
 * Strict Rate Limiter specifically targeting Authentication endpoints to physically block Brute Force attacks.
 * Limits users to exactly 10 attempts per 15 minutes.
 */
exports.authLimiter = rateLimit({
    windowMs: config.authRateLimitWindowMs,
    max: config.authRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        errorResponse(res, 429, 'Excessive authentication attempts detected. This IP is blocked for 15 minutes.');
    }
});

/**
 * Generic string sanitation interceptor natively stripping XSS tags from Request payload maps directly.
 */
exports.xssSanitizer = (req, res, next) => {
    const sanitize = (obj) => {
        for (const key in obj) {
            // Securely exclude password fields from mangling to prevent login failures
            if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) continue;

            if (typeof obj[key] === 'string') {
                // Strips basic script tags securely dynamically 
                obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                obj[key] = obj[key].replace(/<[^>]*>?/gm, ''); // Strips generic tags natively
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};
