require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const urlRoutes = require('./routes/urlRoutes');  // Import the URL routes
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:3001',  // Allow only requests from localhost:3001
  methods: 'GET,POST,PUT,DELETE',  // Allow specific methods
  credentials: true                // Allow credentials (cookies, etc.)
}));
// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Use the URL routes
app.use('/shorten', urlRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
