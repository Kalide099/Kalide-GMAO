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
        const logs = await auditService.getLogsForExport(req.user.company_id);
        
        // Define CSV headers
        let csvContent = 'Date,Action,User,Email,Entity Type,Entity ID,Details\n';
        
        logs.forEach(log => {
            const date = new Date(log.created_at).toISOString();
            const action = `"${String(log.action || '').replace(/"/g, '""')}"`;
            const user = `"${String(log.user_name || '').replace(/"/g, '""')}"`;
            const email = `"${String(log.email || '').replace(/"/g, '""')}"`;
            const entityType = `"${String(log.entity_type || '').replace(/"/g, '""')}"`;
            const entityId = `"${String(log.entity_id || '').replace(/"/g, '""')}"`;
            const details = `"${String(JSON.stringify(log.details || {})).replace(/"/g, '""')}"`;
            
            csvContent += `${date},${action},${user},${email},${entityType},${entityId},${details}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="audit_logs_export.csv"');
        return res.status(200).send(csvContent);
    } catch (err) {
        next(err);
    }
};
