const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.usuarioId })
      .populate('items.productId', 'name price');
    if (!cart) return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

const getCartTotal = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.usuarioId }).populate('items.productId');
    if (!cart) return res.status(404).json({ success: false, error: 'Carrito no encontrado' });

    let total = 0;
    const itemsWithSubtotal = cart.items.map(item => {
      const subtotal = item.productId.price * item.quantity;
      total += subtotal;
      return { ...item.toObject(), subtotal };
    });

    res.json({ success: true, data: { items: itemsWithSubtotal, total } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, getCartTotal };