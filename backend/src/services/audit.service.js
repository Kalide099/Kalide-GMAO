const pool = require('../config/db');

exports.getLogs = async (companyId) => {
    const [rows] = await pool.query(
        `SELECT a.*, CONCAT(u.first_name, ' ', u.last_name) as user_name 
         FROM audit_logs a
         LEFT JOIN users u ON a.user_id = u.id
         WHERE a.company_id = ?
         ORDER BY a.created_at DESC LIMIT 100`,
        [companyId]
    );
    return rows;
};

exports.logAction = async (companyId, userId, action, entityType, entityId, details) => {
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    await pool.query(
        `INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, details) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, companyId, userId, action, entityType, entityId, JSON.stringify(details)]
    );
};
