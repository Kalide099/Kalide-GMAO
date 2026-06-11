const predictiveService = require('../services/predictive.service');
const aiGateway = require('../services/ai_gateway.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getAssetPredictions = async (req, res, next) => {
    try {
        const { assetId } = req.params;
        const lang = req.lang || 'en';
        const metrics = await predictiveService.calculateAssetMetrics(req.user.company_id, assetId);
        
        // Localize recommendation
        metrics.recommendation = metrics.recommendations[lang] || metrics.recommendations['en'];
        delete metrics.recommendations;

        // Localize AI prediction notes if present
        if (metrics.aiPrediction) {
            const noteKey = lang === 'fr' ? 'note_fr' : 'note_en';
            metrics.aiPrediction.note = metrics.aiPrediction[noteKey] || metrics.aiPrediction.note_en;
            delete metrics.aiPrediction.note_en;
            delete metrics.aiPrediction.note_fr;
        }

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
        const localizedOverview = overview.map(item => {
            const localized = {
                ...item,
                recommendation: item.recommendations[lang] || item.recommendations['en']
            };
            delete localized.recommendations;

            // Localize AI prediction notes if present
            if (localized.aiPrediction) {
                const noteKey = lang === 'fr' ? 'note_fr' : 'note_en';
                localized.aiPrediction.note = localized.aiPrediction[noteKey] || localized.aiPrediction.note_en;
                delete localized.aiPrediction.note_en;
                delete localized.aiPrediction.note_fr;
            }

            return localized;
        });

        return successResponse(res, 200, 'Fleet predictive intelligence retrieved.', localizedOverview);
    } catch (err) {
        next(err);
    }
};

exports.getAIStatus = async (req, res, next) => {
    try {
        const status = await aiGateway.getAIServiceStatus();

        if (!status) {
            return successResponse(res, 200, 'AI service is currently offline. Statistical fallback active.', {
                ai_available: false,
                fallback_active: true,
                message: 'The AI microservice is not running. Predictions use MTBF/MTTR statistical analysis.'
            });
        }

        return successResponse(res, 200, 'AI engine status retrieved.', {
            ai_available: true,
            fallback_active: false,
            ...status
        });
    } catch (err) {
        next(err);
    }
};
