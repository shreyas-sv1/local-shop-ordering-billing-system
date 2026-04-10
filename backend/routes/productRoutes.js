const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyJWT, verifyAdmin } = require('../middleware/authMiddleware');

// Get all products (public)
router.get('/', productController.getAllProducts);

// Get product by ID (public)
router.get('/:id', productController.getProductById);

// Add new product (admin)
router.post('/', verifyJWT, verifyAdmin, productController.addProduct);

// Update product (admin)
router.put('/:id', verifyJWT, verifyAdmin, productController.updateProduct);

// Delete product (admin)
router.delete('/:id', verifyJWT, verifyAdmin, productController.deleteProduct);

module.exports = router;
