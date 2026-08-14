const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  createSwapRequest,
  getIncomingRequests,
  getOutgoingRequests,
  updateSwapStatus,
  raiseDispute
} = require('../controllers/swapController');

router.post('/', verifyToken, createSwapRequest);
router.get('/incoming', verifyToken, getIncomingRequests);
router.get('/outgoing', verifyToken, getOutgoingRequests);
router.patch('/:id/status', verifyToken, updateSwapStatus);
router.post('/:id/dispute', verifyToken, raiseDispute);

module.exports = router;
