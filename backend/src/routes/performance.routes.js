const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performance.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/workforce', performanceController.getTeamPerformance);

module.exports = router;
