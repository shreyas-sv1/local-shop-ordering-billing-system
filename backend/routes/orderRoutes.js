const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyJWT, verifyAdmin } = require('../middleware/authMiddleware');

// Create new order
router.post('/', verifyJWT, orderController.createOrder);

// Get all orders (admin gets all, customer gets their own)
router.get('/', verifyJWT, orderController.getAllOrders);

// Get orders stats (admin)
router.get('/stats/all', verifyJWT, verifyAdmin, orderController.getOrdersStats);

// Get orders count (admin)
router.get('/stats/count', verifyJWT, verifyAdmin, orderController.getOrdersCount);

// Update order status (admin)
router.put('/:id/status', verifyJWT, verifyAdmin, orderController.updateOrderStatus);

// Generate bill for order (admin)
router.post('/:id/generate-bill', verifyJWT, verifyAdmin, orderController.generateBill);

// Get bill preview (admin before generating)
router.get('/:id/bill-preview', verifyJWT, verifyAdmin, orderController.getBillPreview);

// Get bill details (customer view + admin)
router.get('/:id/bill', verifyJWT, orderController.getBillDetails);

// Get order by ID (must be last to avoid conflicts)
router.get('/:id', verifyJWT, orderController.getOrderById);

module.exports = router;
