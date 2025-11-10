const express = require('express');
const router = express.Router();
const { 
    getCart,
    getCartTotal,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
} = require('../controllers/cartController');
const { protect, ownerOrAdmin } = require('../middleware/auth');


// Rutas protegidas (solo admin)
router.get('/:usuarioId', protect, ownerOrAdmin, getCart);
router.get('/:usuarioId/total', protect, ownerOrAdmin, getCartTotal);


// CRUD de items en el carrito
router.post('/:usuarioId', protect, ownerOrAdmin, addCartItem); // Agregar item
router.put('/:usuarioId', protect, ownerOrAdmin, updateCartItem); // Actualizar cantidad de un item
router.delete('/:usuarioId', protect, ownerOrAdmin, clearCart); // Vaciar carrito
router.delete('/:usuarioId/item', protect, ownerOrAdmin, removeCartItem); // Remover un item específico


module.exports = router;