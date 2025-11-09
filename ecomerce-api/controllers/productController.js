const Product = require('../models/Product');
const Review = require('../models/Review');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

const getFilteredProducts = async (req, res, next) => {
  try {
    const { min, max, brand } = req.query;
    const filter = { $and: [] };
    if (min || max) {
      filter.$and.push({ price: { $gte: parseFloat(min) || 0, $lte: parseFloat(max) || Infinity } });
    }
    if (brand) filter.$and.push({ brand: { $eq: brand } });
    if (filter.$and.length === 0) delete filter.$and;

    const products = await Product.find(filter).populate('category', 'name');
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const top = await Review.aggregate([
      { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1, count: -1 } },
      { $limit: 5 },
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
          _id: '$product._id',
          name: '$product.name',
          avgRating: 1,
          reviewCount: '$count'
        }
      }
    ]);
    res.json({ success: true, data: top });
  } catch (err) {
    next(err);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { stock } },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getFilteredProducts,
  getTopProducts,
  updateStock
};