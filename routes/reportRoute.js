// routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const productController = require( '../controllers/productController' );

// Calculate total products sold on a specific date
router.get('/totalProductsSold/:year/:month/:day', salesController.getTotalProductsSoldOnDate);

// Calculate total products sold in a specific month
router.get('/totalProductsSold/:year/:month', salesController.getTotalProductsSoldInMonth);

// Calculate total products sold in a specific year
router.get('/totalProductsSold/:year', salesController.getTotalProductsSoldInYear);
// Calculate total quantity sold for a specific product ID
router.get('/totalQuantitySold/:products', salesController.getTotalQuantitySoldForProduct);


// Calculate total products added on a specific date
router.get('/totalProductsAdded/:year/:month/:day', productController.getTotalProductsAddedOnDate);

// Calculate total products added in a specific month
router.get('/totalProductsAdded/:year/:month', productController.getTotalProductsAddedInMonth);

// Calculate total products added in a specific year
router.get('/totalProductsAdded/:year', productController.getTotalProductsAddedInYear);


module.exports = router;
