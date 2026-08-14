const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/activityLogger');

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
exports.createSwapRequest = asyncHandler(async (req, res, next) => {
  const { requestedItemId, offeredItemId } = req.body;

  if (!requestedItemId || !offeredItemId) {
    throw new ApiError(400, 'Both requested and offered items are required');
  }

  const requestedItem = await Item.findById(requestedItemId);
  const offeredItem = await Item.findById(offeredItemId);

  if (!requestedItem || !offeredItem) {
    throw new ApiError(404, 'One or both items not found');
  }

  if (requestedItem.ownerId.toString() === req.user.id) {
    throw new ApiError(400, 'Cannot request your own item');
  }

  if (offeredItem.ownerId.toString() !== req.user.id) {
    throw new ApiError(403, 'You can only offer your own items');
  }

  // Check if request already exists
  const existingRequest = await SwapRequest.findOne({
    requesterId: req.user.id,
    requestedItemId,
    status: { $in: ['Pending', 'Accepted'] }
  });

  if (existingRequest) {
    throw new ApiError(400, 'You already have an active request for this item');
  }

  const swapRequest = await SwapRequest.create({
    requesterId: req.user.id,
    receiverId: requestedItem.ownerId,
    requestedItemId,
    offeredItemId
  });

  // Create and emit Notification
  const notification = await Notification.create({
    recipientId: requestedItem.ownerId,
    type: 'swap_request',
    message: `You have a new swap request for your item "${requestedItem.title}"!`,
    link: '/swap-requests'
  });

  const io = req.app.get('io');
  if (io) {
    io.to(`user_${requestedItem.ownerId}`).emit('notification', notification);
  }

  // Log swap request creation
  await logActivity(req.user.id, 'CREATE_SWAP_REQUEST', { swapRequestId: swapRequest._id, requestedItemId, offeredItemId });

  res.status(201).json(swapRequest);
});

// @desc    Get incoming swap requests
// @route   GET /api/swaps/incoming
// @access  Private
exports.getIncomingRequests = asyncHandler(async (req, res, next) => {
  const requests = await SwapRequest.find({ receiverId: req.user.id })
    .populate('requesterId', 'name')
    .populate('requestedItemId', 'title imageUrl')
    .populate('offeredItemId', 'title imageUrl')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    Get outgoing swap requests
// @route   GET /api/swaps/outgoing
// @access  Private
exports.getOutgoingRequests = asyncHandler(async (req, res, next) => {
  const requests = await SwapRequest.find({ requesterId: req.user.id })
    .populate('receiverId', 'name')
    .populate('requestedItemId', 'title imageUrl')
    .populate('offeredItemId', 'title imageUrl')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    Update swap request status
// @route   PATCH /api/swaps/:id/status
// @access  Private
exports.updateSwapStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const request = await SwapRequest.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, 'Swap request not found');
  }

  if (request.receiverId.toString() !== req.user.id && ['Accepted', 'Rejected'].includes(status)) {
    throw new ApiError(403, 'Not authorized to update this request');
  }

  if (status === 'Completed' && request.status !== 'Accepted') {
    throw new ApiError(400, 'Only accepted requests can be completed');
  }

  request.status = status;
  await request.save();

  if (status === 'Accepted') {
    const item = await Item.findById(request.requestedItemId);
    const notification = await Notification.create({
      recipientId: request.requesterId,
      type: 'swap_accepted',
      message: `Your swap request for "${item?.title || 'an item'}" was accepted!`,
      link: '/swap-requests'
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${request.requesterId}`).emit('notification', notification);
    }
  }

  if (status === 'Completed') {
    await Item.findByIdAndUpdate(request.requestedItemId, { status: 'Swapped' });
    await Item.findByIdAndUpdate(request.offeredItemId, { status: 'Swapped' });

    const usersToUpdate = [request.requesterId, request.receiverId];
    
    for (let userId of usersToUpdate) {
      const user = await User.findById(userId);
      if (user) {
        user.ecoPoints = (user.ecoPoints || 0) + 50;
        
        if (!user.badges.includes('First Swap')) {
          user.badges.push('First Swap');
        }
        if (user.ecoPoints >= 250 && !user.badges.includes('Eco Warrior')) {
          user.badges.push('Eco Warrior');
        }
        if (user.ecoPoints >= 1000 && !user.badges.includes('Sustainability Guru')) {
          user.badges.push('Sustainability Guru');
        }
        
        await user.save();
      }
    }
  }

  // Log swap status update
  await logActivity(req.user.id, 'UPDATE_SWAP_STATUS', { swapRequestId: request._id, status });

  res.json(request);
});

// @desc    Raise a dispute
// @route   POST /api/swaps/:id/dispute
// @access  Private
exports.raiseDispute = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const request = await SwapRequest.findById(req.params.id);
  
  if (!request) {
    throw new ApiError(404, 'Swap request not found');
  }
  
  if (request.requesterId.toString() !== req.user.id && request.receiverId.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized to dispute this request');
  }
  
  if (!reason) {
    throw new ApiError(400, 'Reason for dispute is required');
  }

  request.disputeStatus = 'Raised';
  request.disputeReason = reason;
  await request.save();
  
  res.json({ message: 'Dispute raised successfully', request });
});
