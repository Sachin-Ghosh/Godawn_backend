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
      const { products, buyerName, soldQuantity } = req.body;
      
      // Check if soldQuantity is a valid number and greater than 0
      if (isNaN(soldQuantity) || soldQuantity <= 0) {
        throw new Error('Invalid quantity');
      }
  
      const sale = new Sales({
        products,
        buyerName,
        soldQuantity
      });
  
      const savedSale = await sale.save();  
    //   await savedSale.populate("productId")
  
      const product = await Product.findById(req.body.products);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Subtract the quantity from the inventory
      product.quantity -= soldQuantity;
      await product.save();

    //    // Update the product document to include the sale
       await Product.findByIdAndUpdate(req.body.products, { $push: { sales: savedSale._id } }).populate({
        path: 'sales',
        model: 'Sales' // Model of the Sale document
    });   
    //  // Update the product with the sales data
    //  const updatedProduct = await Product.findByIdAndUpdate(
    //     req.body.productId,
    //     { $push: { sales: savedSale._id } }
    // );

    // if (!updatedProduct) {
    //     throw new Error('Failed to update product with sales data');
    // }

    // Populate the saved sale ID
    // await Product.populate(req.body.product, { path: 'sales' });
    
  
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

    const sales = await Sales.find().populate("products")
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
    const sale = await Sales.findById(req.params.id).populate("products");
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
    await sale.populate("products")
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

// Calculate total products sold on a specific date
const getTotalProductsSoldOnDate = async (req, res) => {
    try {
      const { year, month, day } = req.params;
      const startDate = new Date(year, month - 1, day); // Month is 0-indexed
  
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); // Get next day
  
      const totalProductsSold = await calculateTotalProductsSold(startDate, endDate);
  
      res.json({ totalProductsSold: totalProductsSold });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Calculate total products sold in a specific month
  const getTotalProductsSoldInMonth = async (req, res) => {
    try {
      const { year, month } = req.params;
      const startDate = new Date(year, month - 1, 1); // Month is 0-indexed
      const endDate = new Date(year, month, 0); // Get last day of month
  
      const totalProductsSold = await calculateTotalProductsSold(startDate, endDate);
  
      res.json({ totalProductsSold: totalProductsSold });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Calculate total products sold in a specific year
  const getTotalProductsSoldInYear = async (req, res) => {
    try {
      const { year } = req.params;
      const startDate = new Date(year, 0, 1); // First day of the year
      const endDate = new Date(year, 11, 31); // Last day of the year
  
      const totalProductsSold = await calculateTotalProductsSold(startDate, endDate);
  
      res.json({ totalProductsSold: totalProductsSold });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Helper function to calculate total products sold within a date range
  const calculateTotalProductsSold = async (startDate, endDate) => {
    const totalProductsSold = await Sales.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$soldQuantity' },
        },
      },
    ]);
  
    return totalProductsSold[0]?.total || 0;
  };

// Calculate total quantity sold for a specific product ID
const getTotalQuantitySoldForProduct = async (req, res) => {
    try {
      const products = req.params.products;

      console.log("Product ID:", products);
  
      const totalQuantitySold = await Sales.aggregate([
        {
          $match: {
            "products._id": products,
          },
        },
        {
          $group: {
            _id: "$products._id",
            total: { $sum: "$soldQuantity" },
          },
        },
      ]);

      console.log("Aggregation Result:", totalQuantitySold);

      if (totalQuantitySold.length === 0) {
        return res.json({ totalQuantitySold: 0 });
      }
  
      res.json({ totalQuantitySold: totalQuantitySold[0].totalQuantitySold });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

//   const getAllSalesForProduct = async (req, res) => {
//     try {
//       const productId = req.params.productId;
  
//       // Query the Sales collection to find all sales with the specified product ID
//       const sales = await Sales.find({ productId: productId });
  
//       // Return the sales details as the response
//       res.json({ sales });
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: error.message });
//     }
//   };
  
  

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  getTotalProductsSoldOnDate,
  getTotalProductsSoldInMonth,
  getTotalProductsSoldInYear,
  getTotalQuantitySoldForProduct,
//   getAllSalesForProduct,

};
