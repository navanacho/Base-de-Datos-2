// routes/cursos.js
const express = require('express');
const { connectDB } = require('../models/db');
const { ObjectId } = require('mongodb');
const router = express.Router();

// CRUD Estudiantes
router.post('/estudiantes', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('estudiantes').insertOne(req.body);
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/estudiantes', async (req, res) => {
  try {
    const db = await connectDB();
    const estudiantes = await db.collection('estudiantes').find({}).toArray();
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar email
router.patch('/estudiantes/:id/email', async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { email } = req.body;
    const result = await db.collection('estudiantes').updateOne(
      { _id: new ObjectId(id) },
      { $set: { email } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json({ message: 'Email actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Cursos
router.post('/cursos', async (req, res) => {
  try {
    const db = await connectDB();
    if (req.body.estudiante_ids) {
      req.body.estudiante_ids = req.body.estudiante_ids.map(id => new ObjectId(id));
    }
    const result = await db.collection('cursos').insertOne(req.body);
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar cursos con nombres de estudiantes
router.get('/cursos-con-estudiantes', async (req, res) => {
  try {
    const db = await connectDB();
    const pipeline = [
      {
        $lookup: {
          from: 'estudiantes',
          localField: 'estudiante_ids',
          foreignField: '_id',
          as: 'estudiantes'
        }
      },
      {
        $project: {
          titulo: 1,
          descripcion: 1,
          'estudiantes.nombre': 1
        }
      }
    ];
    const result = await db.collection('cursos').aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar curso (solo el curso, no hay referencia inversa en estudiantes)
router.delete('/cursos/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const result = await db.collection('cursos').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json({ message: 'Curso eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregaciones
router.get('/cursos/conteo-estudiantes', async (req, res) => {
  try {
    const db = await connectDB();
    const pipeline = [
      {
        $project: {
          titulo: 1,
          total_estudiantes: { $size: { $ifNull: ['$estudiante_ids', []] } }
        }
      }
    ];
    const result = await db.collection('cursos').aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/estudiantes/multiples-cursos', async (req, res) => {
  try {
    const db = await connectDB();
    const pipeline = [
      {
        $lookup: {
          from: 'cursos',
          localField: '_id',
          foreignField: 'estudiante_ids',
          as: 'cursos_inscritos'
        }
      },
      {
        $match: {
          'cursos_inscritos.1': { $exists: true } // al menos 2 cursos
        }
      },
      {
        $project: {
          nombre: 1,
          total_cursos: { $size: '$cursos_inscritos' }
        }
      }
    ];
    const result = await db.collection('estudiantes').aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;