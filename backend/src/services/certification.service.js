const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Skill Matrix & Certification Service
 * Audits workforce qualifications for high-risk industrial assets.
 */
exports.getAllCertifications = async () => {
    const [rows] = await pool.query('SELECT * FROM certifications');
    return rows;
};

exports.getUserCertifications = async (user_id) => {
    const [rows] = await pool.query(`
        SELECT uc.*, c.name_en, c.name_fr, c.authority
        FROM user_certifications uc
        JOIN certifications c ON uc.certification_id = c.id
        WHERE uc.user_id = ? AND uc.status = 'active'
    `, [user_id]);
    return rows;
};

exports.getCompanySkillMatrix = async (company_id) => {
    const [rows] = await pool.query(`
        SELECT u.id as user_id, u.first_name, u.last_name, 
               c.name_en as cert_name, uc.expires_at, uc.status
        FROM users u
        LEFT JOIN user_certifications uc ON u.id = uc.user_id
        LEFT JOIN certifications c ON uc.certification_id = c.id
        WHERE u.company_id = ? AND u.role IN ('technician', 'manager')
    `, [company_id]);
    
    // Group by user for matrix view
    const matrix = {};
    rows.forEach(r => {
        if (!matrix[r.user_id]) {
            matrix[r.user_id] = {
                name: `${r.first_name} ${r.last_name}`,
                certs: []
            };
        }
        if (r.cert_name) {
            matrix[r.user_id].certs.push({
                name: r.cert_name,
                expires: r.expires_at,
                status: r.status
            });
        }
    });
    return Object.values(matrix);
};

exports.assignCertification = async (data) => {
    const id = uuidv4();
    const { user_id, certification_id, certificate_number, issued_at, expires_at } = data;
    
    await pool.query(`
        INSERT INTO user_certifications (id, user_id, certification_id, certificate_number, issued_at, expires_at, status)
        VALUES (?, ?, ?, ?, ?, ?, 'active')
    `, [id, user_id, certification_id, certificate_number, issued_at, expires_at]);
    
    return { id };
};
