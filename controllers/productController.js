const Product = require('../models/productModel');
const mongoose = require('mongoose');
// const RecentActivity = require('../models/recentActivityModel');


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
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
      const productId = await Product.findById(req.params.id);
    // const productId = req.params.id;

    // const product = await Product.findById(productId);
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }

    // const product = await Product.findById(productId);
      if (!productId) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, productId });
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
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