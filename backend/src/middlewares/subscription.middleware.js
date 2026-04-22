const subscriptionService = require('../services/subscription.service');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Validates that the company has an active SaaS subscription.
 */
const requireActiveSubscription = async (req, res, next) => {
    try {
        const sub = await subscriptionService.getCompanySubscription(req.user.company_id);
        
        if (!sub || sub.status !== 'active') {
             return errorResponse(res, 402, "Payment Required: No active subscription found for your company. Please subscribe to a plan.");
        }
        
        req.subscription = sub; // Attach for downstream use
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * SaaS Limit Middleware
 * Prevents creation of entities if the tenant's subscription plan limit has been reached.
 */
const requireFeatureLimit = (featureKey) => {
    return async (req, res, next) => {
        try {
            const hasCapacity = await subscriptionService.checkFeatureLimit(req.user.company_id, featureKey);
            
            if (!hasCapacity) {
                return errorResponse(res, 403, `Subscription Limit Reached: Your current plan does not allow more ${featureKey.replace('max_', '')}. Please upgrade your subscription.`);
            }
            
            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = {
    requireActiveSubscription,
    requireFeatureLimit
};
