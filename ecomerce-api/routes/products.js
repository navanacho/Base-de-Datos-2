const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getFilteredProducts,
  getTopProducts,
  updateStock
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllProducts); // pública
router.get('/filtro', getFilteredProducts); // pública
router.get('/top', getTopProducts); // pública
router.patch('/:id/stock', protect, adminOnly, updateStock);
module.exports = router;