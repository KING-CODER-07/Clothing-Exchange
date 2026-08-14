const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ['New with tags', 'Like New', 'Good', 'Fair'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  suggestedValue: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Premium'],
    default: 'Medium'
  },
  location: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x500?text=No+Image'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Swapped'],
    default: 'Available'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);
