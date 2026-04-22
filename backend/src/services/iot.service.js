const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Enterprise IoT Digital Twin Engine
 * Manages real-time telemetry ingestion and automated anomaly detection.
 */

exports.recordReading = async (assetId, sensorType, value) => {
    // 1. Persist telemetry reading
    await pool.query(
        'INSERT INTO iot_readings (asset_id, sensor_type, reading_value) VALUES (?, ?, ?)',
        [assetId, sensorType, value]
    );

    // 2. Anomaly Detection Logic
    const [config] = await pool.query(
        'SELECT * FROM asset_sensor_configs WHERE asset_id = ? AND sensor_type = ? AND is_active = 1',
        [assetId, sensorType]
    );

    if (config.length > 0) {
        const { max_threshold, min_threshold } = config[0];
        
        if ((max_threshold && value > max_threshold) || (min_threshold && value < min_threshold)) {
            await exports.triggerAnomalyWorkOrder(assetId, sensorType, value, config[0]);
        }
    }
};

exports.triggerAnomalyWorkOrder = async (assetId, sensorType, value, config) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // Fetch company_id for the asset
        const [asset] = await connection.query('SELECT company_id FROM assets WHERE id = ?', [assetId]);
        if (asset.length === 0) return;

        const companyId = asset[0].company_id;
        const woId = uuidv4();

        // Check if an active anomaly work order already exists to avoid spam
        const [existing] = await connection.query(
            "SELECT wo.id FROM work_orders wo JOIN work_order_translations wot ON wo.id = wot.work_order_id WHERE wo.asset_id = ? AND wo.status = 'pending' AND wot.title LIKE '%IoT Anomaly%'",
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
            const titleEn = `[IoT Anomaly] ${sensorType.toUpperCase()} out of bounds`;
            const titleFr = `[Anomalie IoT] ${sensorType.toUpperCase()} hors limites`;
            const descEn = `Automated alert: Sensor ${sensorType} recorded ${value}${config.unit}, exceeding threshold of ${config.max_threshold}${config.unit}.`;
            const descFr = `Alerte automatisée: Le capteur ${sensorType} a enregistré ${value}${config.unit}, dépassant le seuil de ${config.max_threshold}${config.unit}.`;

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
                [companyId, woId, '00000000-0000-0000-0000-000000000000', 'system_anomaly_detected', 'pending']
            );

            console.log(`📡 [IoT Engine] Critical anomaly detected on ${assetId}. Work order ${woId} dispatched.`);
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
    
    for (const asset of assets) {
        const temp = 60 + (Math.random() * 15);
        await exports.recordReading(asset.id, 'temperature', temp);

        const vibration = 0.1 + (Math.random() * 0.4);
        await exports.recordReading(asset.id, 'vibration', vibration);
    }
};
