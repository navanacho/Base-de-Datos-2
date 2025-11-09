const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReviewsByProduct,
  getTopReviews,
  createReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', getAllReviews);
router.get('/product/:productId', getReviewsByProduct);
router.get('/top', getTopReviews);
router.post('/', protect, createReview);
module.exports = router;