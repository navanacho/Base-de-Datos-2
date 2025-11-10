const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReviewsByProduct,
  getTopReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');


// Rutas publicas
router.get('/', getAllReviews); // listar todas las reseñas
router.get('/product/:productId', getReviewsByProduct); //reseñas de un producto
router.get('/top', getTopReviews); //promedio de reseñas por producto


// Rutas protegidas: solo dueño o admin
router.post('/', protect, createReview);// listar todas las reseñas
router.get('/product/:productId', getReviewsByProduct); // reseñas de un producto
router.get('/top', getTopReviews); // promedio de reseñas por producto

// Rutas protegidas: solo dueño o admin
router.post('/', protect, createReview); // crear reseña (ya existía)
router.put('/:id', protect, updateReview); // actualizar reseña
router.delete('/:id', protect, deleteReview); // eliminar reseña

module.exports = router;