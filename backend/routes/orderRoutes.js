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

// Get order by ID
router.get('/:id', orderController.getOrderById);

module.exports = router;
