// productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const qrCodeController = require('../controllers/qrCodeController');
// const recentActivityController = require('../controllers/recentActivityController');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Add new product
router.post('/', productController.addProduct);
router.post('/', productController.addProductFromQR);

// Update product
router.put('/:id', productController.updateProduct);

// Delete product by ID
router.delete('/:id', productController.deleteProduct);


// // QR code routes
// router.post('/generateQRCode', qrCodeController.generateQRCode);
// router.get('/downloadQRCode/:fileName', qrCodeController.downloadQRCode);

// Route to add product from scanned QR code data
router.post('/addProductFromQR', productController.addProductFromQR);

// Get recent activities
// router.get('/recent-activities', recentActivityController.getRecentActivities);

module.exports = router;

