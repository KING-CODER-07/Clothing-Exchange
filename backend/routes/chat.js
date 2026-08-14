const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const SwapRequest = require('../models/SwapRequest');
const { verifyToken } = require('../middleware/auth');

// Get messages for a specific swap request
router.get('/:swapRequestId', verifyToken, async (req, res) => {
  try {
    const { swapRequestId } = req.params;
    
    // Verify user is part of the swap request
    const swapRequest = await SwapRequest.findById(swapRequestId);
    if (!swapRequest) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    if (swapRequest.requesterId.toString() !== req.user.id && swapRequest.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view these messages' });
    }

    const messages = await Message.find({ swapRequestId })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 });
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/:swapRequestId', verifyToken, async (req, res) => {
  try {
    const { swapRequestId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const swapRequest = await SwapRequest.findById(swapRequestId);
    if (!swapRequest) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    if (swapRequest.requesterId.toString() !== req.user.id && swapRequest.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to send messages for this swap' });
    }

    const receiverId = swapRequest.requesterId.toString() === req.user.id 
      ? swapRequest.receiverId 
      : swapRequest.requesterId;

    const newMessage = new Message({
      swapRequestId,
      senderId: req.user.id,
      receiverId,
      content
    });

    await newMessage.save();
    
    // Populate sender info before returning
    await newMessage.populate('senderId', 'name');
    
    // Emit via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(swapRequestId).emit('newMessage', newMessage);
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
