const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Apply auth and admin middleware to all routes
router.use(verifyToken, isAdmin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalSwaps = await SwapRequest.countDocuments();
    const completedSwaps = await SwapRequest.countDocuments({ status: 'Completed' });

    // Advanced Aggregations
    const categoryDistribution = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const conditionDistribution = await Item.aggregate([
      { $group: { _id: "$condition", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalItems,
      totalSwaps,
      completedSwaps,
      categoryDistribution,
      conditionDistribution
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get chart data for swaps over the last 30 days
router.get('/chart-data', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await SwapRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          swaps: { $sum: 1 },
          completed: { 
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } 
          }
        }
      },
      {
        $sort: { _id: 1 } // Sort by date ascending
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          swaps: 1,
          completed: 1
        }
      }
    ]);

    // Fill in missing dates to ensure the chart is continuous
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      const existing = data.find(item => item.date === dateString);
      if (existing) {
        chartData.push(existing);
      } else {
        chartData.push({ date: dateString, swaps: 0, completed: 0 });
      }
    }

    res.json(chartData);
  } catch (error) {
    console.error('Failed to generate chart data:', error);
    res.status(500).json({ error: 'Failed to generate chart data' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    
    // Delete user's items and swap requests
    await Item.deleteMany({ ownerId: req.params.id });
    await SwapRequest.deleteMany({ $or: [{ requesterId: req.params.id }, { receiverId: req.params.id }] });
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Delete an item
router.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    // Cleanup related swap requests
    await SwapRequest.deleteMany({ $or: [{ requestedItemId: req.params.id }, { offeredItemId: req.params.id }] });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Get disputed swaps
router.get('/disputes', async (req, res) => {
  try {
    const disputes = await SwapRequest.find({ disputeStatus: 'Raised' })
      .populate('requesterId', 'name email')
      .populate('receiverId', 'name email')
      .populate('requestedItemId', 'title')
      .populate('offeredItemId', 'title')
      .sort({ createdAt: -1 });
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
});

// Resolve a dispute
router.post('/disputes/:id/resolve', async (req, res) => {
  try {
    const { action } = req.body; // 'CancelSwap', 'MarkCompleted'
    const swap = await SwapRequest.findById(req.params.id);
    
    if (!swap) return res.status(404).json({ error: 'Swap not found' });
    
    swap.disputeStatus = 'Resolved';
    if (action === 'CancelSwap') {
      swap.status = 'Rejected';
      await Item.updateMany(
        { _id: { $in: [swap.requestedItemId, swap.offeredItemId] } },
        { status: 'Available' }
      );
    } else if (action === 'MarkCompleted') {
      swap.status = 'Completed';
    }
    
    await swap.save();
    res.json({ message: 'Dispute resolved', swap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve dispute' });
  }
});

module.exports = router;
