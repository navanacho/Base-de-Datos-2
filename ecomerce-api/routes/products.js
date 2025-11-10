const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getFilteredProducts,
  getTopProducts,
  updateStock,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');


// Rutas publicas
router.get('/', getAllProducts); // listar productos con su categoría
router.get('/filtro', getFilteredProducts); // filtrar por rango de precio y marca
router.get('/top', getTopProducts); // productos mas reseñados


// Rutas protegidas (solo admin)
router.post('/', protect, adminOnly, createProduct); // crear producto
router.put('/:id', protect, adminOnly, updateProduct); // actualizar producto
router.delete('/:id', protect, adminOnly, deleteProduct); // eliminar producto


// Ruta especifica protegida (solo admin)
router.patch('/:id/stock', protect, adminOnly, updateStock); // Actualizar stock


module.exports = router;