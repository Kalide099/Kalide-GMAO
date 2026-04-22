const pool = require('../config/db');

/**
 * Enterprise Reporting & BI Engine
 * Aggregates multi-tenant maintenance data into actionable KPI datasets.
 */

exports.getTenantKPIs = async (companyId) => {
    // 1. Efficiency: MTTR (Mean Time to Repair)
    // 2. Reliability: MTBF (Mean Time Between Failures)
    // 3. Costs: Total Labor + Part Costs
    
    const [stats] = await pool.query(`
        SELECT 
            COUNT(*) as total_work_orders,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_wo,
            AVG(DATEDIFF(completed_date, created_at)) as avg_resolution_days,
            SUM(actual_labor_cost) as total_labor_spend
        FROM work_orders 
        WHERE company_id = ? AND deleted_at IS NULL
    `, [companyId]);

    const [partSpend] = await pool.query(`
        SELECT SUM(quantity_used * cost_per_unit) as total_part_spend
        FROM work_order_parts
        WHERE company_id = ?
    `, [companyId]);

    return {
        ...stats[0],
        total_part_spend: partSpend[0].total_part_spend || 0,
        total_maintenance_cost: (parseFloat(stats[0].total_labor_spend) || 0) + (parseFloat(partSpend[0].total_part_spend) || 0)
    };
};

exports.exportWorkOrdersCSV = async (companyId, lang = 'en') => {
    const [data] = await pool.query(`
        SELECT 
            wo.id, wot.title, wo.status, wo.priority, wo.type, 
            wo.actual_labor_cost, wo.created_at, wo.completed_date
        FROM work_orders wo
        JOIN work_order_translations wot ON wo.id = wot.work_order_id AND wot.language_code = ?
        WHERE wo.company_id = ? AND wo.deleted_at IS NULL
    `, [lang, companyId]);

    return data;
};
