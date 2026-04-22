const auditService = require('../services/audit.service');
const { successResponse } = require('../utils/responseHandler');

exports.getLogs = async (req, res, next) => {
    try {
        const logs = await auditService.getLogs(req.user.company_id);
        return successResponse(res, 200, 'Audit logs retrieved.', logs);
    } catch (err) {
        next(err);
    }
};
