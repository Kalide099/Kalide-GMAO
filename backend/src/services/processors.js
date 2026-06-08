const auditService = require('./audit.service');
const queueService = require('./queue.service');
const fs = require('fs').promises;
const path = require('path');

queueService.registerProcessor('export_audit_logs', async (payload, userId, companyId) => {
    const logs = await auditService.getLogsForExport(companyId);
        
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

    const exportDir = path.join(__dirname, '../../exports');
    await fs.mkdir(exportDir, { recursive: true });
    
    const fileName = `audit_export_${companyId}_${Date.now()}.csv`;
    const filePath = path.join(exportDir, fileName);
    
    await fs.writeFile(filePath, csvContent);
    
    // Usually you'd send an email here or store the link for download.
    return { fileUrl: `/exports/${fileName}` };
});
