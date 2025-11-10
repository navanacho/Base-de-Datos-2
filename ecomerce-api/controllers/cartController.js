const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Agregar un producto al carrito
const addCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.params.usuarioId;

    // Verificar que el producto exista
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    // Verificar que la cantidad no exceda stock
    if (quantity > product.stock) {
      return res.status(400).json({ success: false, error: `No hay suficiente stock. Disponible: ${product.stock}` });
    }
      // Buscar o crear el carrito
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [{ productId, quantity }] });
    } else {
      // Verificar si el producto ya está en el carrito
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        // Actualizar cantidad si ya existe
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({ success: false, error: `No hay suficiente stock. Disponible: ${product.stock}` });
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        // Agregar nuevo item
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    }

    res.status(201).json({ success: true,  cart });
  } catch (err) {
    next(err);
  }
};



// Actualizar cantidad de un producto en el carrito
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.params.usuarioId;

    // Verificar que el producto exista
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    // Verificar que la cantidad no exceda stock
    if (quantity > product.stock) {
      return res.status(400).json({ success: false, error: `No hay suficiente stock. Disponible: ${product.stock}` });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado en el carrito' });
    }

    if (quantity <= 0) {
      // Si cantidad <= 0, remover el producto del carrito
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ success: true,  cart });
  } catch (err) {
    next(err);
  }
};



// Eliminar un producto específico del carrito
const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body; // o podría ser un parámetro en la URL como /:usuarioId/items/:productId
    const userId = req.params.usuarioId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado en el carrito' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.json({ success: true, message: 'Producto eliminado del carrito',  cart });
  } catch (err) {
    next(err);
  }
};


// Vaciar todo el carrito
const clearCart = async (req, res, next) => {
  try {
    const userId = req.params.usuarioId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();

    res.json({ success: true, message: 'Carrito vaciado correctamente',  cart });
  } catch (err) {
    next(err);
  }
};



//Obtener carrito del usuario
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




module.exports = { 
  getCart,
  getCartTotal,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
};