const customFormService = require('../services/custom_form.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { t } = require('../utils/i18n');

exports.getCustomForms = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const list = await customFormService.getCustomForms(req.user.company_id);
        return successResponse(res, 200, t('protocols.retrieved', lang), list);
    } catch (err) {
        next(err);
    }
};

exports.createCustomForm = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const item = await customFormService.createCustomForm(req.user.company_id, req.body);
        return successResponse(res, 201, t('protocols.defined', lang), item);
    } catch (err) {
        next(err);
    }
};
