const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * SaaS Billing & Monetization Controller
 * Manages tenant subscriptions, historical payments, and automated tiering.
 */

exports.getCurrentPlan = async (req, res, next) => {
    try {
        const [plan] = await pool.query(`
            SELECT s.*, pt.name as plan_name, p.features
            FROM subscriptions s
            JOIN subscription_plans p ON s.plan_id = p.id
            JOIN subscription_plan_translations pt ON p.id = pt.plan_id AND pt.language_code = ?
            WHERE s.company_id = ? AND s.status = 'active'
            LIMIT 1
        `, [req.lang || 'en', req.user.company_id]);

        if (plan.length === 0) return errorResponse(res, 404, 'No active subscription found.');

        return successResponse(res, 200, 'Subscription details retrieved', plan[0]);
    } catch (err) {
        next(err);
    }
};

exports.simulatePayment = async (req, res, next) => {
    try {
        const { planId, amount, currency } = req.body;
        const companyId = req.user.company_id;

        // 1. Record Payment
        const paymentId = uuidv4();
        await pool.query(
            'INSERT INTO payments (id, company_id, amount, currency, provider, status, transaction_reference) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [paymentId, companyId, amount, currency, 'simulated_stripe', 'success', `tx_${Date.now()}`]
        );

        // 2. Update/Upsert Subscription
        const subId = uuidv4();
        await pool.query(
            `INSERT INTO subscriptions (id, company_id, plan_id, start_date, end_date, status)
             VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'active')
             ON DUPLICATE KEY UPDATE plan_id = VALUES(plan_id), end_date = VALUES(end_date), status = 'active'`,
            [subId, companyId, planId]
        );

        return successResponse(res, 200, 'Payment processed and subscription updated.');
    } catch (err) {
        next(err);
    }
};
