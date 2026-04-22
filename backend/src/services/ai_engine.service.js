const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Autonomous AI Prescriptive Engine
 * Transforms raw industrial telemetry into high-authority maintenance decisions.
 */
exports.generatePrescription = async (assetId) => {
    // 1. Fetch telemetry & historical failure data
    const [telemetry] = await pool.query(
        'SELECT * FROM iot_telemetry WHERE asset_id = ? ORDER BY timestamp DESC LIMIT 100',
        [assetId]
    );

    // AI SIMULATION LOGIC (Prescriptive Model Logic)
    // In a production environment, this would call a Python/TensorFlow microservice
    // Here we implement the core decision logic
    let vibrationScore = telemetry.reduce((acc, t) => acc + (t.vibration || 0), 0) / telemetry.length;
    let tempScore = telemetry.reduce((acc, t) => acc + (t.temperature || 0), 0) / telemetry.length;

    let predictedFailureProb = (vibrationScore * 0.7) + (tempScore * 0.3) > 80 ? 0.92 : 0.15;
    let rulDays = predictedFailureProb > 0.5 ? 4 : 45;

    let recommendation = 'monitor';
    let noteEn = "Operating parameters within nominal range.";
    let noteFr = "Paramètres de fonctionnement dans la plage nominale.";

    if (predictedFailureProb > 0.8) {
        recommendation = 'repair';
        noteEn = "CRITICAL: Accelerated bearing degradation detected. Immediate overhaul recommended to prevent catastrophic failure.";
        noteFr = "CRITIQUE : Dégradation accélérée des roulements détectée. Révision immédiate recommandée pour éviter une panne catastrophique.";
    }

    const prescriptionId = uuidv4();
    await pool.query(
        `INSERT INTO ai_prescriptions (id, asset_id, prediction_score, rul_estimated_days, recommended_action, prescriptive_note_en, prescriptive_note_fr) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [prescriptionId, assetId, predictedFailureProb * 100, rulDays, recommendation, noteEn, noteFr]
    );

    // AUTO-GENERATION OF WORK ORDER IF CRITICAL
    if (recommendation === 'repair') {
        const woId = uuidv4();
        const [asset] = await pool.query('SELECT company_id, id FROM assets WHERE id = ?', [assetId]);
        
        // 1. Insert into work_orders (Main table)
        await pool.query(
            `INSERT INTO work_orders (id, company_id, asset_id, creator_id, type, priority, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [woId, asset[0].company_id, assetId, 'AI_SYSTEM_ENGINE_ROOT', 'corrective', 'critical', 'pending']
        );

        // 2. Insert translations
        await pool.query(
            `INSERT INTO work_order_translations (id, work_order_id, language_code, title) 
             VALUES (?, ?, ?, ?), (?, ?, ?, ?)`,
            [uuidv4(), woId, 'en', "AI-PRESCRIPTIVE: Urgent Hardware Correction", 
             uuidv4(), woId, 'fr', "AI-PRESCRIPTIF : Correction Matérielle Urgente"]
        );
    }

    return { 
        id: prescriptionId, 
        probability: predictedFailureProb, 
        recommendation, 
        rul: rulDays,
        note_en: noteEn
    };
};

exports.getAssetInsights = async (assetId) => {
    const [rows] = await pool.query(
        'SELECT * FROM ai_prescriptions WHERE asset_id = ? ORDER BY created_at DESC LIMIT 10',
        [assetId]
    );
    return rows;
};
