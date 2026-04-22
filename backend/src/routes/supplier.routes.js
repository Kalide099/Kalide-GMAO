const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', supplierController.getSuppliers);
router.post('/', supplierController.createSupplier);

module.exports = router;
