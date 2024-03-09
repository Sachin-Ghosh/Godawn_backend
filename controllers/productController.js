// const Product = require('../models/productModel');
const Product = require("../models/productModel");
const mongoose = require('mongoose');
// const QRCode = require('qrcode');
const fs = require('fs');
const qr = require('qr-image');
// const RecentActivity = require('../models/recentActivityModel');


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    // const products = await Product.find();

    const totalCount = await Product.countDocuments();

    const products = await Product.find()
      .sort({ created: -1 }) // Change to your preferred field for sorting

    res.json({ 
      products,
      totalCount,
    });

    // res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Read all sales with pagination
// exports.getProducts = async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const pageSize = parseInt(req.query.pageSize) || 10; // Set a default page size
  
//       const totalCount = await Product.countDocuments();
//       const totalPages = Math.ceil(totalCount / pageSize);
  
//       const products = await Product.find()
//         .sort({ createdAt: -1 }) // Change to your preferred field for sorting
//         .skip((page - 1) * pageSize)
//         .limit(pageSize);
  
//       res.json({
//         products,
//         page,
//         pageSize,
//         totalCount,
//         totalPages,
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

//   // Get total quantities of all products in the inventory
// exports.getTotalQuantities = async (req, res) => {
//   try {
//     const totalQuantities = await Product.aggregate([
//       { $group: { _id: null, total: { $sum: '$quantity' } } }
//     ]);
//     // Send the total quantities as a JSON response
//     res.json({ totalQuantities: totalQuantities[0]?.total || 0 });
//   } catch (error) {
//     // Handle errors
//     console.error('Error fetching total quantities:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
  

