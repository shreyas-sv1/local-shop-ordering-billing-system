const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Add new product (admin)
router.post('/', productController.addProduct);

// Update product (admin)
router.put('/:id', productController.updateProduct);

// Delete product (admin)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
