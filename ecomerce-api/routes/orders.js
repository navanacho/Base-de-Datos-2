const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrdersByUser,
  getStats,
  updateOrderStatus,
  createOrder,
  deleteOrder
} = require('../controllers/orderController');
const { protect, adminOnly, ownerOrAdmin } = require('../middleware/auth');


// Rutas protegidas (solo admin)
router.get('/', protect, adminOnly, getAllOrders);
router.get('/stats', protect, adminOnly, getStats);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);


// Rutas protejidas (dueño o admin)
router.get('/user/:userId', protect, ownerOrAdmin, getOrdersByUser);
router.delete('/:id', protect, ownerOrAdmin, deleteOrder); // Eliminar pedido

// Ruta protegida: crear pedido (solo dueño o admin)
router.post('/', protect, createOrder); // El middleware ownerOrAdmin no aplica aquí, ya que solo el dueño puede crear su pedido

module.exports = router;
