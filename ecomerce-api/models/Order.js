// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  paymentMethod: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);