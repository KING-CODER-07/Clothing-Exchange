const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  ecoPoints: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }],
  avatarUrl: {
    type: String,
    default: ''
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  }
});

module.exports = mongoose.model('User', userSchema);
