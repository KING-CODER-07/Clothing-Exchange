const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { verifyToken, isAdmin } = require('../middleware/auth');

// POST /api/contact - Submit a new contact/feedback message
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, message, type } = req.body;
    
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      message,
      type: type || 'Support'
    });

    await newContact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'Server error while saving message' });
  }
});

// GET /api/contact - Get all messages (Admin only)
router.get('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
});

// PATCH /api/contact/:id/status - Update message status (Admin only)
router.patch('/:id/status', [verifyToken, isAdmin], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error while updating status' });
  }
});

module.exports = router;
