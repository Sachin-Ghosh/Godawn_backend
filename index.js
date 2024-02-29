var express = require('express');
const cors = require('cors'); // Import the cors middleware

var app = express();

require('dotenv').config(); // Load environment variables from .env file

// Import the cron job module
require('./cronJob');


// routes import 
const userRoutes = require('./routes/userRoute');
const invoiceRoutes = require('./routes/invoiceRoute');
const productRoutes = require("./routes/productRoute");
const salesRoutes = require("./routes/salesRoute");

const authenticateToken = require('./middleware/authMiddleware');




// connecting to database
const connectDB = require('./db');
connectDB();







// middleware 
app.use(cors());
// this code is for accepting data in port request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(authenticateToken); // authentication 



// all the routes 
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/inventory',productRoutes);
app.use('/api/sales',salesRoutes);
// admin routes

// app.use(adminBroApp);








app.get('/', function(req, res){
   res.send("Hello world!");
});



// app.use(admin.options.rootPath, adminRouter)


const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0" ,()=> {
    console.log(`Server is running on http://localhost:${port}`);
});