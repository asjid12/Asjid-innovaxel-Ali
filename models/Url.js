const mongoose = require('mongoose');

// Define the URL schema
const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },  // Original URL
  shortCode: { type: String, required: true, unique: true },  // Unique short code
  accessCount: { type: Number, default: 0 },  // Access count for the short URL
  createdAt: { type: Date, default: Date.now },  // Creation date
  updatedAt: { type: Date, default: Date.now }   // Last update date
});

// Create the model for the URL schema
const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
