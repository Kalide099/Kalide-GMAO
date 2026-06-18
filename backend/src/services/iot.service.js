const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const aiGateway = require('./ai_gateway.service');
const { broadcastToCompany } = require('../config/socket');

/**
 * Enterprise IoT Digital Twin Engine
 * Manages real-time telemetry ingestion and automated anomaly detection using Python AI.
 */

// In-memory simulation state for scripted degradation
const simState = {};

exports.recordReading = async (assetId, sensorData) => {
    try {
        // Fetch company_id and industry_type
        const [assetRows] = await pool.query(`
            SELECT a.company_id, c.industry_type, a.name 
            FROM assets a 
            JOIN companies c ON a.company_id = c.id 
            WHERE a.id = ? AND a.deleted_at IS NULL
        `, [assetId]);

        if (assetRows.length === 0) return;
        const { company_id, industry_type, name: assetName } = assetRows[0];

        // 1. Persist telemetry reading to DB
        for (const [sensorType, value] of Object.entries(sensorData)) {
            await pool.query(
                'INSERT INTO iot_readings (asset_id, sensor_type, reading_value) VALUES (?, ?, ?)',
                [assetId, sensorType, value]
            );
        }

        // Broadcast raw live telemetry to the frontend Activity Stream
        broadcastToCompany(company_id, 'telemetry_update', {
            assetId,
            assetName,
            sensorData,
            timestamp: new Date().toISOString()
        });

        // 2. Request Live AI Prediction from Python Microservice
        const result = await aiGateway.requestAIPrediction(industry_type, sensorData, assetId);
        
        if (result && result.success) {
            const prediction = result.prediction;
            
            // Broadcast the AI prediction to the frontend AI Copilot
            broadcastToCompany(company_id, 'ai_prediction', {
                assetId,
                assetName,
                industry_type,
                model_archetype: result.model_archetype,
                prediction,
                timestamp: new Date().toISOString()
            });

            // 3. Automated Action (Drafting Work Order if Critical)
            // Determine if the AI prediction is critical (anomaly detected, low RUL, or high failure prob)
            const isCritical = 
                prediction.anomaly === -1 || 
                (prediction.rul !== undefined && prediction.rul < 15) ||
                (prediction.failure_probability !== undefined && prediction.failure_probability > 0.80);

            if (isCritical) {
                await exports.triggerAnomalyWorkOrder(assetId, company_id, 'AI Predictive Engine', JSON.stringify(prediction));
            }
        }
    } catch (err) {
        console.error('[IoT Service] Failed to record reading or trigger AI:', err);
    }
};

exports.triggerAnomalyWorkOrder = async (assetId, companyId, sensorType, predictionRaw) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const woId = uuidv4();

        // Check if an active anomaly work order already exists to avoid spamming the tenant
        const [existing] = await connection.query(
            "SELECT wo.id FROM work_orders wo JOIN work_order_translations wot ON wo.id = wot.work_order_id WHERE wo.asset_id = ? AND wo.status = 'pending' AND wot.title LIKE '%AI Copilot%'",
            [assetId]
        );

        if (existing.length === 0) {
            // 1. Create Base Work Order
            await connection.query(
                `INSERT INTO work_orders 
                (id, company_id, asset_id, creator_id, type, priority, status) 
                 VALUES (?, ?, ?, ?, 'corrective', 'critical', 'pending')`,
                [woId, companyId, assetId, '00000000-0000-0000-0000-000000000000']
            );

            // 2. Create Translations
            const titleEn = `[AI Copilot] Critical Asset Failure Predicted`;
            const titleFr = `[AI Copilot] Défaillance Critique d'Actif Prédite`;
            const descEn = `Automated alert by Python AI: Prediction indicates imminent failure or anomaly. Details: ${predictionRaw}`;
            const descFr = `Alerte automatisée par l'IA Python: La prédiction indique une défaillance imminente ou une anomalie. Détails: ${predictionRaw}`;

            await connection.query(
                'INSERT INTO work_order_translations (id, work_order_id, language_code, title, description) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
                [
                    uuidv4(), woId, 'en', titleEn, descEn,
                    uuidv4(), woId, 'fr', titleFr, descFr
                ]
            );

            // 3. Log to History
            await connection.query(
                'INSERT INTO work_order_history (id, company_id, work_order_id, user_id, action, new_value) VALUES (UUID(), ?, ?, ?, ?, ?)',
                [companyId, woId, '00000000-0000-0000-0000-000000000000', 'system_ai_anomaly_detected', 'pending']
            );

            console.log(`🧠 [AI Copilot] Critical anomaly predicted on ${assetId}. Work order ${woId} drafted.`);
            
            // Broadcast the drafted WO event
            broadcastToCompany(companyId, 'wo_auto_drafted', {
                assetId,
                woId,
                title: titleEn
            });
        }
        await connection.commit();
    } catch (err) {
        await connection.rollback();
        console.error('Failed to trigger anomaly work order:', err);
    } finally {
        connection.release();
    }
};

exports.getAssetTelemetry = async (assetId, limit = 50) => {
    const [readings] = await pool.query(
        'SELECT * FROM iot_readings WHERE asset_id = ? ORDER BY recorded_at DESC LIMIT ?',
        [assetId, limit]
    );
    return readings;
};

exports.getTelemetryHistory = async (assetId, limit = 100) => {
    const [readings] = await pool.query(
        'SELECT sensor_type, reading_value, recorded_at FROM iot_readings WHERE asset_id = ? ORDER BY recorded_at DESC LIMIT ?',
        [assetId, limit]
    );
    return readings;
};

exports.simulateFleetTelemetry = async () => {
    const [assets] = await pool.query('SELECT id FROM assets WHERE deleted_at IS NULL');
    if (assets.length === 0) return;
    
    // Pick the first asset to be the "degrading" one for the demo scenario
    const demoAssetId = assets[0].id;

    for (const asset of assets) {
        let temp, vibration, speed;

        if (asset.id === demoAssetId) {
            // Scripted Degradation Scenario
            if (!simState[asset.id]) {
                simState[asset.id] = { temp: 65, vibration: 0.15, step: 0 };
            }
            
            let state = simState[asset.id];
            state.step += 1;
            
            // Slowly increase temperature and vibration over time to trigger an AI failure prediction
            if (state.step > 5) {
                state.temp += 1.2; // Overheating
                state.vibration += 0.05; // Rattling
            }
            
            // Reset if it gets too crazy so the demo can loop
            if (state.temp > 120) {
                simState[asset.id] = { temp: 65, vibration: 0.15, step: 0 };
            }

            temp = state.temp + (Math.random() * 2 - 1);
            vibration = state.vibration + (Math.random() * 0.02 - 0.01);
            speed = 1500 - (state.step * 10);
            
        } else {
            // Normal healthy random operation for other assets
            temp = 60 + (Math.random() * 10);
            vibration = 0.1 + (Math.random() * 0.05);
            speed = 1500 + (Math.random() * 50 - 25);
        }

        const sensorData = {
            temperature: parseFloat(temp.toFixed(2)),
            vibration: parseFloat(vibration.toFixed(3)),
            speed: parseFloat(speed.toFixed(1))
        };

        // Fire the data into the ingestion pipeline
        await exports.recordReading(asset.id, sensorData);
    }
};

let simInterval = null;
exports.startContinuousSimulation = () => {
    if (simInterval) return;
    console.log('🚀 [IoT Engine] Starting continuous background telemetry simulation...');
    simInterval = setInterval(() => {
        exports.simulateFleetTelemetry().catch(err => console.error('Simulation error:', err));
    }, 5000); // Every 5 seconds
};
