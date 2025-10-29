// routes/libros.js
const express = require('express');
const { connectDB } = require('../models/db');
const router = express.Router();

// Helper para ObjectId
const { ObjectId } = require('mongodb');

// 1. CRUD Autores
router.post('/autores', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('autores').insertOne(req.body);
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/autores', async (req, res) => {
  try {
    const db = await connectDB();
    const autores = await db.collection('autores').find({}).toArray();
    res.json(autores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CRUD Libros
router.post('/libros', async (req, res) => {
  try {
    const db = await connectDB();
    // Asegúrate de que autor_id sea ObjectId
    if (req.body.autor_id) {
      req.body.autor_id = new ObjectId(req.body.autor_id);
    }
    const result = await db.collection('libros').insertOne(req.body);
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: 'Error al insertar libro: ' + err.message });
  }
});

router.get('/libros', async (req, res) => {
  try {
    const db = await connectDB();
    const libros = await db.collection('libros').find({}).toArray();
    res.json(libros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Listar libros con nombre del autor (agregación)
router.get('/libros-con-autor', async (req, res) => {
  try {
    const db = await connectDB();
    const pipeline = [
      {
        $lookup: {
          from: 'autores',
          localField: 'autor_id',
          foreignField: '_id',
          as: 'autor'
        }
      },
      { $unwind: '$autor' },
      {
        $project: {
          _id: 1,
          titulo: 1,
          paginas: 1,
          categorias: 1,
          'autor.nombre': 1
        }
      }
    ];
    const resultado = await db.collection('libros').aggregate(pipeline).toArray();
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Actualizar páginas de un libro
router.patch('/libros/:id/paginas', async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { paginas } = req.body;
    const result = await db.collection('libros').updateOne(
      { _id: new ObjectId(id) },
      { $set: { paginas } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json({ message: 'Páginas actualizadas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Eliminar autor y sus libros
router.delete('/autores/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const autorId = new ObjectId(id);

    // Primero eliminar libros
    await db.collection('libros').deleteMany({ autor_id: autorId });
    // Luego eliminar autor
    const result = await db.collection('autores').deleteOne({ _id: autorId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json({ message: 'Autor y sus libros eliminados' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregaciones
router.get('/autores/promedio-paginas', async (req, res) => {
  try {
    const db = await connectDB();
    const pipeline = [
      { $lookup: { from: 'autores', localField: 'autor_id', foreignField: '_id', as: 'autor' } },
      { $unwind: '$autor' },
      {
        $group: {
          _id: '$autor.nombre',
          promedio_paginas: { $avg: '$paginas' }
        }
      }
    ];
    const result = await db.collection('libros').aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/autores/conteo-libros', async (req, res) => {
  try {
    const db = await connectDB();
    const pipeline = [
      { $lookup: { from: 'autores', localField: 'autor_id', foreignField: '_id', as: 'autor' } },
      { $unwind: '$autor' },
      {
        $group: {
          _id: '$autor.nombre',
          total_libros: { $sum: 1 }
        }
      }
    ];
    const result = await db.collection('libros').aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;