const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getSubcontractors = async (companyId) => {
    const [rows] = await pool.query(
        'SELECT * FROM subcontractors WHERE company_id = ? ORDER BY created_at DESC',
        [companyId]
    );
    return rows;
};

exports.createSubcontractor = async (companyId, data) => {
    const id = uuidv4();
    const { name, contact_email, contact_phone, service_type, rating } = data;
    
    await pool.query(
        `INSERT INTO subcontractors 
        (id, company_id, name, contact_email, contact_phone, service_type, rating) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, companyId, name, contact_email || null, contact_phone || null, service_type || null, rating || 5]
    );
    
    return { id, name };
};
