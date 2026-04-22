const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { requireActiveSubscription, requireFeatureLimit } = require('../middlewares/subscription.middleware');

// All asset routes require authentication and active SaaS billing
router.use(authenticate);
router.use(requireActiveSubscription);

// Only admin and manager can create, update, delete assets
router.post('/', authorize('admin', 'manager'), requireFeatureLimit('max_assets'), assetController.createAsset);
router.put('/:id', authorize('admin', 'manager'), assetController.updateAsset);
router.delete('/:id', authorize('admin', 'manager'), assetController.deleteAsset);

// All roles (including technicians/clients) can view assets
router.get('/', authorize('admin', 'manager', 'technician', 'client'), assetController.getAssets);
router.get('/:id', authorize('admin', 'manager', 'technician', 'client'), assetController.getAssetById);

module.exports = router;
