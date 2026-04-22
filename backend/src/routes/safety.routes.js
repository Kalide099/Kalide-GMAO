const express = require('express');
const router = express.Router();
const safetyController = require('../controllers/safety.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// All EHS routes are protected
router.use(authenticate);

router.get('/pending', safetyController.getPending);
router.get('/stats', safetyController.getStats);
router.post('/request', safetyController.requestPermit);
router.post('/validate', safetyController.approvePermit);

module.exports = router;
