/**
 * routes/postulaciones.js
 * GET  /api/postulaciones        — las del usuario autenticado
 * POST /api/postulaciones        — crear nueva postulación
 * GET  /api/postulaciones/:id    — detalle de una postulación
 * PATCH /api/postulaciones/:id/estado — actualizar estado (admin/empleador)
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const router  = express.Router();

const DB_PATH = path.join(__dirname, '../db.json');
const authModule = require('./auth');
const verifyToken = authModule.verifyToken;

function loadDB() { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
function saveDB(db) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8'); }

function authMiddleware(req, res, next) {
  const token   = (req.headers.authorization || '').replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'No autenticado.' });
  req.user = payload;
  next();
}

/* GET /api/postulaciones */
router.get('/', authMiddleware, (req, res) => {
  const db = loadDB();

  // Si es admin o empleador, pueden ver todas con filtros
  let posts = db.postulaciones;
  if (req.user.rol === 'egresado') {
    posts = posts.filter(p => p.userId === req.user.id);
  }
  if (req.query.userId) posts = posts.filter(p => p.userId === req.query.userId);
  if (req.query.empleoId) posts = posts.filter(p => p.empleoId === req.query.empleoId);
  if (req.query.estado) posts = posts.filter(p => p.estado === req.query.estado);

  // Ordenar por fecha DESC
  posts = posts.sort((a, b) => new Date(b.fecha_postulacion) - new Date(a.fecha_postulacion));

  res.json({ postulaciones: posts, total: posts.length });
});

/* POST /api/postulaciones */
router.post('/', authMiddleware, (req, res) => {
  if (req.user.rol !== 'egresado') {
    return res.status(403).json({ error: 'Solo egresados pueden postular.' });
  }

  const { empleoId } = req.body;
  if (!empleoId) return res.status(400).json({ error: 'empleoId es requerido.' });

  const db = loadDB();

  // Verificar duplicado
  const exists = db.postulaciones.find(p => p.userId === req.user.id && p.empleoId === empleoId);
  if (exists) return res.status(409).json({ error: 'Ya postulaste a esta vacante.', postulacion: exists });

  const nueva = {
    id:                  'POST-' + Date.now(),
    userId:              req.user.id,
    empleoId,
    estado:              'Enviada',
    fecha_postulacion:   new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    nota_empresa:        null,
  };

  db.postulaciones.push(nueva);
  saveDB(db);

  res.status(201).json({ postulacion: nueva, mensaje: '¡Postulación enviada exitosamente!' });
});

/* PATCH /api/postulaciones/:id/estado */
router.patch('/:id/estado', authMiddleware, (req, res) => {
  const db    = loadDB();
  const idx   = db.postulaciones.findIndex(p => p.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Postulación no encontrada.' });

  const { estado, nota_empresa } = req.body;
  const estadosValidos = ['Enviada', 'En revisión', 'Entrevista programada', 'Oferta recibida', 'Rechazada'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido.', estadosValidos });
  }

  db.postulaciones[idx].estado              = estado;
  db.postulaciones[idx].fecha_actualizacion = new Date().toISOString();
  if (nota_empresa !== undefined) db.postulaciones[idx].nota_empresa = nota_empresa;

  saveDB(db);
  res.json({ postulacion: db.postulaciones[idx], mensaje: 'Estado actualizado.' });
});

module.exports = router;
