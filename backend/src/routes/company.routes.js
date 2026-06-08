const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const companyController = require('../controllers/company.controller');

// Get the authenticated user's own company details (tenant-isolated)
router.get('/my-company', authenticate, companyController.getCompanyDetails);

// Get dashboard statistics for the authenticated user's tenant
router.get('/my-company/dashboard-stats', authenticate, companyController.getDashboardStats);

module.exports = router;
