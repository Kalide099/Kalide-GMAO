const express = require('express');
const router = express.Router();
const gisController = require('../controllers/gis.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/fleet', gisController.getFleet);
router.get('/track/:assetId', gisController.getTrack);

module.exports = router;
