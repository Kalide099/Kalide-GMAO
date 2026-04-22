const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iot.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/asset/:assetId', authorize('admin', 'manager', 'technician'), iotController.getAssetTelemetry);
router.get('/history/:assetId', authorize('admin', 'manager', 'technician'), iotController.getHistory);
router.post('/simulate', authorize('admin'), iotController.simulateData);

module.exports = router;
