const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getCustomForms = async (companyId) => {
    const [rows] = await pool.query(
        'SELECT * FROM custom_forms WHERE company_id = ? AND is_active = TRUE ORDER BY created_at DESC',
        [companyId]
    );
    return rows;
};

exports.createCustomForm = async (companyId, data) => {
    const id = uuidv4();
    const { name, description, entity_type } = data;
    
    await pool.query(
        `INSERT INTO custom_forms (id, company_id, name, description, entity_type) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, companyId, name, description || null, entity_type]
    );
    
    return { id, name };
};

exports.deleteCustomForm = async (companyId, formId) => {
    const [result] = await pool.query(
        `UPDATE custom_forms
         SET is_active = FALSE
         WHERE id = ? AND company_id = ?`,
        [formId, companyId]
    );

    return result.affectedRows > 0;
};
