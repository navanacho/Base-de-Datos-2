const express = require('express');
const router = express.Router();
const { createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,getStats } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

//CRUD
router.post('/', protect, adminOnly, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

router.get('/stats', protect, adminOnly, getStats);
module.exports = router;