const { errorResponse } = require('../utils/responseHandler');
const logger = require('../config/logger');

/**
 * Global Error Handling Layer
 * Intercepts all runtime errors and formats them into the standard SaaS response schema.
 */
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error('Unhandled API error', {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        error: err
    });

    // MySQL Specific Handling
    if (err.code === 'ER_DUP_ENTRY') {
        return errorResponse(res, 400, 'record_already_exists', 'DUPLICATE_ERROR');
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return errorResponse(res, 400, 'referenced_record_not_found', 'FOREIGN_KEY_ERROR');
    }

    // Standard Response
    const isDev = process.env.NODE_ENV === 'development';
    const safeMessage = isDev ? err.message : 'internal_server_error';

    return errorResponse(res, err.statusCode, safeMessage, err.errorCode || 'SERVER_ERROR');
};

module.exports = globalErrorHandler;
