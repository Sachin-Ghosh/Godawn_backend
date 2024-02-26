// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Create new invoice
router.post('/', invoiceController.createInvoice);

// Get all invoices
router.get('/', invoiceController.getAllInvoices);

// Get invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Update invoice by ID
router.put('/:id', invoiceController.updateInvoice);

// Delete invoice by ID
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