// Add new product
exports.addProduct = async (req, res) => {
  try {
    // const { type, name, description, unitPrice, quantity } = req.body;
    const product = new Product(req.body);
    await product.save();

    //  // Record recent activity
    //  const activity = new RecentActivity({
    //     action: 'Create',
    //     productId: product._id,
    //     timestamp: new Date(),
    //   });
    //   await activity.save();
      
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Implement update, delete, and other CRUD operations similarly

exports.updateProduct = async (req, res) => {
    try {
    //   const { id } = req.params;
    //   const { type, name, description, unitPrice, quantity } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    //   const updatedProduct = await Product.findByIdAndUpdate(
    //     id,
    //     { type, name, description, unitPrice, quantity },
    //     { new: true }
    //   );

     // Record recent activity
    //  const activity = new RecentActivity({
    //     action: 'Update',
    //     productId: updatedProduct._id,
    //     timestamp: new Date(),
    //   });
    //   await activity.save();

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


exports.deleteProduct = async (req, res) => {
    try {
    //   const { id } = req.params;
    //   const deletedProduct = await Product.findByIdAndDelete(id);
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    // Record recent activity
    // const activity = new RecentActivity({
    //     action: 'Delete',
    //     productId: deletedProduct._id,
    //     timestamp: new Date(),
    //   });
    //   await activity.save();
      
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.getProductById = async (req, res) => {
    try {
    //   const { _id } = req.params;
      const products = await Product.findById(req.params.id);
    // const productId = req.params.id;

    // const product = await Product.findById(productId);
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(products)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }

    // const product = await Product.findById(productId);
      if (!products) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };


  // Function to generate QR code based on product data
// exports.generateQRCode = async (req, res) => {
//   try {
//     // Get product data from request body
//     const { type, name, description, unitPrice, quantity } = req.body;

//     // Combine product data into a single string
//     const productData = JSON.stringify({ type, name, description, unitPrice, quantity });

//     // Generate QR code from product data
//     const qrCodePath = `qr-codes/${name}.png`; // Path to save the QR code image
//     await QRCode.toFile(qrCodePath, productData);

//     // Send success response with path to the generated QR code
//     res.status(200).json({ qrCodePath });
//   } catch (error) {
//     console.error('Error generating QR code:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

exports.generateQRCode = async (req, res) => {
  try {
    // Get the product data from the request body
    const productData = req.body;

    // Generate the QR code data
    const qrImageData = qr.imageSync(JSON.stringify(productData), { type: 'png' });

    // Send the QR code data as a response
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(qrImageData);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to download the generated QR code image
exports.downloadQRCode = (req, res) => {
  try {
    // Get the path to the QR code image from the request query parameters
    const { qrCodePath } = req.query;

    // Check if the QR code image file exists
    if (!fs.existsSync(qrCodePath)) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Read the QR code image file and send it as a response
    res.sendFile(qrCodePath);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// exports.addProductFromQR = async (req, res) => {
//   try {
//     // Parse the scanned QR code data
//     // const scannedData = req.body.text;
//     const scannedDataString = req.body.text;


//     // Split the scanned data string by spaces to get individual fields
//     const fields = scannedDataString.split(' ');

//     // Initialize variables to store product data
//     let type, name, description, unitPrice, quantity;

//     // Loop through the fields to extract data
//     fields.forEach(field => {
//       if (field.startsWith('Type:')) {
//         type = field.slice(6);
//       } else if (field.startsWith('Name:')) {
//         name = field.slice(6);
//       } else if (field.startsWith('Description:')) {
//         description = field.slice(12);
//       } else if (field.startsWith('Unit')) { // Since "Price:" and "Quantity:" may contain spaces, we check for "Unit" instead
//         unitPrice = parseInt(field.split(':')[1]);
//       } else if (field.startsWith('Quantity:')) {
//         quantity = parseInt(field.slice(10));
//       }
//     });

//     // Create a new product instance using the extracted data
//     const product = new Product({
//       type,
//       name,
//       description,
//       unitPrice,
//       quantity
//     });

//     // Save the product to the database
//     await product.save();

//     res.status(201).json({ message: 'Product added successfully from QR code', product });
//   } catch (error) {
//     console.error('Error adding product from QR code:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


exports.addProductFromQR = async (req, res) => {
  try {
    // Parse the scanned QR code data
    const scannedData = req.body;

    // Create a new product instance using the scanned data
    const product = new Product({
      type: scannedData.type,
      name: scannedData.name,
      description: scannedData.description,
      unitPrice: scannedData.unitPrice,
      quantity: scannedData.quantity
      // Add more fields as needed
    });

    // Save the product to the database
    await product.save();

    res.status(201).json({ message: 'Product added successfully from QR code', product });
  } catch (error) {
    console.error('Error adding product from QR code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get product by ID
// exports.getProductById = async (req, res) => {
//     try {
//       const productId = req.params.id;
  
//       // Validate if productId is a valid ObjectId
//       if (!mongoose.Types.ObjectId.isValid(productId)) {
//         return res.status(400).json({ success: false, message: 'Invalid product ID' });
//       }
  
//       // If productId is valid, proceed with fetching the product
//       const product = await Product.findById(productId);
  
//       // Check if product exists
//       if (!product) {
//         return res.status(404).json({ success: false, message: 'Product not found' });
//       }
  
//       // If product exists, return it
//       res.json({ success: true, product });
//     } catch (error) {
//       console.error('Error fetching product by ID:', error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   };

  // Fetch recent activities
// exports.getRecentActivities = async (req, res) => {
//     try {
//       const activities = await RecentActivity.find()
//         .sort({ timestamp: -1 })
//         .limit(10)
//         .populate('productId', 'name'); // Populate product details if needed
  
//       res.json(activities);
//     } catch (error) {
//       console.error('Error fetching recent activities:', error);
//       res.status(500).json({ error: error.message });
//     }
//   };



// Helper function to calculate total products added within a date range
exports.calculateTotalProductsAdded = async (startDate, endDate) => {
  // console.log("startDate:", startDate);
  // console.log("endDate:", endDate);
  try {
  const totalProductsAdded = await Product.aggregate([
      {
        $match: {
          created: {
            $gte: startDate,
            $lte: endDate
              }
            }
      },
      {
          $group: {
              _id: "$type",
              
              totalQuantity: { $sum: "$quantity" },
              totalCount: { $sum: 1 }
            }
          }
          
        ]);
        console.log(Product);

  return totalProductsAdded.length > 0 ? totalProductsAdded[0].totalQuantity : 0;
} catch (error) {
  console.error("Error:", error.message);
}

  // return totalProductsAdded[0]?.total ?? 0;
};

// Calculate total products added on a specific date
exports.getTotalProductsAddedOnDate = async (req, res) => {
  try {
      const { year, month, day } = req.params;
      const startDate = new Date(year, month - 1, day); // Month is 0-indexed

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); // Get next day

      const totalProductsAdded = await exports.calculateTotalProductsAdded(startDate, endDate);

      res.json({ totalProductsAdded: totalProductsAdded });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Calculate total products added in a specific month
exports.getTotalProductsAddedInMonth = async (req, res) => {
  try {
      const { year, month } = req.params;
      const startDate = new Date(year, month - 1, 1); // Month is 0-indexed
      const endDate = new Date(year, month, 0); // Get last day of month

      const totalProductsAdded = await exports.calculateTotalProductsAdded(startDate, endDate);

      res.json({ totalProductsAdded: totalProductsAdded });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Calculate total products added in a specific year
exports.getTotalProductsAddedInYear = async (req, res) => {
  try {
      const { year } = req.params;
      const startDate = new Date(year, 0, 1); // First day of the year
      const endDate = new Date(year, 11, 31); // Last day of the year

      const totalProductsAdded = await exports.calculateTotalProductsAdded(startDate, endDate);

      res.json({ totalProductsAdded: totalProductsAdded });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};