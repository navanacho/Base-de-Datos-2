const User = require('../models/user');
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//const { use } = require('react');

//Obtener todos los usuarios (solo el admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

//Obtener usuarios pór ID 
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

//Crear usuario (registro)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, phone, role = 'cliente' } = req.body;
    const user = await User.create({ name, email, password, address, phone, role });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {expiresIn: '1d'}
    );

    res.status(201).json({ success: true, token, data: user });
  } catch (err) {
    next(err);
  }
};

//Eliminar usuario
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

//Login de usuario
const loginUser = async(req, res, next) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user){
      return res.status(400).json({ success: false, error: 'Usuario no encontrado '});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Contraseña incorrecta '});
    }

    const token = jwt.sign(
      { id: user._id, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: '7d'}
    );

    res.json({ success: true, token });
  } catch (err) {
    next(err);
}
};



module.exports = { 
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  loginUser };