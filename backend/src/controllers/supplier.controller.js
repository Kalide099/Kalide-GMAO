const db = require('../config/db');

exports.getSuppliers = async (req, res, next) => {
    try {
        const companyId = req.user.company_id;
        const [rows] = await db.query(
            'SELECT * FROM suppliers WHERE company_id = ? AND deleted_at IS NULL',
            [companyId]
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
};

exports.createSupplier = async (req, res, next) => {
    try {
        const { name_en, name_fr, email, phone } = req.body;
        const companyId = req.user.company_id;
        const { v4: uuidv4 } = require('uuid');
        const id = uuidv4();

        await db.query(
            'INSERT INTO suppliers (id, company_id, name_en, name_fr, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [id, companyId, name_en, name_fr, email, phone]
        );

        res.status(201).json({ success: true, data: { id } });
    } catch (error) {
        next(error);
    }
};
