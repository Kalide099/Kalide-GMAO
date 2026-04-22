/**
 * Standard API Response Utility
 * Ensures all responses follow the production SaaS architecture requirements.
 */

exports.successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

exports.errorResponse = (res, statusCode, message, errorCode = 'API_ERROR') => {
    return res.status(statusCode).json({
        success: false,
        message,
        error_code: errorCode
    });
};
