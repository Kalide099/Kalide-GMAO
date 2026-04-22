const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Smart Warehouse & Logistics Service
 * Manages QR-linked inventory transactions and site-specific storage.
 */
exports.getWarehouseLocations = async (company_id) => {
    const [rows] = await pool.query('SELECT * FROM warehouse_locations WHERE company_id = ?', [company_id]);
    return rows;
};

exports.getInventoryByLocation = async (location_id) => {
    const [rows] = await pool.query(`
        SELECT i.*, l.name as location_name
        FROM inventory_items i
        JOIN warehouse_locations l ON i.current_location_id = l.id
        WHERE i.current_location_id = ?
    `, [location_id]);
    return rows;
};

exports.transferItem = async (data) => {
    const { inventory_id, from_location_id, to_location_id, quantity, user_id } = data;
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const id = uuidv4();
        // 1. Log Transaction
        await connection.query(`
            INSERT INTO inventory_transactions (id, inventory_id, user_id, from_location_id, to_location_id, quantity_change, transaction_type)
            VALUES (?, ?, ?, ?, ?, ?, 'transfer')
        `, [id, inventory_id, user_id, from_location_id, to_location_id, quantity]);

        // 2. Update Item Location
        await connection.query(`
            UPDATE inventory_items SET current_location_id = ? WHERE id = ?
        `, [to_location_id, inventory_id]);

        await connection.commit();
        return { success: true, transactionId: id };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

exports.getWarehouseMetrics = async (company_id) => {
    const [rows] = await pool.query(`
        SELECT 
            COUNT(DISTINCT id) as total_items,
            SUM(quantity) as total_units,
            COUNT(DISTINCT current_location_id) as active_bins
        FROM inventory_items
        WHERE company_id = ?
    `, [company_id]);
    return rows[0];
};
