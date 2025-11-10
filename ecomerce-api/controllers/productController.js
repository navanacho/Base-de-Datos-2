const Product = require('../models/Product');
const Review = require('../models/Review');

// Crear un nuevo producto
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, brand, category } = req.body;

    // Verificar si ya existe un producto con el mismo nombre
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ success: false, error: 'Ya existe un producto con ese nombre' });
    }

    const product = await Product.create({ name, description, price, stock, brand, category });
    res.status(201).json({ success: true,  product });
  } catch (err) {
    next(err);
  }
};


// Actualizar un producto por ID
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, brand, category } = req.body;

    // Verificar si el nuevo nombre ya existe (y no es el mismo ID)
    if (name) {
      const existingProduct = await Product.findOne({ name, _id: { $ne: req.params.id } });
      if (existingProduct) {
        return res.status(400).json({ success: false, error: 'Ya existe un producto con ese nombre' });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, price, stock, brand, category } },
      { new: true, runValidators: true } // Devuelve el doc actualizado y valida
    );
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true,  product });
  } catch (err) {
    next(err);
  }
};


// Eliminar un producto por ID
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};



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
  updateStock,
  createProduct,
  updateProduct,
  deleteProduct
};