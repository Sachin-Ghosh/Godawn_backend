// salesController.js
const Sales = require("../models/salesModel");
const Product = require("../models/productModel");

// Create
// const createSale = async (req, res) => {
//   try {
//     // const sale = new Sales(req.body);
//     const { productId, buyerName, soldQuantity } = req.body;

//     if (isNaN(soldQuantity) || soldQuantity <= 0) {
//         throw new Error('Invalid quantity');
//       }
//      // Create a new sale
//      const sale = new Sales({
//         productId,
//         buyerName,
//         soldQuantity
//       });
  
//     const savedSale = await sale.save();
//     await savedSale.populate(["productId"])

//     const product = await Product.findById(req.body.productId);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
    
//     // console.log(req.body);
//     // Subtract the quantity from the inventory
//     // const soldQuantity = parseInt(req.body.quantity);
//     if (isNaN(soldQuantity) || soldQuantity <= 0) {
//       throw new Error('Invalid quantity');
//     }
//     // Check if soldQuantity is a valid number
//     // if (isNaN(soldQuantity) || soldQuantity <= 0) {
//     //     return res.status(400).json({ error: 'Invalid quantity' });
//     //   }

//       // Check if the product has enough quantity to sell
//     if (product.quantity < soldQuantity) {
//         return res.status(400).json({ error: 'Insufficient quantity available' });
//       }


//     product.quantity -= soldQuantity;
    
//     await product.save();


//     res.status(201).json(savedSale);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


const createSale = async (req, res) => {
    try {
      const { productId, buyerName, soldQuantity } = req.body;
      
      // Check if soldQuantity is a valid number and greater than 0
      if (isNaN(soldQuantity) || soldQuantity <= 0) {
        throw new Error('Invalid quantity');
      }
  
      const sale = new Sales({
        productId,
        buyerName,
        soldQuantity
      });
  
      const savedSale = await sale.save();  
      await savedSale.populate("productId")
  
      const product = await Product.findById(req.body.productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Subtract the quantity from the inventory
      product.quantity -= soldQuantity;
      await product.save();
  
      res.status(201).json(savedSale);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Read all sales with pagination
const getSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; // Set a default page size

    const totalCount = await Sales.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const sales = await Sales.find().populate("productId")
      .sort({ createdAt: -1 }) // Change to your preferred field for sorting
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      sales,
      page,
      pageSize,
      totalCount,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a single sale by ID
const getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id).populate("productId");
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
const updateSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await sale.populate("productId")
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
const deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
};
