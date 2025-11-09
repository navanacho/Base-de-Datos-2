const Order = require('../models/Order');
const User = require('../models/user');

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

module.exports = {
  getAllOrders,
  getOrdersByUser,
  getStats,
  updateOrderStatus
};