const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * GIS & Telematics Service
 * Manages spatial positioning and mobile asset telemetry (fuel, odometer).
 */
exports.getFleetLocations = async (company_id) => {
    const [rows] = await pool.query(`
        SELECT t.asset_id, t.latitude, t.longitude, t.fuel_level_percent, t.odometer_km, t.recorded_at,
               a.name_en as asset_name, a.status
        FROM asset_telemetrics t
        JOIN (
            SELECT asset_id, MAX(recorded_at) as max_time
            FROM asset_telemetrics
            GROUP BY asset_id
        ) sub ON t.asset_id = sub.asset_id AND t.recorded_at = sub.max_time
        JOIN assets a ON t.asset_id = a.id
        WHERE a.company_id = ?
    `, [company_id]);
    return rows;
};

exports.getAssetTrack = async (asset_id, hours = 24) => {
    const [rows] = await pool.query(`
        SELECT latitude, longitude, recorded_at
        FROM asset_telemetrics
        WHERE asset_id = ? AND recorded_at > DATE_SUB(NOW(), INTERVAL ? HOUR)
        ORDER BY recorded_at ASC
    `, [asset_id, hours]);
    return rows;
};

exports.recordTelemetrics = async (asset_id, data) => {
    const id = uuidv4();
    const { lat, lng, fuel, odometer } = data;
    await pool.query(`
        INSERT INTO asset_telemetrics (id, asset_id, latitude, longitude, fuel_level_percent, odometer_km)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [id, asset_id, lat, lng, fuel, odometer]);
    return { id };
};
