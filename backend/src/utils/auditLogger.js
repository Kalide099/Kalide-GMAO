const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const truncate = (value, maxLength = 255) => {
    if (!value) return null;
    return String(value).slice(0, maxLength);
};

const writeAuditLog = async ({
    companyId = null,
    userId = null,
    action,
    entityType,
    entityId,
    details = {}
}) => {
    await pool.query(
        `INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            uuidv4(),
            companyId,
            userId,
            action,
            entityType,
            entityId,
            JSON.stringify(details)
        ]
    );
};

const writeAuthAudit = async ({
    action,
    entityId,
    companyId = null,
    userId = null,
    ip = null,
    userAgent = null,
    email = null,
    outcome = 'success',
    reason = null
}) => {
    await writeAuditLog({
        companyId,
        userId,
        action,
        entityType: 'auth',
        entityId: entityId || uuidv4(),
        details: {
            ip: truncate(ip, 45),
            userAgent: truncate(userAgent, 255),
            email,
            outcome,
            reason
        }
    });
};

module.exports = {
    writeAuditLog,
    writeAuthAudit
};