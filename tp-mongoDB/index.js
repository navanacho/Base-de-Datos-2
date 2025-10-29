// index.js
const express = require('express');
require('dotenv').config();
const libroRoutes = require('./routes/libros');
const cursoRoutes = require('./routes/cursos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use('/api', libroRoutes);
app.use('/api', cursoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API para TP MongoDB – CRUD y Agregaciones' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});