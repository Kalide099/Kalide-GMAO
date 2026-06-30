const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, enforceMfa } = require('../middlewares/auth.middleware');
const { checkSuperAdmin } = require('../middlewares/admin.middleware');

// Root Enforcement: Every single route here must pass JWT Auth AND Super Admin validations implicitly
router.use(authenticate);
router.use(enforceMfa);
router.use(checkSuperAdmin);

router.get('/analytics', adminController.getPlatformAnalytics);
router.get('/companies', adminController.getAllCompanies);
router.patch('/company/:id/status', adminController.updateCompanyStatus);
router.patch('/company/:id/plan', adminController.updateCompanyPlan);
router.patch('/company/:id/modules', adminController.updateCompanyModules);
router.get('/company/:id/impersonate', adminController.impersonateCompany);
router.delete('/company/:id', adminController.deleteCompany);
router.get('/user/:userId/impersonate', adminController.impersonateUser);
router.get('/logs', adminController.getGlobalAuditLogs);
router.get('/users', adminController.getAllUsers);
router.patch('/user/:id/status', adminController.updateUserStatus);
router.delete('/user/:id', adminController.deleteUser);
router.get('/user/:id/audit', adminController.getUserAuditLogs);
router.get('/payments', adminController.getAllPayments);
router.post('/seed', adminController.seedDemoData);

// Plan request management
router.get('/plan-requests', adminController.listPlanRequests);
router.patch('/plan-request/:id/process', adminController.processPlanRequest);

module.exports = router;
