const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Work Order Lifecycle Service
 * Manages full maintenance workflow with strict bilingual isolation and audit trails.
 */

exports.createWorkOrder = async (companyId, creatorId, data) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const id = uuidv4();
        const { assetId, assignedTo, type, priority, scheduledDate, title_en, title_fr, description_en, description_fr } = data;

        // Verify Asset exists and belongs to company
        const [asset] = await connection.query('SELECT id FROM assets WHERE id = ? AND company_id = ? AND deleted_at IS NULL', [assetId, companyId]);
        if (asset.length === 0) throw new Error('Invalid asset ID');

        // 1. Insert Base Work Order
        await connection.query(
            `INSERT INTO work_orders 
            (id, company_id, asset_id, creator_id, assigned_to, type, priority, status, scheduled_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
            [id, companyId, assetId, creatorId, assignedTo || null, type, priority || 'medium', scheduledDate || null]
        );

        // 2. Insert Translations
        const translations = [
            [uuidv4(), id, 'en', title_en, description_en || null],
            [uuidv4(), id, 'fr', title_fr, description_fr || null]
        ];
        
        await connection.query(
            'INSERT INTO work_order_translations (id, work_order_id, language_code, title, description) VALUES ?',
            [translations]
        );

        // 3. Log History
        await connection.query(
            'INSERT INTO work_order_history (id, company_id, work_order_id, user_id, action, new_value) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), companyId, id, creatorId, 'work_order_created', 'pending']
        );

        await connection.commit();
        return exports.getWorkOrderById(companyId, id, 'en');
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

exports.getWorkOrders = async (companyId, languageCode, filters = {}) => {
    let query = `
        SELECT 
            wo.*, 
            wot.title,
            wot.description,
            CASE WHEN ? = 'fr' THEN a.name_fr ELSE a.name_en END AS asset_name,
            u.first_name as assignee_first_name, u.last_name as assignee_last_name 
        FROM work_orders wo 
        INNER JOIN work_order_translations wot ON wo.id = wot.work_order_id AND wot.language_code = ?
        LEFT JOIN assets a ON wo.asset_id = a.id 
        LEFT JOIN users u ON wo.assigned_to = u.id 
        WHERE wo.company_id = ? AND wo.deleted_at IS NULL
    `;
    const params = [languageCode, languageCode, companyId];

    if (filters.status) {
        query += ' AND wo.status = ?';
        params.push(filters.status);
    }
    
    if (filters.assetId) {
        query += ' AND wo.asset_id = ?';
        params.push(filters.assetId);
    }

    query += ' ORDER BY wo.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
};

exports.getWorkOrderById = async (companyId, id, languageCode) => {
    const query = `
        SELECT 
            wo.*, 
            wot.title,
            wot.description,
            a.name_en AS asset_name_en, a.name_fr AS asset_name_fr
        FROM work_orders wo 
        INNER JOIN work_order_translations wot ON wo.id = wot.work_order_id AND wot.language_code = ?
        LEFT JOIN assets a ON wo.asset_id = a.id 
        WHERE wo.company_id = ? AND wo.id = ? AND wo.deleted_at IS NULL
    `;
    
    const [rows] = await pool.query(query, [languageCode, companyId, id]);
    if (rows.length === 0) return null;

    // Fetch comments and history in parallel
    const [comments] = await pool.query('SELECT * FROM work_order_comments WHERE work_order_id = ? ORDER BY created_at DESC', [id]);
    const [history] = await pool.query('SELECT * FROM work_order_history WHERE work_order_id = ? ORDER BY created_at DESC', [id]);
    
    return {
        ...rows[0],
        comments,
        history
    };
};

exports.updateWorkOrderStatus = async (companyId, userId, id, status, completedDate = null) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [oldStatusRows] = await connection.query('SELECT status FROM work_orders WHERE id = ?', [id]);
        const oldStatus = oldStatusRows[0]?.status;

        const [result] = await connection.query(
            'UPDATE work_orders SET status = ?, completed_date = ? WHERE company_id = ? AND id = ? AND deleted_at IS NULL',
            [status, completedDate, companyId, id]
        );

        if (result.affectedRows === 0) throw new Error('Work order not found');

        // Log to history
        await connection.query(
            'INSERT INTO work_order_history (id, company_id, work_order_id, user_id, action, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), companyId, id, userId, 'status_change', oldStatus, status]
        );

        await connection.commit();
        return exports.getWorkOrderById(companyId, id, 'en');
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

exports.addComment = async (companyId, userId, workOrderId, comment) => {
    const id = uuidv4();
    await pool.query(
        'INSERT INTO work_order_comments (id, company_id, work_order_id, user_id, comment) VALUES (?, ?, ?, ?, ?)',
        [id, companyId, workOrderId, userId, comment]
    );
    return { id, comment, created_at: new Date() };
};

exports.deleteWorkOrder = async (companyId, id) => {
    const [result] = await pool.query(
        'UPDATE work_orders SET deleted_at = CURRENT_TIMESTAMP WHERE company_id = ? AND id = ? AND deleted_at IS NULL',
        [companyId, id]
    );
    return result.affectedRows > 0;
};
