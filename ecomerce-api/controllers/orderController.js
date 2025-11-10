const Order = require('../models/Order');
const User = require('../models/user');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};


// [NUEVO] Crear un pedido desde el carrito del usuario
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id; // del token
    const { paymentMethod } = req.body;

    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'El carrito está vacío' });
    }

    // Calcular total y crear items con subtotal
    let total = 0;
    const orderItems = cart.items.map(item => {
      const subtotal = item.productId.price * item.quantity;
      total += subtotal;
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        subtotal
      };
    });
    // Verificar stock de cada producto antes de crear el pedido
    for (const item of cart.items) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, error: `Stock insuficiente para ${product.name}` });
      }
    }

    // Crear el pedido
    const order = await Order.create({
      userId,
      items: orderItems,
      total,
      paymentMethod
    });

    // Actualizar stock de productos
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } } // Restar cantidad vendida
      );
    }

    // Vaciar el carrito
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true,  order });
  } catch (err) {
    next(err);
  }
};

// [NUEVO] Eliminar un pedido (solo dueño o admin)
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }
    res.json({ success: true, message: 'Pedido eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};





module.exports = {
  getAllOrders,
  getOrdersByUser,
  getStats,
  updateOrderStatus,
  createOrder,
  deleteOrder
};