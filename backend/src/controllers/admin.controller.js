const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.getPlatformAnalytics = async (req, res, next) => {
    try {
        const [companyStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_companies,
                SUM(CASE WHEN subscription_status = 'active' THEN 1 ELSE 0 END) as active_subscriptions
            FROM companies WHERE deleted_at IS NULL
        `);

        const [userStats] = await pool.query('SELECT COUNT(*) as total_users FROM users WHERE deleted_at IS NULL');
        
        const [revenueStats] = await pool.query(`
            SELECT SUM(amount) as total_revenue, currency 
            FROM payments 
            WHERE status = 'success' 
            GROUP BY currency
        `);

        return successResponse(res, 200, 'Global Platform Analytics retrieved', {
            companies: companyStats[0],
            users: userStats[0],
            revenue: revenueStats
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllCompanies = async (req, res, next) => {
    try {
        // Advanced query joining multiple metadata fields uniquely mapped to SaaS
        const query = `
            SELECT 
                c.id, c.name_en, c.name_fr, c.industry_en, c.industry_fr, 
                c.subscription_status, c.plan, c.enabled_modules, c.created_at,
                COUNT(u.id) as user_count
            FROM companies c
            LEFT JOIN users u ON c.id = u.company_id
            WHERE c.deleted_at IS NULL
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `;
        const [companies] = await pool.query(query);
        return successResponse(res, 200, 'Global tenant list retrieved', companies);
    } catch (err) {
        next(err);
    }
};

exports.updateCompanyStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // trial, active, suspended, expired, cancelled

        const validStatuses = ['trial', 'active', 'suspended', 'expired', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return errorResponse(res, 400, 'Invalid status update command.');
        }

        const [result] = await pool.query('UPDATE companies SET subscription_status = ? WHERE id = ?', [status, id]);
        
        if (result.affectedRows === 0) {
            return errorResponse(res, 404, 'Company not found resolving root command');
        }

        // Generate Audit Log dynamically
        await pool.query(
            `INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, details)
             VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
             [id, req.user.id, 'admin_update_status', 'companies', id, JSON.stringify({ new_status: status })]
        );

        return successResponse(res, 200, `Company subscription forcefully updated to ${status}`);
    } catch (err) {
        next(err);
    }
};

exports.impersonateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const [users] = await pool.query('SELECT id, company_id, role, email FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) return errorResponse(res, 404, 'Targeted user not found structurally.');

        const target = users[0];

        // Generate a new standard JWT organically tricking all standard middlewares downstream
        const impersonationToken = jwt.sign(
            { 
                id: target.id, 
                company_id: target.company_id, 
                role: target.role,
                is_impersonating: true, // Special flag primarily utilized by UI banner wrappers
                original_admin_id: req.user.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Short expiry for safety routines
        );

        return successResponse(res, 200, `Impersonation established for: ${target.email}`, { token: impersonationToken });
    } catch (err) {
        next(err);
    }
};

exports.getGlobalAuditLogs = async (req, res, next) => {
    try {
        const [logs] = await pool.query(`
            SELECT al.*, c.name_en as company_name, u.email as action_user
            FROM audit_logs al
            LEFT JOIN companies c ON al.company_id = c.id
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT 100
        `);
        return successResponse(res, 200, 'Root audit systems breached securely.', logs);
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const [users] = await pool.query(`
            SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.created_at, c.name_en as company_name
            FROM users u
            LEFT JOIN companies c ON u.company_id = c.id
            WHERE u.deleted_at IS NULL
            ORDER BY u.created_at DESC
        `);
        return successResponse(res, 200, 'Global users list rendered securely.', users);
    } catch (err) {
        next(err);
    }
};

exports.getAllPayments = async (req, res, next) => {
    try {
        const [payments] = await pool.query(`
            SELECT p.*, c.name_en as company_name
            FROM payments p
            LEFT JOIN companies c ON p.company_id = c.id
            ORDER BY p.created_at DESC
        `);
        return successResponse(res, 200, 'Global transactional history mapped dynamically.', payments);
    } catch (err) {
        next(err);
    }
};

