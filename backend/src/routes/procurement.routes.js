const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurement.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// All procurement routes require authentication
router.use(authenticate);

router.get('/', procurementController.getOrders);
router.post('/', procurementController.createOrder);
router.patch('/:id/status', procurementController.updateStatus);

module.exports = router;
