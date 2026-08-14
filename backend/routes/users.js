const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get leaderboard (top 10 users by ecoPoints)
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .select('name location avatarUrl ecoPoints badges createdAt')
      .sort({ ecoPoints: -1 })
      .limit(10);
      
    res.json(topUsers);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
