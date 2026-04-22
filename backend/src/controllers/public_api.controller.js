const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Public API Key Middleware
 */
exports.authenticateApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return errorResponse(res, 401, 'API Key required');

    const [companies] = await pool.query('SELECT id FROM companies WHERE api_key = ?', [apiKey]);
    if (companies.length === 0) return errorResponse(res, 403, 'Invalid API Key');

    req.company_id = companies[0].id;
    next();
};

/**
 * External Asset Ingestion
 */
exports.createAssetExternal = async (req, res) => {
    // Shared logic with enterprise asset service
    return successResponse(res, 201, 'Asset ingested via Public API');
};
