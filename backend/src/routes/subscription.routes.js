const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Authentication required for initiating checkouts and viewing status
router.get('/status', authenticate, authorize('admin', 'manager'), subscriptionController.getSubscriptionStatus);
router.post('/upgrade', authenticate, authorize('admin'), subscriptionController.upgradeSubscription);

// Webhooks DO NOT use JWT Auth natively, they process signature signatures directly against the Request Payload (Skipped for brevity here)
// router.post('/webhooks/:provider', webhookController);

module.exports = router;
