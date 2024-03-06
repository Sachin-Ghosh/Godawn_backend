// qrCodeController.js

const QRCode = require('../models/qrCodeModel');
const qr = require('qr-image');

exports.generateQRCode = async (req, res) => {
    try {
      console.log('Request Body:', req.body); // Log the request body
  
      const { data, fileName } = req.body;
  
      // Check if data is undefined
      if (!data) {
        throw new Error('Data is empty');
      }
  
      // Generate QR code image
      const qrImageData = qr.imageSync(data, { type: 'png' });
  
      // Save QR code to database
      const qrCode = new QRCode({
        data,
        fileName,
      });
      await qrCode.save();
  
      // Send the QR code image as a response
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(qrImageData);
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

// exports.downloadQRCode = async (req, res) => {
//   try {
//     const { fileName } = req.params;

//     // Find the QR code by fileName
//     const qrCode = await QRCode.findOne({ fileName });

//     if (!qrCode) {
//       return res.status(404).json({ message: 'QR code not found' });
//     }

//     // Send the QR code image as a response
//     res.setHeader('Content-disposition', `attachment; filename=${qrCode.fileName}`);
//     res.setHeader('Content-type', 'image/png');
//     res.end(Buffer.from(qrCode.data, 'base64'));
//   } catch (error) {
//     console.error('Error downloading QR code:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


exports.downloadQRCode = async (req, res) => {
    try {
      const { fileName } = req.params;
  
      // Find the QR code by fileName
      const qrCode = await QRCode.findOne({ fileName });
  
      if (!qrCode) {
        return res.status(404).json({ message: 'QR code not found' });
      }
  
      // Set the content type header based on the image format
      const contentType = 'image/png'; // Assuming the QR code image format is PNG
      res.setHeader('Content-disposition', `attachment; filename=${qrCode.fileName}.png`);
      res.setHeader('Content-type', contentType);
  
      // Send the QR code image as a response
      res.end(Buffer.from(qrCode.data, 'base64'));
    } catch (error) {
      console.error('Error downloading QR code:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  