const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const companyController = require('../controllers/company.controller');

// Get the authenticated user's own company details (tenant-isolated)
router.get('/my-company', authenticate, companyController.getCompanyDetails);

// Get dashboard statistics for the authenticated user's tenant
router.get('/my-company/dashboard-stats', authenticate, companyController.getDashboardStats);

// Plan request flow (no subscription check — accessible even without active plan)
router.post('/request-plan', authenticate, companyController.requestPlan);
router.get('/my-plan-request', authenticate, companyController.getMyPlanRequest);

module.exports = router;
