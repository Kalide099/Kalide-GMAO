const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getOrders = async (req, res, next) => {
    try {
        const companyId = req.user.company_id;
        
        // Joining with inventory_items and suppliers to get names
        const [rows] = await db.query(
            `SELECT po.*, 
                    ii.name_en as item_en, ii.name_fr as item_fr,
                    s.name_en as supplier_en, s.name_fr as supplier_fr
             FROM purchase_orders po
             JOIN inventory_items ii ON po.item_id = ii.id
             JOIN suppliers s ON po.supplier_id = s.id
             WHERE po.company_id = ? 
             ORDER BY po.created_at DESC`,
            [companyId]
        );

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const { item_id, supplier_id, quantity, total_cost } = req.body;
        const companyId = req.user.company_id;
        const id = uuidv4();

        await db.query(
            `INSERT INTO purchase_orders (id, company_id, item_id, supplier_id, quantity, total_cost, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'draft')`,
            [id, companyId, item_id, supplier_id, quantity, total_cost]
        );

        res.status(201).json({
            success: true,
            message: 'Purchase Order created successfully',
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const companyId = req.user.company_id;

        const [result] = await db.query(
            'UPDATE purchase_orders SET status = ?, updated_at = NOW() WHERE id = ? AND company_id = ?',
            [status, id, companyId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`
        });
    } catch (error) {
        next(error);
    }
};
