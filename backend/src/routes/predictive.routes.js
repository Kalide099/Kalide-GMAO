const express = require('express');
const router = express.Router();
const predictiveController = require('../controllers/predictive.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', authorize('admin', 'manager'), predictiveController.getFleetOverview);
router.get('/asset/:assetId', authorize('admin', 'manager'), predictiveController.getAssetPredictions);

module.exports = router;
