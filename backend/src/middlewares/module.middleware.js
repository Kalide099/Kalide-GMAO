const pool = require('../config/db');

/**
 * Module Guard Middleware
 * Restricts access to specific API routes based on whether 
 * the company has the module enabled.
 */
const checkModule = (moduleName) => {
    return async (req, res, next) => {
        try {
            // SuperAdmins are exempt from module restrictions
            if (req.user.role === 'super_admin') return next();

            const [companies] = await pool.query(
                'SELECT enabled_modules FROM companies WHERE id = ?',
                [req.user.company_id]
            );

            if (companies.length === 0) {
                return res.status(404).json({ success: false, message: "Company not found." });
            }

            const modules = companies[0].enabled_modules || [];
            
            // If modules is a string (MySQL JSON sometimes returns string), parse it
            const activeModules = typeof modules === 'string' ? JSON.parse(modules) : modules;
            const safeModules = Array.isArray(activeModules) ? activeModules : [];

            if (!safeModules.includes(moduleName)) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Module '${moduleName}' is not enabled for your organization. Please contact support.`,
                    module: moduleName
                });
            }

            next();
        } catch (err) {
            console.error("Module Check Error:", err);
            next(err);
        }
    };
};

module.exports = checkModule;
