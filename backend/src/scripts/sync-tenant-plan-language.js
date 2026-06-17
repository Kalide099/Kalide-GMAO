const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const pool = require('../config/db');
const { getModulesForPlan } = require('../config/industryTemplates');

const normalizePlan = (plan) => {
    const value = String(plan || 'basic').toLowerCase();
    return ['basic', 'pro', 'enterprise'].includes(value) ? value : 'basic';
};

const normalizeLanguage = (lang) => {
    const value = String(lang || 'en').toLowerCase();
    return value === 'fr' ? 'fr' : 'en';
};

const normalizeModules = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_err) {
            return [];
        }
    }
    return [];
};

const sameModules = (a, b) => {
    if (a.length !== b.length) return false;
    const x = [...a].sort();
    const y = [...b].sort();
    return x.every((item, index) => item === y[index]);
};

const hasArg = (name) => process.argv.includes(name);

const run = async () => {
    const dryRun = hasArg('--dry-run') || hasArg('-d');

    const [companies] = await pool.query(
        `SELECT id, industry_en, plan, default_language, enabled_modules
            FROM companies`
    );

    let companiesUpdated = 0;
    let usersUpdated = 0;

    for (const company of companies) {
        const companyId = company.id;
        const plan = normalizePlan(company.plan);
        const rawLanguage = String(company.default_language || '').toLowerCase();
        const language = normalizeLanguage(rawLanguage);
        const expectedModules = getModulesForPlan(company.industry_en, plan);
        const currentModules = normalizeModules(company.enabled_modules);
        const modulesChanged = !sameModules(currentModules, expectedModules);
        const languageChanged = rawLanguage !== language;

        if (modulesChanged || languageChanged) {
            companiesUpdated += 1;
            if (!dryRun) {
                await pool.query(
                    'UPDATE companies SET plan = ?, default_language = ?, enabled_modules = ? WHERE id = ?',
                    [plan, language, JSON.stringify(expectedModules), companyId]
                );
            }
        }

        if (dryRun) {
            const [countRows] = await pool.query(
                `SELECT COUNT(*) AS cnt
                 FROM users
                 WHERE company_id = ?
                   AND role <> 'super_admin'
                   AND (preferred_language IS NULL OR preferred_language <> ?)`,
                [companyId, language]
            );
            usersUpdated += Number(countRows[0]?.cnt || 0);
        } else {
            const [userResult] = await pool.query(
                `UPDATE users
                 SET preferred_language = ?
                 WHERE company_id = ?
                   AND role <> 'super_admin'
                   AND (preferred_language IS NULL OR preferred_language <> ?)`,
                [language, companyId, language]
            );
            usersUpdated += Number(userResult?.affectedRows || 0);
        }
    }

    const summary = {
        mode: dryRun ? 'dry-run' : 'apply',
        scannedCompanies: companies.length,
        companiesToUpdate: companiesUpdated,
        usersToUpdateLanguage: usersUpdated
    };

    console.log(JSON.stringify(summary, null, 2));
};

run()
    .catch((err) => {
        console.error('Tenant plan/language sync failed:', err.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        try {
            await pool.end();
        } catch (_err) {
            // ignore shutdown errors
        }
    });
