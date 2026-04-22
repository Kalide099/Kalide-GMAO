const pool = require('../config/db');

/**
 * Enterprise SaaS Subscription & Billing Service
 * Manages plan entitlements, feature locking, and usage metering across the entire tenant fleet.
 */

exports.getCompanySubscription = async (companyId) => {
    const query = `
        SELECT s.*, p.features, pt.name as plan_name
        FROM subscriptions s
        JOIN subscription_plans p ON s.plan_id = p.id
        LEFT JOIN subscription_plan_translations pt ON p.id = pt.plan_id AND pt.language_code = 'en'
        WHERE s.company_id = ? AND s.status = 'active'
        ORDER BY s.created_at DESC LIMIT 1
    `;
    const [rows] = await pool.query(query, [companyId]);
    return rows[0] || null;
};

exports.checkFeatureLimit = async (companyId, featureKey) => {
    const sub = await exports.getCompanySubscription(companyId);
    if (!sub) return false; // No active subscription

    const features = typeof sub.features === 'string' ? JSON.parse(sub.features) : sub.features;
    const limit = features[featureKey];

    if (!limit) return true; // No limit defined for this feature

    // Check current usage based on featureKey
    if (featureKey === 'max_assets') {
        const [count] = await pool.query('SELECT COUNT(*) as total FROM assets WHERE company_id = ? AND deleted_at IS NULL', [companyId]);
        return count[0].total < limit;
    }

    if (featureKey === 'max_users') {
        const [count] = await pool.query('SELECT COUNT(*) as total FROM users WHERE company_id = ? AND deleted_at IS NULL', [companyId]);
        return count[0].total < limit;
    }

    return true;
};

exports.getDashboardStats = async () => {
    const [stats] = await pool.query(`
        SELECT 
            (SELECT COUNT(*) FROM companies) as total_tenants,
            (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subs,
            (SELECT SUM(amount) FROM payments WHERE status = 'success') as total_revenue
    `);
    return stats[0];
};
