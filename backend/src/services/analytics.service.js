const pool = require('../config/db');
const reliabilityService = require('./reliability.service');

/**
 * Enterprise KPI Analytics
 * Aggregates site-wide and company-wide metrics
 */
exports.getCompanyKPIs = async (companyId) => {
    // 1. Basic Stats
    const [counts] = await pool.query(
        `SELECT 
            COUNT(DISTINCT a.id) as total_assets,
            COUNT(DISTINCT CASE WHEN wo.status = 'pending' THEN wo.id END) as pending_orders,
            COUNT(DISTINCT CASE WHEN a.status = 'maintenance' THEN a.id END) as assets_down
         FROM companies c
         LEFT JOIN assets a ON c.id = a.company_id
         LEFT JOIN work_orders wo ON c.id = wo.company_id
         WHERE c.id = ?`,
        [companyId]
    );

    // 2. Reliability Averages
    const [assets] = await pool.query(`SELECT id FROM assets WHERE company_id = ?`, [companyId]);
    
    let totalMTTR = 0;
    let totalMTBF = 0;
    let validAssets = 0;

    for (const asset of assets) {
        const kpis = await reliabilityService.calculateAssetKPIs(companyId, asset.id);
        if (kpis.mttr > 0 || kpis.mtbf > 0) {
            totalMTTR += kpis.mttr;
            totalMTBF += kpis.mtbf;
            validAssets++;
        }
    }

    // 3. Financials
    const [costs] = await pool.query(
        `SELECT SUM(actual_labor_cost) as total_labor_cost
         FROM work_orders
         WHERE company_id = ? AND status = 'completed'`,
        [companyId]
    );

    return {
        overview: counts[0],
        reliability: {
            avg_mttr: validAssets > 0 ? (totalMTTR / validAssets).toFixed(1) : 0,
            avg_mtbf: validAssets > 0 ? (totalMTBF / validAssets).toFixed(1) : 0,
            system_availability: validAssets > 0 ? ((totalMTBF / (totalMTBF + totalMTTR)) * 100).toFixed(1) : 100
        },
        financials: {
            total_cost: parseFloat(costs[0].total_labor_cost || 0).toFixed(2)
        }
    };
};
