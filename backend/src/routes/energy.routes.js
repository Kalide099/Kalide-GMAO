const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energy.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/overview', energyController.getESGOverview);
router.get('/asset/:assetId', energyController.getAssetEnergy);

module.exports = router;
