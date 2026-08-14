const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'REGISTER',
      'LOGIN',
      'UPDATE_PROFILE',
      'CREATE_LISTING',
      'UPDATE_LISTING',
      'DELETE_LISTING',
      'CREATE_SWAP_REQUEST',
      'UPDATE_SWAP_STATUS',
      'TOGGLE_WISHLIST',
      'OTHER'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
