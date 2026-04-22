const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/work_order.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { requireActiveSubscription } = require('../middlewares/subscription.middleware');

router.use(authenticate);
router.use(requireActiveSubscription);

// Creation
router.post('/', authorize('admin', 'manager', 'technician'), workOrderController.createWorkOrder);

// Retrieve
router.get('/', authorize('admin', 'manager', 'technician', 'client'), workOrderController.getWorkOrders);
router.get('/:id', authorize('admin', 'manager', 'technician', 'client'), workOrderController.getWorkOrderById);

// Updating Status
router.put('/:id/status', authorize('admin', 'manager', 'technician'), workOrderController.updateStatus);
router.post('/:id/comments', authorize('admin', 'manager', 'technician'), workOrderController.addComment);
router.delete('/:id', authorize('admin', 'manager'), workOrderController.deleteWorkOrder);

module.exports = router;
