const predictiveService = require('../services/predictive.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getAssetPredictions = async (req, res, next) => {
    try {
        const { assetId } = req.params;
        const lang = req.lang || 'en';
        const metrics = await predictiveService.calculateAssetMetrics(req.user.company_id, assetId);
        
        // Localize recommendation
        metrics.recommendation = metrics.recommendations[lang] || metrics.recommendations['en'];
        delete metrics.recommendations;

        return successResponse(res, 200, 'Predictive telemetry calculated successfully.', metrics);
    } catch (err) {
        next(err);
    }
};

exports.getFleetOverview = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const overview = await predictiveService.getFleetPredictiveOverview(req.user.company_id, lang);
        
        // Map recommendation based on language in controller or service
        const localizedOverview = overview.map(item => ({
            ...item,
            recommendation: item.recommendations[lang] || item.recommendations['en']
        }));

        return successResponse(res, 200, 'Fleet predictive intelligence retrieved.', localizedOverview);
    } catch (err) {
        next(err);
    }
};
