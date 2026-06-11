/**
 * AI Gateway Service
 * Bridge between the Node.js backend and the Python AI microservice.
 * Handles industry-to-model routing and graceful fallback when the AI service is offline.
 */

const { getEnv } = require('../config/env');
const logger = require('../config/logger');

const AI_SERVICE_URL = getEnv('AI_SERVICE_URL', 'http://localhost:8100');

/**
 * Industry → AI Model Archetype Mapping
 * Must be kept in sync with ai_service/main.py INDUSTRY_MODEL_MAP
 */
const INDUSTRY_MODEL_MAP = {
    // Model 1: Turbomachinery RUL (LSTM)
    aerospace: 'turbomachinery',
    energy: 'turbomachinery',
    oil_gas: 'turbomachinery',
    mining: 'turbomachinery',

    // Model 2: Manufacturing Failure (XGBoost)
    manufacturing: 'manufacturing',
    agrifood: 'manufacturing',

    // Model 3: Fleet APS Failure (GBM)
    logistics: 'fleet',
    construction: 'fleet',

    // Model 4: HVAC Anomaly (Isolation Forest)
    hospitality: 'hvac',
    healthcare: 'hvac',
    education: 'hvac',
    retail: 'hvac',

    // Model 5: Pipeline Anomaly (Autoencoder)
    environment: 'pipeline',
    public_works: 'pipeline'
};

/**
 * Check if the AI microservice is available.
 * @returns {Promise<boolean>}
 */
exports.isAIServiceAvailable = async () => {
    try {
        const response = await fetch(`${AI_SERVICE_URL}/ai/health`, {
            signal: AbortSignal.timeout(3000)
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data.status === 'healthy' && data.models_loaded > 0;
    } catch (err) {
        return false;
    }
};

/**
 * Get the model archetype for a given industry type.
 * @param {string} industryType
 * @returns {string|null}
 */
exports.getModelArchetype = (industryType) => {
    if (!industryType) return null;
    return INDUSTRY_MODEL_MAP[industryType.toLowerCase().trim()] || null;
};

/**
 * Request an AI prediction from the Python microservice.
 * Returns null on failure (allowing the caller to fall back to statistical methods).
 *
 * @param {string} industryType - The tenant's industry (e.g., 'manufacturing')
 * @param {object} sensorData - Sensor readings to feed the model
 * @param {string} [assetId] - Optional asset ID for context
 * @returns {Promise<object|null>} Prediction result or null on failure
 */
exports.requestAIPrediction = async (industryType, sensorData, assetId = null) => {
    const archetype = exports.getModelArchetype(industryType);
    if (!archetype) {
        logger.warn(`[AI Gateway] No model archetype mapped for industry: ${industryType}`);
        return null;
    }

    try {
        const response = await fetch(`${AI_SERVICE_URL}/ai/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                industry_type: industryType,
                sensor_data: sensorData,
                asset_id: assetId
            }),
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            logger.warn(`[AI Gateway] Prediction failed (${response.status}):`, errBody);
            return null;
        }

        const result = await response.json();
        return result;
    } catch (err) {
        // Graceful fallback — AI service is unreachable
        logger.warn(`[AI Gateway] AI service unreachable: ${err.message}. Falling back to statistical engine.`);
        return null;
    }
};

/**
 * Get full AI service health and model status.
 * @returns {Promise<object|null>}
 */
exports.getAIServiceStatus = async () => {
    try {
        const [healthRes, modelsRes] = await Promise.all([
            fetch(`${AI_SERVICE_URL}/ai/health`, { signal: AbortSignal.timeout(3000) }),
            fetch(`${AI_SERVICE_URL}/ai/models`, { signal: AbortSignal.timeout(3000) })
        ]);

        if (!healthRes.ok || !modelsRes.ok) return null;

        const health = await healthRes.json();
        const models = await modelsRes.json();

        return {
            ...health,
            ...models,
            routing_map: INDUSTRY_MODEL_MAP
        };
    } catch (err) {
        return null;
    }
};

/**
 * Export the routing map for frontend consumption.
 */
exports.INDUSTRY_MODEL_MAP = INDUSTRY_MODEL_MAP;
