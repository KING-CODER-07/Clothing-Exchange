const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/auth');
const { validate } = require('../middleware/validationMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleWishlist
} = require('../controllers/authController');

router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty().trim().escape(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('location', 'Location is required').not().isEmpty().trim().escape(),
    validate
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists(),
    validate
  ],
  loginUser
);

router.route('/profile')
  .get(verifyToken, getUserProfile)
  .put(
    verifyToken,
    [
      body('name').optional().trim().escape(),
      body('location').optional().trim().escape(),
      body('avatarUrl').optional().isURL(),
      validate
    ],
    updateUserProfile
  );

router.post('/wishlist/:itemId', verifyToken, toggleWishlist);

module.exports = router;
