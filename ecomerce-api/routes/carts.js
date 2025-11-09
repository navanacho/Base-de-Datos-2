const express = require('express');
const router = express.Router();
const { getCart, getCartTotal } = require('../controllers/cartController');
const { protect, ownerOrAdmin } = require('../middleware/auth');

router.get('/:usuarioId', protect, ownerOrAdmin, getCart);
router.get('/:usuarioId/total', protect, ownerOrAdmin, getCartTotal);
module.exports = router;