    const mongoose = require('mongoose');

    const productSchema = new mongoose.Schema({
        // productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },

    type: {
        type: String,
        required: true,
    }, 
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    // Add more fields as needed
    });

    module.exports = mongoose.model('Product', productSchema);
