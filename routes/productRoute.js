const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

// Add new product
router.post('/', productController.addProduct);

// Implement routes for other CRUD operations
router.put('/:id', productController.updateProduct);

// Delete product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
