const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createAsset = async (companyId, data) => {
    const id = uuidv4();
    const { name_en, name_fr, description_en, description_fr, serialNumber, status, location, acquiredAt } = data;

    await pool.query(
        `INSERT INTO assets 
        (id, company_id, name_en, name_fr, description_en, description_fr, serial_number, status, location, acquired_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, companyId, name_en, name_fr, description_en || null, description_fr || null, serialNumber, status || 'active', location, acquiredAt]
    );

    return { id, name_en, name_fr, status };
};

exports.getAssets = async (companyId, languageCode, filters = {}) => {
    const nameCol = languageCode === 'fr' ? 'name_fr' : 'name_en';
    const descCol = languageCode === 'fr' ? 'description_fr' : 'description_en';
    
    let query = `
        SELECT 
            id, company_id, serial_number, status, location, acquired_at, created_at,
            ${nameCol} AS name,
            ${descCol} AS description
        FROM assets
        WHERE company_id = ? AND deleted_at IS NULL
    `;
    
    const params = [companyId];

    if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
};

exports.getAssetById = async (companyId, assetId, languageCode) => {
    const nameCol = languageCode === 'fr' ? 'name_fr' : 'name_en';
    const descCol = languageCode === 'fr' ? 'description_fr' : 'description_en';

    const query = `
        SELECT 
            id, company_id, serial_number, status, location, acquired_at, created_at,
            ${nameCol} AS name,
            ${descCol} AS description
        FROM assets
        WHERE company_id = ? AND id = ? AND deleted_at IS NULL
    `;
    
    const [rows] = await pool.query(query, [companyId, assetId]);
    return rows[0] || null;
};
