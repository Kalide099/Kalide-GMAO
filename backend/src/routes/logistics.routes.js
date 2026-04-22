const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logistics.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/overview', logisticsController.getLogisticsOverview);

module.exports = router;
