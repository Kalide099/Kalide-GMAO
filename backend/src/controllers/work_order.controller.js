const workOrderService = require('../services/work_order.service');
const { createWorkOrderSchema, updateWorkOrderStatusSchema } = require('../validations/work_order.validation');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { t } = require('../utils/i18n');

exports.createWorkOrder = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = createWorkOrderSchema.validate(req.body);
        if (error) return errorResponse(res, 400, error.details[0].message);

        const workOrder = await workOrderService.createWorkOrder(req.user.company_id, req.user.id, value);
        return successResponse(res, 201, t('common.save_success', lang), workOrder);
    } catch (err) {
        if (err.message === 'Invalid asset ID') {
            return errorResponse(res, 400, t('errors.validation_fail', req.lang));
        }
        next(err);
    }
};

exports.getWorkOrders = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const filters = {
            status: req.query.status,
            assetId: req.query.assetId
        };
        const workOrders = await workOrderService.getWorkOrders(req.user.company_id, lang, filters);
        return successResponse(res, 200, t('common.retrieved', lang), workOrders);
    } catch (err) {
        next(err);
    }
};

exports.getWorkOrderById = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const workOrder = await workOrderService.getWorkOrderById(req.user.company_id, req.params.id, lang);
        if (!workOrder) return errorResponse(res, 404, t('errors.not_found', lang));

        return successResponse(res, 200, t('common.retrieved', lang), workOrder);
    } catch (err) {
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = updateWorkOrderStatusSchema.validate(req.body);
        if (error) return errorResponse(res, 400, error.details[0].message);

        const workOrder = await workOrderService.updateWorkOrderStatus(
            req.user.company_id, 
            req.user.id,
            req.params.id, 
            value.status, 
            value.completedDate || null
        );

        return successResponse(res, 200, t('common.update_success', lang), workOrder);
    } catch (err) {
        if (err.message === 'Work order not found') {
            return errorResponse(res, 404, t('errors.not_found', req.lang));
        }
        next(err);
    }
};

exports.addComment = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { comment } = req.body;
        if (!comment) return errorResponse(res, 400, t('errors.comment_required', lang));

        const newComment = await workOrderService.addComment(
            req.user.company_id,
            req.user.id,
            req.params.id,
            comment
        );

        return successResponse(res, 201, t('common.comment_added', lang), newComment);
    } catch (err) {
        next(err);
    }
};
exports.deleteWorkOrder = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const deleted = await workOrderService.deleteWorkOrder(req.user.company_id, req.params.id);
        if (!deleted) return errorResponse(res, 404, t('errors.not_found', lang));

        return successResponse(res, 200, t('common.delete_success', lang));
    } catch (err) {
        next(err);
    }
};
