const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

// Get all notifications for logged in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Keep it to recent 50
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipientId: req.user.id });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Mark all as read
router.post('/read-all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

module.exports = router;
