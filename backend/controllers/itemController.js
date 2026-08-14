const Item = require('../models/Item');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { calculateValue } = require('../utils/valueCalculator');
const logActivity = require('../utils/activityLogger');

// @desc    Calculate suggested value
// @route   POST /api/items/calculate-value
// @access  Private
exports.calculateItemValue = asyncHandler(async (req, res, next) => {
  const { brand, condition, category } = req.body;
  if (!condition || !category) {
    throw new ApiError(400, 'Condition and category are required');
  }
  const value = calculateValue(brand, condition, category);
  res.json({ suggestedValue: value });
});

// @desc    Get all available items
// @route   GET /api/items
// @access  Public
exports.getItems = asyncHandler(async (req, res, next) => {
  const { category, location, size, search, page = 1, limit = 9, sort } = req.query;
  let query = { status: 'Available' };

  if (category) query.category = category;
  if (location) query.location = { $regex: new RegExp(location, 'i') };
  if (size) query.size = size;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }
  
  let sortObj = { isFeatured: -1, createdAt: -1 };
  
  if (sort === 'oldest') sortObj = { createdAt: 1 };
  if (sort === 'title_asc') sortObj = { title: 1 };
  if (sort === 'title_desc') sortObj = { title: -1 };

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const totalItems = await Item.countDocuments(query);
  const items = await Item.find(query)
    .populate('ownerId', 'name location')
    .sort(sortObj)
    .skip(skip)
    .limit(limitNumber);

  res.json({
    items,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalItems / limitNumber),
    totalItems
  });
});

// @desc    Get specific item
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('ownerId', 'name location email');
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }
  res.json(item);
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = asyncHandler(async (req, res, next) => {
  const { title, description, brand, size, condition, category, location, imageUrl, suggestedValue } = req.body;

  if (!title || !description || !size || !condition || !category || !location) {
    throw new ApiError(400, 'Missing required fields');
  }

  const newItem = await Item.create({
    title,
    description,
    brand,
    size,
    condition,
    category,
    location,
    imageUrl,
    suggestedValue: suggestedValue || 'Medium',
    ownerId: req.user.id
  });

  // Log create listing
  await logActivity(req.user.id, 'CREATE_LISTING', { itemId: newItem._id, title: newItem.title });

  res.status(201).json(newItem);
});

// @desc    Edit an item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  if (item.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to edit this item');
  }

  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  // Log update listing
  await logActivity(req.user.id, 'UPDATE_LISTING', { itemId: updatedItem._id, title: updatedItem.title });

  res.json(updatedItem);
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  if (item.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this item');
  }

  await Item.findByIdAndDelete(req.params.id);

  // Log delete listing
  await logActivity(req.user.id, 'DELETE_LISTING', { itemId: req.params.id, title: item.title });

  res.json({ message: 'Item deleted successfully' });
});

// @desc    Get user's items
// @route   GET /api/items/user/me
// @access  Private
exports.getUserItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});

// @desc    Boost an item
// @route   POST /api/items/:id/boost
// @access  Private
exports.boostItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  if (item.ownerId.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized to boost this item');
  }

  if (item.isFeatured) {
    throw new ApiError(400, 'Item is already featured');
  }

  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  item.isFeatured = true;
  await item.save();

  res.json({ message: 'Item boosted successfully!', item });
});
