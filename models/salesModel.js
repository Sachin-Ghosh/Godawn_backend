// salesModel.js
const mongoose = require("mongoose");
const Product = require("./productModel"); 

const salesSchema = new mongoose.Schema({

  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  
  buyerName: { type: String, required: true },
  soldQuantity: { type: Number ,required :true},
//   type: { type: String },
//   unitPrice: { type: Number },
//   totalPrice: { type: Number },
  // Add more fields as needed
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
}, { timestamps: true });

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
