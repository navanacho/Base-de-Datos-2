const express = require('express');
const router = express.Router();
const { getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    loginUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, getUserById);
router.post('/', createUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.post('/login', loginUser);

module.exports = router;