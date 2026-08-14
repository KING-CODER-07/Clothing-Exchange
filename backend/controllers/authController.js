const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/activityLogger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, name, location } = req.body;

  if (!email || !password || !name || !location) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    name,
    location,
    role: 'user'
  });

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email, role: newUser.role },
    process.env.JWT_SECRET || 'swap-marketplace-super-secret-key',
    { expiresIn: '7d' }
  );

  // Log Registration
  await logActivity(newUser._id, 'REGISTER', { role: newUser.role });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      location: newUser.location,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
      wishlist: newUser.wishlist
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'swap-marketplace-super-secret-key',
    { expiresIn: '7d' }
  );

  // Update last login time
  user.lastLoginAt = Date.now();
  await user.save();

  // Log Login
  await logActivity(user._id, 'LOGIN', { role: user.role });

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      location: user.location,
      role: user.role,
      avatarUrl: user.avatarUrl,
      wishlist: user.wishlist
    }
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const { name, location, avatarUrl } = req.body;
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name) user.name = name;
  if (location) user.location = location;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  await user.save();

  // Log Profile Update
  await logActivity(user._id, 'UPDATE_PROFILE', { updatedFields: { name: !!name, location: !!location, avatarUrl: !!avatarUrl } });
  
  res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    location: user.location,
    role: user.role,
    avatarUrl: user.avatarUrl,
    wishlist: user.wishlist
  });
});

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/:itemId
// @access  Private
exports.toggleWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const itemId = req.params.itemId;
  const index = user.wishlist.indexOf(itemId);
  
  if (index === -1) {
    user.wishlist.push(itemId);
  } else {
    user.wishlist.splice(index, 1);
  }
  
  await user.save();

  // Log Wishlist Toggle
  await logActivity(user._id, 'TOGGLE_WISHLIST', { itemId, action: index === -1 ? 'added' : 'removed' });

  res.json({ wishlist: user.wishlist });
});
