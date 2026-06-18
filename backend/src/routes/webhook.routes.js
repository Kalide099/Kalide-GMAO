const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Important: Webhook route needs raw body for Stripe signature verification
// We use express.raw before express.json parsing applies
router.post('/stripe', express.raw({ type: 'application/json' }), webhookController.stripeWebhook);

module.exports = router;
