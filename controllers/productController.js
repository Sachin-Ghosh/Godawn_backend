const Product = require('../models/productModel');

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

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, unitPrice, quantity } = req.body;
    const product = new Product({ name, description, unitPrice, quantity });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Implement update, delete, and other CRUD operations similarly

exports.updateProduct = async (req, res) => {
    try {
      const { _id } = req.params;
      const { name, description, unitPrice, quantity } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        { name, description, unitPrice, quantity },
        { new: true }
      );
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
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
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
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };