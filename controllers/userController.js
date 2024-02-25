const User = require('../models/userModel');
// const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const defaultPageSize = 10;

// Create a new user
const createUser = async (req, res) => {
  try {
    // **Securely hash and salt password before saving**
    // const password = await bcrypt.hash(req.body.password, 10); // Use bcrypt for hashing
    // req.body.password = password;

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
    if (req.query.userId) {
      query.userId = req.query.userId;
    }


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
    // if (req.body.password) {
    //   const password = await bcrypt.hash(req.body.password, 10); // Use bcrypt for hashing
    //   req.body.password = password;
    // }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // await user.populate(["/* Populate necessary fields */"]); // Adjust as needed
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    user.id = User._id.toString();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const loginUser = async (req, res) => {
  console.log("login request");

  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const user = await User.findOne({ email }).select('+password');

    // console.log(user);
    
    if (!user) return res.status(401).json({ message: 'Invalid email' });
    // console.log("User found:", user);

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // console.log("Hashed Password from DB:", user.password);

    // const isPasswordValid = await user.comparePassword(password); // Compare password
    // console.log("Entered Password:", password);
    // console.log("Is password valid?", isPasswordValid);

    // if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

    // const hashedPasswordFromDB = user.password;
    // const trimmedPassword = password.trim(); // Trim any leading or trailing white spaces
    // const enteredPasswordLength = trimmedPassword.length;
    // const hashedPasswordLength = hashedPasswordFromDB.length;

    // // Compare the lengths of the entered password and hashed password
    // if (enteredPasswordLength !== hashedPasswordLength) {
    //   return res.status(401).json({ message: 'Wrong password' });
    // }

    // Direct comparison between trimmed entered password and hashed password
    
  //   try {
  //     // const isPasswordValid = trimmedPassword === hashedPasswordFromDB;
  //     const isPasswordValid = await user.comparePassword(password.trim());
  //     // const isPasswordValid = password === user.password;
  //     console.log('Entered Password:', password, 'Length:', password.length);
  //     console.log('Hashed Password from DB:', user.password, 'Length:', user.password.length);
  //     console.log('Is password valid?', isPasswordValid);
  //     // if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });
  //     if (!isPasswordValid) {
  //       console.log("Password mismatch");
  //       return res.status(401).json({ message: 'Invalid password' });
  //     }
  // } catch (error) {
  //     console.error('Password comparison error:', error);
  //     return res.status(500).json({ error: 'Internal Server Error' });
  // }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '30d', // Token expires in 30 days
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



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
  loginUser,
  getUserById,
  getUserByEmail,
};
