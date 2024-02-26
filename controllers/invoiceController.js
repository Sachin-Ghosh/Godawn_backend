// controllers/invoiceController.js
const Invoice = require('../models/invoiceModel');

// Create new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { customerName, productName, quantity, unitPrice, totalPrice, invoiceDate, paymentStatus } = req.body;
    const invoice = new Invoice({ customerName, productName, quantity, unitPrice, totalPrice, invoiceDate, paymentStatus });
    await invoice.save();
    res.status(201).json({ success: true, invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json({ success: true, invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    console.error('Error fetching invoice by ID:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Update invoice by ID
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, productName, quantity, unitPrice, totalPrice, invoiceDate, paymentStatus } = req.body;
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { customerName, productName, quantity, unitPrice, totalPrice, invoiceDate, paymentStatus },
      { new: true }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.status(200).json({ success: true, updatedInvoice });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Delete invoice by ID
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
