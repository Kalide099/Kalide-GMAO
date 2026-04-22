const iotService = require('../services/iot.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getAssetTelemetry = async (req, res, next) => {
    try {
        const { assetId } = req.params;
        const telemetry = await iotService.getAssetTelemetry(assetId);
        return successResponse(res, 200, 'Live telemetry retrieved successfully.', telemetry);
    } catch (err) {
        next(err);
    }
};

exports.getHistory = async (req, res, next) => {
    try {
        const { assetId } = req.params;
        const history = await iotService.getTelemetryHistory(assetId);
        return successResponse(res, 200, 'Historical telemetry retrieved successfully.', history);
    } catch (err) {
        next(err);
    }
};

exports.simulateData = async (req, res, next) => {
    try {
        await iotService.simulateFleetTelemetry();
        return successResponse(res, 200, 'Fleet telemetry simulation cycle completed.');
    } catch (err) {
        next(err);
    }
};
