const pool = require('../config/db');
const aiGateway = require('./ai_gateway.service');

/**
 * Enterprise Predictive Maintenance Engine
 * Combines statistical MTBF/MTTR analysis with AI-powered ML predictions.
 * Falls back to statistics when the AI microservice is unavailable.
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

    // 5. AI-Enhanced Prediction (NEW)
    // Attempt to get ML-powered prediction from the AI microservice
    let aiPrediction = null;
    try {
        // Fetch company's industry type
        const [companies] = await pool.query(
            'SELECT industry_en FROM companies WHERE id = ?',
            [companyId]
        );

        if (companies.length > 0) {
            const industryType = companies[0].industry_en || 'manufacturing';

            // Fetch latest IoT sensor readings for this asset
            const [readings] = await pool.query(
                `SELECT sensor_type, reading_value 
                 FROM iot_readings 
                 WHERE asset_id = ? 
                 ORDER BY recorded_at DESC 
                 LIMIT 21`,
                [assetId]
            );

            // Build sensor data object from readings
            const sensorData = {};
            readings.forEach(r => {
                sensorData[r.sensor_type] = parseFloat(r.reading_value);
            });

            // Add statistical context to sensor data
            sensorData.mtbf_hours = mtbfHours;
            sensorData.mttr_hours = mttrHours;
            sensorData.health_score = healthScore;
            sensorData.failure_count = orders.length;

            // Request AI prediction
            const aiResult = await aiGateway.requestAIPrediction(
                industryType, sensorData, assetId
            );

            if (aiResult && aiResult.success) {
                aiPrediction = {
                    model_archetype: aiResult.model_archetype,
                    ...aiResult.prediction
                };
            }
        }
    } catch (err) {
        // Silently ignore AI errors — statistical fallback is always available
        console.warn('[Predictive] AI prediction unavailable, using statistical fallback:', err.message);
    }

    return {
        assetId,
        mttr: mttrHours.toFixed(2),
        mtbf: mtbfHours.toFixed(2),
        predictedFailureDate,
        healthScore: Math.round(healthScore),
        recommendations, // Return both, controller will choose
        aiPrediction // null if AI service unavailable — backward compatible
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
