// // recentActivityController.js

// const Product = require('../models/productModel');

// // Get recent activities
// exports.getRecentActivities = async (req, res) => {
//   try {
//     // Fetch products sorted by the 'created' timestamp in descending order
//     const recentActivities = await Product.find({}, { _id: 0, created: 1 }).sort({ created: -1 }).limit(10);
    
//     // Format the timestamps into date and time strings
//     const formattedActivities = recentActivities.map(activity => {
//       return {
//         created: new Date(activity.created).toLocaleString() // Convert to local date and time format
//       };
//     });

//     res.json({ success: true, recentActivities: formattedActivities || [] });
//   } catch (error) {
//     console.error('Error fetching recent activities:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };


// recentActivityController.js

// const Product = require('../models/productModel');

// // Get recent activities
// exports.getRecentActivities = async (req, res) => {
//   try {
//     // Fetch products sorted by the 'updated' timestamp in descending order
//     const recentActivities = await Product.find({}, { _id: 0, updated: 1 }).sort({ updated: -1 }).limit(10);
    
//     // Format the timestamps into date and time strings
//     const formattedActivities = recentActivities.map(activity => {
//       return {
//         updated: new Date(activity.updated).toLocaleString() // Convert to local date and time format
//       };
//     });

//     res.json({ success: true, recentActivities: formattedActivities || [] });
//   } catch (error) {
//     console.error('Error fetching recent activities:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };
// recentActivityController.js

// const RecentActivity = require('../models/recentActivityModel');

// // Get recent activities
// exports.getRecentActivities = async (req, res) => {
//   try {
//     // Fetch recent activities sorted by timestamp in descending order
//     // const recentActivities = await RecentActivity.find()
//     //   .sort({ timestamp: -1 })
//     //   .limit(10);
//     const recentActivities = await Product.find({}, { _id: mongoose.Types.ObjectId.isValid(id), updated: 1 }).sort({ updated: -1 }).limit(10);
//     console.log(mongoose.Types.ObjectId.isValid('id'));

//     // Format the timestamps into date and time strings
//     const formattedActivities = recentActivities.map(activity => ({
//       action: activity.action,
//       productId: activity.productId,
//       timestamp: new Date(activity.timestamp).toLocaleString(), // Convert to local date and time format
//     }));

//     res.json({ success: true, recentActivities: formattedActivities });
//   } catch (error) {
//     console.error('Error fetching recent activities:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };
