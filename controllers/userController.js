const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const defaultPageSize = 10;

// Create a new user
const createUser = async (req, res) => {
  try {
    // **Securely hash and salt password before saving**
    const password = await bcrypt.hash(req.body.password, 10); // Use bcrypt for hashing
    req.body.password = password;

    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error)  {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
      // Duplicate key error for email field
      return res.status(400).json({ error: "Email address already exists." });
    }
    console.error(error);
    res.status(400).json({ error: error.message });
  }
  
};

// Read all users with pagination
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || defaultPageSize;

    // Implement query logic for filtering and searching users
    // ...
    // Define userQuery for filtering and searching users
    const userQuery = {}; // Default query, you can add filters here

    const totalCount = await User.countDocuments(userQuery);
    const totalPages = Math.ceil(totalCount / pageSize);

    const users = await User.find(userQuery)
      // .populate(["/* Populate necessary fields */"]) // Adjust as needed
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      users,
      page,
      pageSize,
      totalCount,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // await user.populate(["/* Populate necessary fields */"]); // Adjust as needed

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    // **Securely handle password updates (if applicable)**
    if (req.body.password) {
      const password = await bcrypt.hash(req.body.password, 10); // Use bcrypt for hashing
      req.body.password = password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // await user.populate(["/* Populate necessary fields */"]); // Adjust as needed
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      // **Handle any associated data deletion (if applicable)**
      // ...
    }
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
};
