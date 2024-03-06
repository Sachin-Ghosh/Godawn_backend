const express = require('express');
const router = express.Router();
// const productController = require('../controllers/productController');
const qrCodeController = require('../controllers/qrCodeController');


// QR code routes
router.post('/generateQRCode', qrCodeController.generateQRCode);
router.get('/downloadQRCode/:fileName', qrCodeController.downloadQRCode);


module.exports = router;