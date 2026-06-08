const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/overview', financeController.getOverview);
router.get('/asset/:assetId', financeController.getAssetDetails);

router.get('/contracts', financeController.getContracts);
router.post('/contracts', financeController.createContract);
router.patch('/contracts/:id/archive', financeController.archiveContract);

router.get('/budgets', financeController.getBudgets);
router.post('/budgets', financeController.createBudget);

module.exports = router;
