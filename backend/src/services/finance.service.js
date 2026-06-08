const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Asset Financial Engineering Service
 * Calculates TCO (Total Cost of Ownership), Depreciation, and Maintenance ROI.
 */
exports.getAssetFinancials = async (company_id, asset_id) => {
    // 1. Fetch Financial Model & Asset Info
    const [model] = await pool.query(`
        SELECT fm.*, a.name_en, a.name_fr, a.acquired_at
        FROM asset_financial_models fm
        JOIN assets a ON fm.asset_id = a.id
        WHERE fm.asset_id = ? AND a.company_id = ?
    `, [asset_id, company_id]);

    if (model.length === 0) return null;

    const data = model[0];
    
    // 2. Fetch Total Maintenance Costs
    const [woCosts] = await pool.query(`
        SELECT SUM(actual_labor_cost) as total_labor, 
               (SELECT SUM(quantity_used * cost_per_unit) FROM work_order_parts WHERE company_id = ?) as total_parts
        FROM work_orders
        WHERE asset_id = ? AND company_id = ? AND status = 'completed'
    `, [company_id, asset_id, company_id]);

    const totalMaintenance = Number(woCosts[0].total_labor || 0) + Number(woCosts[0].total_parts || 0);

    // 3. Calculate Depreciation
    // Current Age in Years
    const ageYears = (new Date() - new Date(data.acquired_at)) / (1000 * 60 * 60 * 24 * 365);
    let currentBookValue = data.purchase_price;
    
    if (data.depreciation_method === 'straight_line') {
        const annualDepr = (data.purchase_price - data.salvage_value) / data.useful_life_years;
        currentBookValue = Math.max(data.salvage_value, data.purchase_price - (annualDepr * ageYears));
    }

    return {
        asset_id,
        name: data.name_en,
        purchase_price: data.purchase_price,
        current_book_value: currentBookValue.toFixed(2),
        total_maintenance_cost: totalMaintenance.toFixed(2),
        tco: (Number(data.purchase_price) + totalMaintenance).toFixed(2),
        age_years: ageYears.toFixed(1),
        roi_efficiency: ((currentBookValue / (Number(data.purchase_price) + totalMaintenance)) * 100).toFixed(1)
    };
};

exports.getCompanyFinanceOverview = async (company_id) => {
    const [rows] = await pool.query(`
        SELECT fm.asset_id, fm.purchase_price, 
               (SELECT SUM(actual_labor_cost) FROM work_orders WHERE asset_id = fm.asset_id) as maintenance
        FROM asset_financial_models fm
        JOIN assets a ON fm.asset_id = a.id
        WHERE a.company_id = ?
    `, [company_id]);

    return {
        total_asset_value: rows.reduce((acc, r) => acc + Number(r.purchase_price || 0), 0),
        total_maintenance_spend: rows.reduce((acc, r) => acc + Number(r.maintenance || 0), 0),
        asset_count: rows.length
    };
};

exports.getContracts = async (companyId) => {
    const [rows] = await pool.query(`
        SELECT c.*, s.name as subcontractor_name 
        FROM contracts c
        LEFT JOIN subcontractors s ON c.subcontractor_id = s.id
        WHERE c.company_id = ? 
        ORDER BY c.end_date ASC
    `, [companyId]);
    return rows;
};

exports.getBudgets = async (companyId) => {
    const [rows] = await pool.query(
        'SELECT * FROM budgets WHERE company_id = ? ORDER BY year DESC, sector ASC',
        [companyId]
    );
    return rows;
};

exports.createContract = async (companyId, data) => {
    const id = uuidv4();
    const { subcontractor_id, title, start_date, end_date, value, currency, status } = data;
    await pool.query(
        `INSERT INTO contracts (id, company_id, subcontractor_id, title, start_date, end_date, value, currency, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, companyId, subcontractor_id || null, title, start_date, end_date, value || 0, currency || 'USD', status || 'active']
    );
    return { id, title };
};

exports.createBudget = async (companyId, data) => {
    const id = uuidv4();
    const { year, sector, allocated_amount, spent_amount, currency } = data;
    await pool.query(
        `INSERT INTO budgets (id, company_id, year, sector, allocated_amount, spent_amount, currency) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, companyId, year, sector, allocated_amount || 0, spent_amount || 0, currency || 'USD']
    );
    return { id, year, sector };
};

exports.archiveContract = async (companyId, contractId) => {
    const [result] = await pool.query(
        `UPDATE contracts
         SET status = 'archived'
         WHERE id = ? AND company_id = ?`,
        [contractId, companyId]
    );

    return result.affectedRows > 0;
};
