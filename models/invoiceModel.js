// models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  invoiceDate: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending',
  },
  // Add more fields as needed
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Middleware to calculate totalPrice before saving
invoiceSchema.pre('save', function (next) {
    this.totalPrice = this.quantity * this.unitPrice;
    next();
  });

module.exports = mongoose.model('Invoice', invoiceSchema);
