const pool = require('../config/db');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Multi-Tenant Module Access Middleware
 * Ensures a company has the rights to use a specific feature based on their manual profile or plan.
 */
const checkModuleAccess = (moduleName) => {
    return async (req, res, next) => {
        try {
            // Fetch company modules and plan
            const [companies] = await pool.query(
                'SELECT plan, enabled_modules FROM companies WHERE id = ?',
                [req.user.company_id]
            );

            if (companies.length === 0) {
                return errorResponse(res, 403, 'Company node not found.');
            }

            const company = companies[0];
            const modulesRaw = company.enabled_modules || [];
            const enabledModules = typeof modulesRaw === 'string' ? JSON.parse(modulesRaw) : modulesRaw;
            const safeEnabledModules = Array.isArray(enabledModules) ? enabledModules : [];
            const plan = company.plan || 'basic';

            // --- PLAN DEFINITIONS (Defaults) ---
            const planDefaults = {
                basic: ['assets', 'work_orders', 'inventory'],
                pro: ['assets', 'work_orders', 'inventory', 'rca', 'fmea', 'calibration', 'tpm', 'predictive'],
                enterprise: ['assets', 'work_orders', 'inventory', 'rca', 'fmea', 'calibration', 'tpm', 'predictive', 'loto', 'dms', 'bim', 'sso', 'carbon', 'ar_workforce']
            };

            // Check if feature is in plan OR explicitly enabled via modules_json (custom override by Super Admin)
            const defaults = planDefaults[plan] || planDefaults.basic;
            const hasAccess = defaults.includes(moduleName) || safeEnabledModules.includes(moduleName);

            if (!hasAccess) {
                return errorResponse(res, 403, `Access Violation: Module [${moduleName.toUpperCase()}] is not active for your deployment.`);
            }

            next();
        } catch (err) {
            console.error('Feature Gating Error:', err);
            return errorResponse(res, 500, 'Internal Authorization Protocol Error');
        }
    };
};

module.exports = { checkModuleAccess };
