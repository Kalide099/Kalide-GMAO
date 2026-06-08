const financeService = require('../services/finance.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getOverview = async (req, res, next) => {
    try {
        const overview = await financeService.getCompanyFinanceOverview(req.user.company_id);
        return successResponse(res, 200, "Finance overview retrieved.", overview);
    } catch (err) {
        next(err);
    }
};

exports.getContracts = async (req, res, next) => {
    try {
        const list = await financeService.getContracts(req.user.company_id);
        return successResponse(res, 200, "Contracts retrieved.", list);
    } catch (err) {
        next(err);
    }
};

exports.getBudgets = async (req, res, next) => {
    try {
        const list = await financeService.getBudgets(req.user.company_id);
        return successResponse(res, 200, "Budgets retrieved.", list);
    } catch (err) {
        next(err);
    }
};

exports.createContract = async (req, res, next) => {
    try {
        const item = await financeService.createContract(req.user.company_id, req.body);
        return successResponse(res, 201, "Contract initialized.", item);
    } catch (err) {
        next(err);
    }
};

exports.createBudget = async (req, res, next) => {
    try {
        const item = await financeService.createBudget(req.user.company_id, req.body);
        return successResponse(res, 201, "Budget defined.", item);
    } catch (err) {
        next(err);
    }
};

exports.archiveContract = async (req, res, next) => {
    try {
        const archived = await financeService.archiveContract(req.user.company_id, req.params.id);
        if (!archived) {
            return errorResponse(res, 404, 'Contract not found.');
        }

        return successResponse(res, 200, 'Contract archived.');
    } catch (err) {
        next(err);
    }
};

exports.getAssetDetails = async (req, res) => {
    try {
        const details = await financeService.getAssetFinancials(req.user.company_id, req.params.assetId);
        if (!details) return res.status(404).json({ success: false, message: 'Financial model not found for this asset.' });
        res.json({ success: true, data: details });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
