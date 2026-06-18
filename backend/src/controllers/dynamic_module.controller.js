const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getModuleData = async (req, res, next) => {
    try {
        const { moduleName } = req.params;
        const companyId = req.user.company_id;

        const [rows] = await pool.query(
            'SELECT * FROM nexus_module_data WHERE company_id = ? AND module_name = ? AND status = "active" ORDER BY created_at DESC',
            [companyId, moduleName]
        );

        // Map data_payload to flat object for frontend ease of use
        const formattedData = rows.map(row => ({
            id: row.id,
            status: row.status,
            created_at: row.created_at,
            ...row.data_payload
        }));

        return successResponse(res, 200, `${moduleName} data retrieved`, formattedData);
    } catch (err) {
        next(err);
    }
};

exports.addModuleData = async (req, res, next) => {
    try {
        const { moduleName } = req.params;
        const companyId = req.user.company_id;
        const payload = req.body;

        const newId = uuidv4();

        await pool.query(
            'INSERT INTO nexus_module_data (id, company_id, module_name, data_payload) VALUES (?, ?, ?, ?)',
            [newId, companyId, moduleName, JSON.stringify(payload)]
        );

        return successResponse(res, 201, `${moduleName} data created successfully`, { id: newId });
    } catch (err) {
        next(err);
    }
};

exports.updateModuleData = async (req, res, next) => {
    try {
        const { moduleName, id } = req.params;
        const companyId = req.user.company_id;
        const payload = req.body;

        const [result] = await pool.query(
            'UPDATE nexus_module_data SET data_payload = JSON_MERGE_PATCH(data_payload, ?) WHERE id = ? AND company_id = ? AND module_name = ?',
            [JSON.stringify(payload), id, companyId, moduleName]
        );

        if (result.affectedRows === 0) {
            return errorResponse(res, 404, 'Data not found or not authorized');
        }

        return successResponse(res, 200, `${moduleName} data updated successfully`);
    } catch (err) {
        next(err);
    }
};

exports.deleteModuleData = async (req, res, next) => {
    try {
        const { moduleName, id } = req.params;
        const companyId = req.user.company_id;

        // Soft delete
        const [result] = await pool.query(
            'UPDATE nexus_module_data SET status = "archived" WHERE id = ? AND company_id = ? AND module_name = ?',
            [id, companyId, moduleName]
        );

        if (result.affectedRows === 0) {
            return errorResponse(res, 404, 'Data not found or not authorized');
        }

        return successResponse(res, 200, `${moduleName} data archived successfully`);
    } catch (err) {
        next(err);
    }
};
