const pool = require('../config/db');

/**
 * Enterprise Predictive Maintenance Engine
 * Calculates MTBF/MTTR and predicts failure vectors based on historical Work Order telemetry.
 */

exports.calculateAssetMetrics = async (companyId, assetId) => {
    // 1. Fetch completed corrective work orders for MTTR
    // MTTR = Total Repair Time / Number of Repairs
    const [orders] = await pool.query(
        `SELECT created_at, completed_date 
         FROM work_orders 
         WHERE asset_id = ? AND company_id = ? AND status = 'completed' AND type = 'corrective' AND completed_date IS NOT NULL`,
        [assetId, companyId]
    );

    let mttrHours = 0;
    if (orders.length > 0) {
        const totalRepairTimeMs = orders.reduce((acc, order) => {
            return acc + (new Date(order.completed_date) - new Date(order.created_at));
        }, 0);
        mttrHours = (totalRepairTimeMs / (1000 * 60 * 60)) / orders.length;
    }

    // 2. Calculate MTBF (Mean Time Between Failures)
    // MTBF = Total Operational Time / Number of Failures
    // For simplicity, we calculate distance between 'corrective' creations.
    let mtbfHours = 0;
    if (orders.length > 1) {
        const sortedOrders = [...orders].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        let totalGapMs = 0;
        for (let i = 1; i < sortedOrders.length; i++) {
            totalGapMs += (new Date(sortedOrders[i].created_at) - new Date(sortedOrders[i-1].completed_date || sortedOrders[i-1].created_at));
        }
        mtbfHours = (totalGapMs / (1000 * 60 * 60)) / (orders.length - 1);
    }

    // 3. Predict Next Failure Date
    // Prediction = Last Failure Date + MTBF
    let predictedFailureDate = null;
    if (mtbfHours > 0) {
        const lastFailure = new Date(orders[orders.length - 1].created_at);
        predictedFailureDate = new Date(lastFailure.getTime() + (mtbfHours * 60 * 60 * 1000));
    }

    // 4. Determine Health Score (0-100)
    // High MTBF + Low MTTR = High Score
    let healthScore = 100;
    if (mtbfHours > 0) {
        const ratio = mttrHours / mtbfHours;
        healthScore = Math.max(0, Math.min(100, 100 - (ratio * 100)));
    }

    const recommendations = {
        en: healthScore < 70 
            ? "High frequency of failures detected. Schedule immediate preventive overhaul." 
            : "Asset performing within nominal parameters.",
        fr: healthScore < 70 
            ? "Fréquence élevée de pannes détectée. Planifiez une révision préventive immédiate." 
            : "Actif fonctionnant selon les paramètres nominaux."
    };

    return {
        assetId,
        mttr: mttrHours.toFixed(2),
        mtbf: mtbfHours.toFixed(2),
        predictedFailureDate,
        healthScore: Math.round(healthScore),
        recommendations // Return both, controller will choose
    };
};

exports.getFleetPredictiveOverview = async (companyId, languageCode) => {
    const nameCol = languageCode === 'fr' ? 'name_fr' : 'name_en';
    const [assets] = await pool.query(
        `SELECT id, ${nameCol} as name FROM assets WHERE company_id = ? AND deleted_at IS NULL`,
        [companyId]
    );

    const overview = await Promise.all(assets.map(async (asset) => {
        const metrics = await exports.calculateAssetMetrics(companyId, asset.id);
        return {
            ...metrics,
            name: asset.name
        };
    }));

    return overview;
};
