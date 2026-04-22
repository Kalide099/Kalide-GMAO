const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createAttachment = async (companyId, userId, data) => {
    const id = uuidv4();
    const { entity_type, entity_id, file_name, file_path, file_size, mime_type } = data;
    
    await pool.query(
        `INSERT INTO attachments 
        (id, company_id, entity_type, entity_id, file_name, file_path, file_size, mime_type, uploaded_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, companyId, entity_type, entity_id, file_name, file_path, file_size, mime_type, userId]
    );
    
    return { id, file_name };
};

exports.getAttachments = async (companyId, entityType, entityId) => {
    const [rows] = await pool.query(
        'SELECT * FROM attachments WHERE company_id = ? AND entity_type = ? AND entity_id = ? ORDER BY created_at DESC',
        [companyId, entityType, entityId]
    );
    return rows;
};
