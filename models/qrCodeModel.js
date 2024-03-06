// qrCodeModel.js

const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