exports.updateCompanyModules = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { modules } = req.body; // Array of strings e.g., ['safety', 'iot']

        if (!Array.isArray(modules)) {
            return errorResponse(res, 400, 'Invalid module configuration format.');
        }

        await pool.query('UPDATE companies SET enabled_modules = ? WHERE id = ?', [JSON.stringify(modules), id]);

        // Audit Log
        await pool.query(
            `INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, details)
             VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
             [id, req.user.id, 'admin_update_modules', 'companies', id, JSON.stringify({ enabled_modules: modules })]
        );

        return successResponse(res, 200, 'Company module configuration synchronized successfully.');
    } catch (err) {
        next(err);
    }
};

exports.updateCompanyPlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { plan } = req.body; // basic, pro, enterprise

        const validPlans = ['basic', 'pro', 'enterprise'];
        if (!validPlans.includes(plan)) {
            return errorResponse(res, 400, 'Invalid plan selection.');
        }

        await pool.query('UPDATE companies SET plan = ? WHERE id = ?', [plan, id]);

        // Audit Log
        await pool.query(
            `INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, details)
             VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
             [id, req.user.id, 'admin_update_plan', 'companies', id, JSON.stringify({ new_plan: plan })]
        );

        return successResponse(res, 200, `Company plan upgraded to ${plan.toUpperCase()}`);
    } catch (err) {
        next(err);
    }
};

exports.seedDemoData = async (req, res) => {
    const { companyId } = req.body;
    if (!companyId) return res.status(400).json({ success: false, message: 'companyId required' });

    try {
        const [users] = await pool.query('SELECT id FROM users WHERE company_id = ? LIMIT 1', [companyId]);
        const [assets] = await pool.query('SELECT id FROM assets WHERE company_id = ? LIMIT 1', [companyId]);
        const [wo] = await pool.query('SELECT id FROM work_orders WHERE company_id = ? LIMIT 1', [companyId]);

        if (users.length === 0 || assets.length === 0) {
            return res.status(400).json({ success: false, message: 'Company must have at least one asset and one user.' });
        }

        const userId = users[0].id;
        const assetId = assets[0].id;

        // 1. Financial Model
        await pool.query('INSERT IGNORE INTO asset_financial_models (id, asset_id, purchase_price, salvage_value, useful_life_years) VALUES (?, ?, ?, ?, ?)', 
            [uuidv4(), assetId, 1250000.00, 250000.00, 10]);

        // 2. ESG Telemetry
        await pool.query('INSERT INTO esg_telemetry (id, company_id, asset_id, energy_kwh, carbon_footprint_kg, water_usage_m3) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), companyId, assetId, 842.5, 14.2, 5.8]);

        // 3. GIS Telemetrics
        await pool.query('INSERT INTO asset_telemetrics (id, asset_id, latitude, longitude, fuel_level_percent, odometer_km) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), assetId, 48.8584, 2.2945, 85.00, 1240.50]);

        // 4. Safety Permit
        if (wo.length > 0) {
            await pool.query('INSERT INTO safety_permits (id, work_order_id, technician_id, checklist_json, status) VALUES (?, ?, ?, ?, ?)',
                [uuidv4(), wo[0].id, userId, JSON.stringify(['Electrical Locked', 'Hydraulic Purged']), 'pending']);
        }

        // 5. Sample Financial Transaction (Revenue)
        await pool.query('INSERT INTO payments (id, company_id, amount, currency, status, provider) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), companyId, 4500.00, 'USD', 'success', 'stripe']);

        // 6. Audit Trail for seeding
        await pool.query(
            'INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), companyId, userId, 'platform_seed', 'system', companyId, JSON.stringify({ action: 'mega_seed_executed' })]
        );

        res.json({ success: true, message: 'Mega Seed successful' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // active, inactive, suspended

        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(status)) {
            return errorResponse(res, 400, 'Invalid user status command.');
        }

        const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
        
        if (result.affectedRows === 0) {
            return errorResponse(res, 404, 'User not found structurally.');
        }

        // Audit Log
        await pool.query(
            `INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, details)
             VALUES (UUID(), NULL, ?, ?, ?, ?, ?)`,
             [req.user.id, 'admin_update_user_status', 'users', id, JSON.stringify({ new_status: status })]
        );

        return successResponse(res, 200, `User identity forcefully ${status === 'active' ? 'restored' : 'revoked'}.`);
    } catch (err) {
        next(err);
    }
};

exports.getUserAuditLogs = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [logs] = await pool.query(`
            SELECT al.*, u.email as action_user
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.user_id = ?
            ORDER BY al.created_at DESC
            LIMIT 50
        `, [id]);
        return successResponse(res, 200, 'User specific audit stream decoded.', logs);
    } catch (err) {
        next(err);
    }
};
