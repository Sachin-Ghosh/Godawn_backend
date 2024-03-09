// import jwt from 'jsonwebtoken';     

const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // For password hashing

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // Email validation
  },
  password: {
    type: String,
    required: true, 
    select: false, // Don't expose password in queries
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (v) {
    //     // Validate that the phone number has exactly 10 digits
    //     return /^\d{10}$/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid phone number!`,
    // },
  },
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'User'], // Define user roles
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare passwords securely
// userSchema.methods.comparePassword = async function (userPassword) {
//   return await bcrypt.compare(userPassword, this.password);
// };


// Hash and salt the password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
  
    try {
    //   const hashedPassword = await bcrypt.hash(user.password, 10);
    //   user.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  // Method to compare passwords
//   userSchema.methods.comparePassword = async function (candidatePassword) {
//     try {
//       return await bcrypt.compare(candidatePassword, this.password);
//     } catch (error) {
//       throw new Error(error);
//     }
//   };

// userSchema.methods.comparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
//   };

// module.exports = mongoose.model('User', userSchema);
// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
