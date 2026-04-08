const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get orders stats
router.get('/stats/all', orderController.getOrdersStats);

// Get orders count
router.get('/stats/count', orderController.getOrdersCount);

// Update order status (admin)
router.put('/:id/status', orderController.updateOrderStatus);

// Generate bill for order (admin)
router.post('/:id/generate-bill', orderController.generateBill);

// Get bill preview (admin before generating)
router.get('/:id/bill-preview', orderController.getBillPreview);

// Get bill details (customer view)
router.get('/:id/bill', orderController.getBillDetails);

// Get order by ID (must be last to avoid conflicts)
router.get('/:id', orderController.getOrderById);

module.exports = router;
