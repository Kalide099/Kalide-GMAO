const registrationService = require('../services/registration.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.submitRequest = async (req, res, next) => {
    try {
        const { companyName, industry, adminFirstName, adminLastName, adminEmail, password, preferredLanguage, adminPhone, plan } = req.body;
        if (!companyName || !industry || !adminFirstName || !adminLastName || !adminEmail || !password || !preferredLanguage) {
            return errorResponse(res, 400, 'Missing required registration fields.');
        }

        const normalizedEmail = String(adminEmail).trim().toLowerCase();
        const normalizedLanguage = String(preferredLanguage).trim().toLowerCase();
        const normalizedPlan = plan ? String(plan).trim().toLowerCase() : undefined;

        if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            return errorResponse(res, 400, 'Invalid admin email format.');
        }

        if (String(password).length < 8) {
            return errorResponse(res, 400, 'Password must be at least 8 characters.');
        }

        if (!['en', 'fr'].includes(normalizedLanguage)) {
            return errorResponse(res, 400, 'Invalid preferred language.');
        }

        if (normalizedPlan && !['basic', 'pro', 'enterprise'].includes(normalizedPlan)) {
            return errorResponse(res, 400, 'Invalid registration plan.');
        }

        const payload = {
            companyName: String(companyName).trim(),
            industry: String(industry).trim(),
            adminFirstName: String(adminFirstName).trim(),
            adminLastName: String(adminLastName).trim(),
            adminEmail: normalizedEmail,
            password: String(password),
            preferredLanguage: normalizedLanguage,
            adminPhone: adminPhone ? String(adminPhone).trim() : null,
            plan: normalizedPlan || 'basic'
        };

        const result = await registrationService.createRequest(payload);
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
