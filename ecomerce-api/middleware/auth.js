
const jwt = require('jsonwebtoken');

// Verifica token y asigna req.user
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
  }
};

// Solo admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Acceso denegado: solo administradores' });
  }
  next();
};

// Solo dueño del recurso o admin
const ownerOrAdmin = (req, res, next) => {
  const userIdFromParam = req.params.userId || req.params.id;
  if (req.user.role === 'admin' || req.user.id === userIdFromParam) {
    return next();
  }
  return res.status(403).json({ success: false, error: 'Acceso denegado' });
};

module.exports = { protect, adminOnly, ownerOrAdmin };