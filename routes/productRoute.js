// productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const recentActivityController = require('../controllers/recentActivityController');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Add new product
router.post('/', productController.addProduct);

// Update product
router.put('/:id', productController.updateProduct);

// Delete product by ID
router.delete('/:id', productController.deleteProduct);

// Get recent activities
// router.get('/recent-activities', recentActivityController.getRecentActivities);

module.exports = router;

