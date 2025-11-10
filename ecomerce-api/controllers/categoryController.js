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

//Crear categoria
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, error: 'Ya existe una categoría con ese nombre' });
    }

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true,  category });
  } catch (err) {
    next(err);
  }
};

// Obtener todas las categorías
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ success: true,  categories });
  } catch (err) {
    next(err);
  }
};

// Obtener una categoría por ID
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true,  category });
  } catch (err) {
    next(err);
  }
};

// Actualizar una categoría por ID
const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Verificar si el nuevo nombre ya existe (y no es el mismo ID)
    if (name) {
      const existingCategory = await Category.findOne({ name, _id: { $ne: req.params.id } });
      if (existingCategory) {
        return res.status(400).json({ success: false, error: 'Ya existe una categoría con ese nombre' });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description } },
      { new: true, runValidators: true } // Devuelve el doc actualizado y valida
    );
    if (!category) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true,  category });
  } catch (err) {
    next(err);
  }
};

// Eliminar una categoría por ID
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};


module.exports = { 
  getStats,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};