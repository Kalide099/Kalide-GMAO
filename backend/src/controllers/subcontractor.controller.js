const subcontractorService = require('../services/subcontractor.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getSubcontractors = async (req, res, next) => {
    try {
        const list = await subcontractorService.getSubcontractors(req.user.company_id);
        return successResponse(res, 200, "Subcontractors retrieved.", list);
    } catch (err) {
        next(err);
    }
};

exports.createSubcontractor = async (req, res, next) => {
    try {
        const sub = await subcontractorService.createSubcontractor(req.user.company_id, req.body);
        return successResponse(res, 201, "Subcontractor registered.", sub);
    } catch (err) {
        next(err);
    }
};
