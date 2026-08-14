const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  calculateItemValue,
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getUserItems,
  boostItem
} = require('../controllers/itemController');

router.post('/calculate-value', verifyToken, calculateItemValue);
router.route('/')
  .get(getItems)
  .post(verifyToken, createItem);

router.get('/user/me', verifyToken, getUserItems);

router.route('/:id')
  .get(getItemById)
  .put(verifyToken, updateItem)
  .delete(verifyToken, deleteItem);

router.post('/:id/boost', verifyToken, boostItem);

module.exports = router;
