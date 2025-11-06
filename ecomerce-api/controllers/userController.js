const User = require('../models/user');
const Cart = require('../models/Cart');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, phone, role = 'cliente' } = req.body;
    const user = await User.create({ name, email, password, address, phone, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    // Eliminar carrito asociado
    await Cart.findOneAndDelete({ userId: req.params.id });
    res.json({ success: true, message: 'Usuario y carrito eliminados' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, createUser, deleteUser };