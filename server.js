const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Import DB connection pool and routes
const db = require('./src/config/db');
const authRoutes = require('./src/routes/authroutes');
const storyRoutes = require('./src/routes/storyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow your frontend to talk to this API
app.use(express.json()); // Body parser for incoming JSON data

// Check Database Connection on startup
db.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database Connected successfully.');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database Connection Failed:', err.stack);
    process.exit(1);
  });

// Define API Routes
app.use('/api/auth', authRoutes);      // Handles user signup/login
app.use('/api/stories', storyRoutes);  // Handles fetching/submitting stories

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});