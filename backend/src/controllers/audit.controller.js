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

exports.exportLogs = async (req, res, next) => {
    try {
        const queueService = require('../services/queue.service');
        const jobId = await queueService.enqueueJob('export_audit_logs', {}, req.user.id, req.user.company_id);
        
        return successResponse(res, 202, 'Export job queued. You will be notified when it is ready.', { jobId });
    } catch (err) {
        next(err);
    }
};
