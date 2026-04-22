const assetService = require('../services/asset.service');
const { createAssetSchema, updateAssetSchema } = require('../validations/asset.validation');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { t } = require('../utils/i18n');

exports.createAsset = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = createAssetSchema.validate(req.body);
        if (error) return errorResponse(res, 400, error.details[0].message);

        const asset = await assetService.createAsset(req.user.company_id, value);
        return successResponse(res, 201, t('common.save_success', lang), asset);
    } catch (err) {
        next(err);
    }
};

exports.getAssets = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const filters = {
            status: req.query.status
        };
        const assets = await assetService.getAssets(req.user.company_id, lang, filters);
        return successResponse(res, 200, t('assets.retrieved', lang), assets);
    } catch (err) {
        next(err);
    }
};

exports.getAssetById = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const asset = await assetService.getAssetById(req.user.company_id, req.params.id, lang);
        if (!asset) return errorResponse(res, 404, t('errors.not_found', lang));
        
        return successResponse(res, 200, t('assets.retrieved', lang), asset);
    } catch (err) {
        next(err);
    }
};

exports.updateAsset = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = updateAssetSchema.validate(req.body);
        if (error) return errorResponse(res, 400, error.details[0].message);

        const asset = await assetService.updateAsset(req.user.company_id, req.params.id, value);
        if (!asset) return errorResponse(res, 404, t('errors.not_found', lang));

        return successResponse(res, 200, t('common.save_success', lang), asset);
    } catch (err) {
        next(err);
    }
};

exports.deleteAsset = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const deleted = await assetService.deleteAsset(req.user.company_id, req.params.id);
        if (!deleted) return errorResponse(res, 404, t('errors.not_found', lang));

        return successResponse(res, 200, t('common.delete_success', lang));
    } catch (err) {
        next(err);
    }
};
