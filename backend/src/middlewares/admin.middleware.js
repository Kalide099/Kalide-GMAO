const { errorResponse } = require('../utils/responseHandler');

/**
 * Irrevocably gates execution paths globally requiring explicit Super Admin permissions.
 * Must be executed AFTER the general `authenticate` middleware.
 */
exports.checkSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
        return errorResponse(res, 403, 'Global Access Denied: Requires Super Administration Authority.');
    }
    next();
};
