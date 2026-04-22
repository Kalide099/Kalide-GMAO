const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public route for companies to apply
router.post('/apply', registrationController.submitRequest);

// Superadmin only routes
router.get('/list', authenticate, authorize('super_admin'), registrationController.listRequests);
router.post('/:id/process', authenticate, authorize('super_admin'), registrationController.handleApproval);

module.exports = router;
