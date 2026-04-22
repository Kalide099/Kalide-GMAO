const inventoryService = require('../services/inventory.service');
const { createInventorySchema } = require('../validations/inventory.validation');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createItem = async (req, res, next) => {
    try {
        const { error, value } = createInventorySchema.validate(req.body);
        if (error) return errorResponse(res, 400, error.details[0].message);

        const item = await inventoryService.createItem(req.user.company_id, value);
        return successResponse(res, 201, 'Inventory item created natively.', item);
    } catch (err) {
        next(err);
    }
};

exports.getItems = async (req, res, next) => {
    try {
        const items = await inventoryService.getItems(req.user.company_id, req.lang);
        return successResponse(res, 200, 'Inventory retrieved globally securely.', items);
    } catch (err) {
        next(err);
    }
};

exports.updateItem = async (req, res, next) => {
    try {
        const { error, value } = createInventorySchema.validate(req.body);
        if (error) return errorResponse(res, 400, error.details[0].message);

        const item = await inventoryService.updateItem(req.user.company_id, req.params.id, value);
        if (!item) return errorResponse(res, 404, 'Inventory item not found inside this tenant space.');

        return successResponse(res, 200, 'Inventory item updated successfully.', item);
    } catch (err) {
        next(err);
    }
};

exports.deleteItem = async (req, res, next) => {
    try {
        const success = await inventoryService.deleteItem(req.user.company_id, req.params.id);
        if (!success) return errorResponse(res, 404, 'Item not found in current multi-tenant context.');

        return successResponse(res, 200, 'Inventory item deleted natively.');
    } catch (err) {
        next(err);
    }
};
