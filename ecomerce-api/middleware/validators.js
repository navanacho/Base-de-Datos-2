const { body, query, param } = require('express-validator');

// Validaciones para Usuarios
const validateUser = {
  create: [
    body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role').optional().isIn(['cliente', 'admin']).withMessage('Rol inválido')
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role').optional().isIn(['cliente', 'admin']).withMessage('Rol inválido')
  ],
  delete: [
    param('id').isMongoId().withMessage('ID de usuario inválido')
  ]
};

// Validaciones para Productos
const validateProduct = {
  create: [
    body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    body('category').isMongoId().withMessage('ID de categoría inválido'),
    body('brand').optional().trim().notEmpty().withMessage('La marca no puede estar vacía si se envía')
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('price').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    body('category').optional().isMongoId().withMessage('ID de categoría inválido'),
    body('brand').optional().trim().notEmpty().withMessage('La marca no puede estar vacía si se envía')
  ],
  updateStock: [
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
  ],
  delete: [
    param('id').isMongoId().withMessage('ID de producto inválido')
  ]
};

// Validaciones para Categorías
const validateCategory = {
  create: [
    body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('description').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía si se envía')
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('description').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía si se envía')
  ],
  delete: [
    param('id').isMongoId().withMessage('ID de categoría inválido')
  ]
};

// Validaciones para Carrito
const validateCart = {
  addItem: [
    param('usuarioId').isMongoId().withMessage('ID de usuario inválido'),
    body('productId').isMongoId().withMessage('ID de producto inválido'),
    body('quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1')
  ],
  updateItem: [
    param('usuarioId').isMongoId().withMessage('ID de usuario inválido'),
    body('productId').isMongoId().withMessage('ID de producto inválido'),
    body('quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1')
  ],
  removeItem: [
    param('usuarioId').isMongoId().withMessage('ID de usuario inválido'),
    body('productId').isMongoId().withMessage('ID de producto inválido')
  ],
  clear: [
    param('usuarioId').isMongoId().withMessage('ID de usuario inválido')
  ]
};

// Validaciones para Pedidos
const validateOrder = {
  create: [
    body('paymentMethod').trim().notEmpty().withMessage('Método de pago es obligatorio')
  ],
  updateStatus: [
    body('status').isIn(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']).withMessage('Estado inválido'),
    param('id').isMongoId().withMessage('ID de pedido inválido')
  ],
  delete: [
    param('id').isMongoId().withMessage('ID de pedido inválido')
  ]
};

// Validaciones para Reseñas
const validateReview = {
  create: [
    body('productId').isMongoId().withMessage('ID de producto inválido'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser entre 1 y 5'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('El comentario no puede superar los 500 caracteres')
  ],
  update: [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser entre 1 y 5'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('El comentario no puede superar los 500 caracteres'),
    param('id').isMongoId().withMessage('ID de reseña inválido')
  ],
  delete: [
    param('id').isMongoId().withMessage('ID de reseña inválido')
  ]
};

module.exports = {
  validateUser,
  validateProduct,
  validateCategory,
  validateCart,
  validateOrder,
  validateReview
};