const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { requireActiveSubscription } = require('../middlewares/subscription.middleware');

router.use(authenticate);
router.use(requireActiveSubscription);

router.post('/', authorize('admin', 'manager'), inventoryController.createItem);
router.get('/', authorize('admin', 'manager', 'technician'), inventoryController.getItems);
router.put('/:id', authorize('admin', 'manager'), inventoryController.updateItem);
router.delete('/:id', authorize('admin', 'manager'), inventoryController.deleteItem);

module.exports = router;
