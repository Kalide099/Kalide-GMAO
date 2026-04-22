const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Get company details for the authenticated user's own tenant.
 */
exports.getCompanyDetails = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, industry, status, subscription_status, currency, timezone, created_at FROM companies WHERE id = ? AND deleted_at IS NULL',
            [req.user.company_id]
        );
        
        if (rows.length === 0) {
            return errorResponse(res, 404, 'Company not found');
        }

        return successResponse(res, 200, 'Company details retrieved', rows[0]);
    } catch (error) {
        next(error);
    }
};
