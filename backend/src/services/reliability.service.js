const pool = require('../config/db');

/**
 * Enterprise Reliability Calculator
 * Calculates industry KPIs: MTTR, MTBF, and Failure Predictions
 */
exports.calculateAssetKPIs = async (companyId, assetId) => {
    // 1. Get all completed work orders for this asset
    const [orders] = await pool.query(
        `SELECT created_at, scheduled_date, completed_date, type 
         FROM work_orders 
         WHERE asset_id = ? AND status = 'completed' AND deleted_at IS NULL
         ORDER BY completed_date ASC`,
        [assetId]
    );

    if (orders.length === 0) return { mttr: 0, mtbf: 0, downtime: 0 };

    let totalRepairTime = 0; // In hours
    let totalUpTime = 0;
    let failureCount = 0;

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        
        // MTTR (Mean Time To Repair) - Corrective actions
        if (order.type === 'corrective') {
            const start = new Date(order.scheduled_date || order.created_at);
            const end = new Date(order.completed_date);
            const duration = (end - start) / (1000 * 60 * 60); // hours
            totalRepairTime += duration;
            failureCount++;
        }

        // MTBF (Mean Time Between Failures)
        if (i > 0 && order.type === 'corrective' && orders[i-1].type === 'corrective') {
            const timeBetween = (new Date(order.created_at) - new Date(orders[i-1].completed_date)) / (1000 * 60 * 60);
            totalUpTime += timeBetween;
        }
    }

    const mttr = failureCount > 0 ? (totalRepairTime / failureCount).toFixed(2) : 0;
    const mtbf = failureCount > 1 ? (totalUpTime / (failureCount - 1)).toFixed(2) : 0;

    return {
        mttr: parseFloat(mttr),
        mtbf: parseFloat(mtbf),
        reliability_score: mtbf > 0 ? Math.min(100, (mtbf / (mtbf + mttr) * 100)).toFixed(1) : 100
    };
};

/**
 * Simple Linear Regression for Failure Prediction
 * Predicts the next failure based on average MTBF
 */
exports.predictNextFailure = async (assetId) => {
    const kpis = await this.calculateAssetKPIs(null, assetId);
    if (!kpis.mtbf || kpis.mtbf === 0) return null;

    // Get last failure
    const [lastFail] = await pool.query(
        `SELECT completed_date FROM work_orders 
         WHERE asset_id = ? AND type = 'corrective' AND status = 'completed'
         ORDER BY completed_date DESC LIMIT 1`,
        [assetId]
    );

    if (lastFail.length === 0) return null;

    const lastDate = new Date(lastFail[0].completed_date);
    const nextDate = new Date(lastDate.getTime() + (kpis.mtbf * 60 * 60 * 1000));

    return {
        predicted_date: nextDate,
        confidence: 0.75, // Basic heuristic
        recommendation_en: "Schedule preventive maintenance before the predicted failure window.",
        recommendation_fr: "Planifiez une maintenance préventive avant la fenêtre de défaillance prédite."
    };
};
