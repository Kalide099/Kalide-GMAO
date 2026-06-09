const registrationService = require('../services/registration.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.submitRequest = async (req, res, next) => {
    try {
        const { companyName, industry, adminFirstName, adminLastName, adminEmail, password, preferredLanguage, adminPhone } = req.body;
        if (!companyName || !industry || !adminFirstName || !adminLastName || !adminEmail || !password || !preferredLanguage) {
            return errorResponse(res, 400, 'Missing required registration fields.');
        }
        const result = await registrationService.createRequest(req.body);
        return successResponse(res, 201, 'Application submitted for review.', result);
    } catch (err) {
        next(err);
    }
};

exports.listRequests = async (req, res, next) => {
    try {
        const requests = await registrationService.getAllRequests();
        return successResponse(res, 200, 'Onboarding requests retrieved.', requests);
    } catch (err) {
        next(err);
    }
};

exports.handleApproval = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const processorId = req.user.id;
        
        const result = await registrationService.processRequest(id, status, processorId, notes);
        const msg = status === 'approved' ? 'Enterprise approved and activated.' : 'Application rejected.';
        return successResponse(res, 200, msg, result);
    } catch (err) {
        next(err);
    }
};
