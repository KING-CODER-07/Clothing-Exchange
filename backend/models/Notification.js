const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['swap_request', 'swap_accepted', 'new_review', 'system'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: '/dashboard'
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
