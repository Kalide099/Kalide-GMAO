const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const notificationService = require('./notification.service');

exports.checkThresholds = async (companyId, itemId) => {
    const [rows] = await pool.query(
        'SELECT name_en, name_fr, quantity, minimum_quantity FROM inventory_items WHERE id = ? AND company_id = ?',
        [itemId, companyId]
    );

    if (rows.length > 0) {
        const item = rows[0];
        if (item.quantity <= item.minimum_quantity) {
            await notificationService.createNotification(companyId, {
                type: 'inventory',
                title_en: 'Low Stock Alert',
                title_fr: 'Alerte de Stock Bas',
                message_en: `Item ${item.name_en} has reached low quantity (${item.quantity}).`,
                message_fr: `L'article ${item.name_fr} a atteint une quantité basse (${item.quantity}).`
            });
        }
    }
};

exports.createItem = async (companyId, data) => {
    const id = uuidv4();
    const { name_en, name_fr, sku, quantity, minimumQuantity, price, supplierId } = data;

    await pool.query(
        `INSERT INTO inventory_items (id, company_id, supplier_id, name_en, name_fr, sku, quantity, minimum_quantity, price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, companyId, supplierId || null, name_en, name_fr, sku, quantity, minimumQuantity, price || 0]
    );

    await exports.checkThresholds(companyId, id);
    return { id, name_en, name_fr, sku };
};

exports.getItems = async (companyId, languageCode) => {
    const nameCol = languageCode === 'fr' ? 'name_fr' : 'name_en';
    const query = `
        SELECT 
            i.id, i.company_id, i.supplier_id, i.sku, i.quantity, i.minimum_quantity, i.price, i.created_at,
            i.name_en, i.name_fr,
            i.${nameCol} AS name,
            s.name_en AS supplier_name_en, s.name_fr AS supplier_name_fr
        FROM inventory_items i
        LEFT JOIN suppliers s ON i.supplier_id = s.id
        WHERE i.company_id = ? AND i.deleted_at IS NULL
        ORDER BY i.created_at DESC
    `;
    const [rows] = await pool.query(query, [companyId]);
    return rows;
};

exports.updateItem = async (companyId, id, data) => {
    const { name_en, name_fr, sku, quantity, minimumQuantity, price, supplierId } = data;
    
    const [result] = await pool.query(
        `UPDATE inventory_items 
         SET name_en = ?, name_fr = ?, sku = ?, quantity = ?, minimum_quantity = ?, price = ?, supplier_id = ?
         WHERE id = ? AND company_id = ? AND deleted_at IS NULL`,
        [name_en, name_fr, sku, quantity, minimumQuantity, price, supplierId || null, id, companyId]
    );

    if (result.affectedRows === 0) return null;
    await exports.checkThresholds(companyId, id);
    return { id, name_en, name_fr, sku };
};

exports.deleteItem = async (companyId, id) => {
    const [result] = await pool.query(
        'UPDATE inventory_items SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND company_id = ? AND deleted_at IS NULL',
        [id, companyId]
    );
    return result.affectedRows > 0;
};
