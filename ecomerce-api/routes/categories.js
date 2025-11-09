const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getStats);
module.exports = router;