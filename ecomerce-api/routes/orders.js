const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrdersByUser,
  getStats,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly, ownerOrAdmin } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllOrders);
router.get('/stats', protect, adminOnly, getStats);
router.get('/user/:userId', protect, ownerOrAdmin, getOrdersByUser);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
module.exports = router;