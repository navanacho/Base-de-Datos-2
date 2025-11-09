const Category = require('../models/Category');
const Product = require('../models/Product');

const getStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'cat' } },
      { $unwind: '$cat' },
      { $group: { _id: '$cat.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };