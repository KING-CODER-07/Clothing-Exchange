const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

// Create a review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { swapRequestId, rating, comment } = req.body;
    
    // Verify swap is completed
    const swap = await SwapRequest.findById(swapRequestId);
    if (!swap || swap.status !== 'Completed') {
      return res.status(400).json({ error: 'Can only review completed swaps' });
    }

    // Determine reviewee (the other person)
    let revieweeId;
    if (swap.requesterId.toString() === req.user.id) {
      revieweeId = swap.receiverId;
    } else if (swap.receiverId.toString() === req.user.id) {
      revieweeId = swap.requesterId;
    } else {
      return res.status(403).json({ error: 'Not part of this swap' });
    }

    const newReview = new Review({
      swapRequestId,
      reviewerId: req.user.id,
      revieweeId,
      rating,
      comment
    });

    await newReview.save();

    // Gamification: Award 20 points for a 4 or 5 star review
    if (rating >= 4) {
      const user = await User.findById(revieweeId);
      if (user) {
        user.ecoPoints = (user.ecoPoints || 0) + 20;
        
        if (!user.badges.includes('Top Rated')) {
          user.badges.push('Top Rated');
        }
        await user.save();
      }
    }

    // Create and emit Notification
    const notification = new Notification({
      recipientId: revieweeId,
      type: 'new_review',
      message: `Someone just left you a ${rating}-star review!`,
      link: '/dashboard'
    });
    await notification.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${revieweeId}`).emit('notification', notification);
    }

    res.status(201).json(newReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this swap' });
    }
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name avatarUrl')
      .sort({ createdAt: -1 });
      
    // Calculate average
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
      : 0;
      
    res.json({ reviews, avgRating: avgRating.toFixed(1), totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
