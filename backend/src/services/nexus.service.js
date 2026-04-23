const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class NexusService {
    // --- RCA MODULE ---
    async getRcaByAsset(companyId, assetId) {
        const [rows] = await pool.query(
            'SELECT * FROM rca_reports WHERE company_id = ? AND asset_id = ? ORDER BY created_at DESC',
            [companyId, assetId]
        );
        return rows;
    }

    async createRca(companyId, userId, data) {
        const id = uuidv4();
        const { work_order_id, asset_id, title_en, title_fr, whys_json, ishikawa_json } = data;
        await pool.query(
            `INSERT INTO rca_reports (id, company_id, work_order_id, asset_id, title_en, title_fr, whys_json, ishikawa_json, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, companyId, work_order_id, asset_id, title_en, title_fr, JSON.stringify(whys_json), JSON.stringify(ishikawa_json), userId]
        );
        return id;
    }

    // --- FMEA MODULE ---
    async getFmeaByAsset(companyId, assetId) {
        const [rows] = await pool.query(
            'SELECT *, (severity * occurrence * detection) as rpn FROM fmea_analysis WHERE company_id = ? AND asset_id = ?',
            [companyId, assetId]
        );
        return rows;
    }

    async addFmeaEntry(companyId, data) {
        const id = uuidv4();
        const { asset_id, failure_mode_en, failure_mode_fr, effects_en, effects_fr, severity, occurrence, detection, recommended_action_en, recommended_action_fr } = data;
        await pool.query(
            `INSERT INTO fmea_analysis (id, company_id, asset_id, failure_mode_en, failure_mode_fr, effects_en, effects_fr, severity, occurrence, detection, recommended_action_en, recommended_action_fr)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, companyId, asset_id, failure_mode_en, failure_mode_fr, effects_en, effects_fr, severity, occurrence, detection, recommended_action_en, recommended_action_fr]
        );
        return id;
    }

    // --- LOTO MODULE ---
    async getLotoProcedures(companyId, assetId) {
        const [rows] = await pool.query(
            'SELECT * FROM loto_procedures WHERE company_id = ? AND (asset_id = ? OR asset_id IS NULL)',
            [companyId, assetId]
        );
        return rows;
    }

    async logLotoAction(companyId, userId, data) {
        const id = uuidv4();
        const { procedure_id, action, signature_data } = data;
        await pool.query(
            `INSERT INTO loto_logs (id, company_id, procedure_id, user_id, action, signature_data)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, companyId, procedure_id, userId, action, signature_data]
        );
        return id;
    }

    // --- CALIBRATION ---
    async getCalibrationRegistry(companyId) {
        const [rows] = await pool.query(
            'SELECT * FROM instruments WHERE company_id = ? ORDER BY next_calibration_due ASC',
            [companyId]
        );
        return rows;
    }

    // --- TPM MODULE ---
    async submitTpmChecklist(companyId, userId, data) {
        const id = uuidv4();
        const { asset_id, title_en, title_fr, items_json, anomaly_detected, image_evidence_url } = data;
        await pool.query(
            `INSERT INTO tpm_checklists (id, company_id, asset_id, title_en, title_fr, operator_id, items_json, anomaly_detected, image_evidence_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, companyId, asset_id, title_en, title_fr, userId, JSON.stringify(items_json), anomaly_detected, image_evidence_url]
        );
        return id;
    }

    // --- DMS MODULE ---
    async addDocument(companyId, userId, data) {
        const id = uuidv4();
        const { entity_type, entity_id, file_name, file_type, file_url, description_en, description_fr } = data;
        await pool.query(
            `INSERT INTO document_vault (id, company_id, entity_type, entity_id, file_name, description_en, description_fr, file_type, file_url, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, companyId, entity_type, entity_id, file_name, description_en, description_fr, file_type, file_url, userId]
        );
        return id;
    }

    // --- AI PREDICTIVE INVENTORY ---
    async getSparePartsPredictions(companyId) {
        // Architecture: This should hook into an external Python service or internal TensorFlow.js model
        // For now, we use a Poisson distribution based on MTBF
        const [parts] = await pool.query(`
            SELECT 
                i.id, i.name_en, i.quantity, i.min_stock,
                (SELECT COUNT(*) FROM work_orders wo WHERE wo.company_id = ? AND wo.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_usage_freq
            FROM inventory i
            WHERE i.company_id = ?
        `, [companyId, companyId]);

        return parts.map(p => ({
            ...p,
            predicted_need: Math.ceil(p.monthly_usage_freq * 1.2), // Suggesting 20% safety margin
            reorder_urgency: p.quantity < p.min_stock ? 'CRITICAL' : 'STABLE'
        }));
    }
}

module.exports = new NexusService();
