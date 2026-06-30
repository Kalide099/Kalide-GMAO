const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Get company details for the authenticated user's own tenant.
 */
exports.getCompanyDetails = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id,
                    name_en,
                    name_fr,
                    COALESCE(name_en, name_fr) AS name,
                    industry_en,
                    industry_fr,
                    COALESCE(industry_en, industry_fr) AS industry,
                    subscription_status AS status,
                    subscription_status,
                    plan,
                    currency,
                    timezone,
                    created_at
             FROM companies
             WHERE id = ? AND deleted_at IS NULL`,
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

/**
 * Get dynamic dashboard statistics for the authenticated user's tenant.
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const companyId = req.user.company_id;
        
        const [[{ totalAssets }]] = await pool.query('SELECT COUNT(*) as totalAssets FROM assets WHERE company_id = ? AND deleted_at IS NULL', [companyId]);
        const [[{ totalWorkOrders }]] = await pool.query('SELECT COUNT(*) as totalWorkOrders FROM work_orders WHERE company_id = ? AND deleted_at IS NULL', [companyId]);
        
        // Simulating throughput logic by checking completed work orders vs total
        const [[{ completedWO }]] = await pool.query('SELECT COUNT(*) as completedWO FROM work_orders WHERE company_id = ? AND status = "completed" AND deleted_at IS NULL', [companyId]);
        
        let throughput = 100.0;
        if (totalWorkOrders > 0) {
            throughput = ((completedWO / totalWorkOrders) * 100).toFixed(1);
        }

        // Simulating some "Active Items" metric
        const [[{ activeWO }]] = await pool.query('SELECT COUNT(*) as activeWO FROM work_orders WHERE company_id = ? AND status IN ("in_progress", "pending") AND deleted_at IS NULL', [companyId]);

        // Recent Audit logs
        const [recentActivity] = await pool.query(
            'SELECT action, entity_type, created_at FROM audit_logs WHERE company_id = ? ORDER BY created_at DESC LIMIT 5',
            [companyId]
        );

        return successResponse(res, 200, 'Dashboard stats retrieved', {
            metrics: {
                totalAssets,
                throughput: `${throughput}%`,
                activeWorkOrders: activeWO
            },
            recentActivity
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Submit a plan upgrade request (company -> admin review).
 */
exports.requestPlan = async (req, res, next) => {
    try {
        const { requested_plan, message } = req.body;
        const companyId = req.user.company_id;

        const validPlans = ['basic', 'pro', 'enterprise'];
        if (!validPlans.includes(requested_plan)) {
            return errorResponse(res, 400, 'Invalid plan selected.');
        }

        // Only one pending request allowed at a time
        const [existing] = await pool.query(
            'SELECT id FROM plan_requests WHERE company_id = ? AND status = "pending" LIMIT 1',
            [companyId]
        );
        if (existing.length > 0) {
            return errorResponse(res, 409, 'You already have a pending plan request awaiting admin review.');
        }

        const id = uuidv4();
        await pool.query(
            'INSERT INTO plan_requests (id, company_id, requested_plan, message) VALUES (?, ?, ?, ?)',
            [id, companyId, requested_plan, message || null]
        );

        return successResponse(res, 201, 'Plan request submitted. Admin will review shortly.', { id });
    } catch (error) {
        next(error);
    }
};

/**
 * Get the company's most recent plan request.
 */
exports.getMyPlanRequest = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, requested_plan, message, status, admin_notes, created_at, processed_at
             FROM plan_requests WHERE company_id = ? ORDER BY created_at DESC LIMIT 1`,
            [req.user.company_id]
        );
        return successResponse(res, 200, 'Plan request retrieved.', rows[0] || null);
    } catch (error) {
        next(error);
    }
};
