const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/overview', warehouseController.getOverview);
router.get('/location/:locationId', warehouseController.getLocationStock);
router.post('/transfer', warehouseController.transfer);

module.exports = router;
