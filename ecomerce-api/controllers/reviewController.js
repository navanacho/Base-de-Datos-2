const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('productId', 'name');
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

const getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name');
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

const getTopReviews = async (req, res, next) => {
  try {
    const top = await Review.aggregate([
      { $group: { _id: '$productId', avgRating: { $avg: '$rating' } } },
      { $sort: { avgRating: -1 } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          avgRating: 1,
          productName: '$product.name'
        }
      }
    ]);
    res.json({ success: true, data: top });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    // ✅ Validar que haya comprado el producto
    const orderExists = await Order.exists({
      userId,
      'items.productId': productId
    });
    if (!orderExists) {
      return res.status(403).json({ success: false, error: 'Solo puedes reseñar productos que hayas comprado' });
    }

    // Evitar reseñas duplicadas
    const existing = await Review.findOne({ userId, productId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Ya reseñaste este producto' });
    }

    const review = await Review.create({ userId, productId, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};


// Actualizar una reseña (solo dueño o admin)
const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Reseña no encontrada' });
    }

    // Verificar si el usuario es dueño o admin
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { rating, comment } },
      { new: true, runValidators: true }
    );
    res.json({ success: true,  updatedReview });
  } catch (err) {
    next(err);
  }
};

// [NUEVO] Eliminar una reseña (solo dueño o admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Reseña no encontrada' });
    }

    // Verificar si el usuario es dueño o admin
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Reseña eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getAllReviews,
  getReviewsByProduct,
  getTopReviews,
  createReview,
  updateReview,
  deleteReview
};