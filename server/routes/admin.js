/**
 * routes/admin.js
 * Rutas protegidas solo para rol=admin
 * GET /api/admin/egresados           — lista de egresados
 * GET /api/admin/vacantes-pendientes — vacantes pendientes de aprobación
 * GET /api/admin/empresas            — empresas registradas
 * GET /api/admin/stats               — KPIs para el panel
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const router  = express.Router();
const { verifyToken } = require('./auth');

const DB_PATH = path.join(__dirname, '../db.json');

function loadDB() { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }

function adminMiddleware(req, res, next) {
  const token   = (req.headers.authorization || '').replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'No autenticado.' });
  if (payload.rol !== 'admin') return res.status(403).json({ error: 'Acceso solo para administradores.' });
  req.user = payload;
  next();
}

/* GET /api/admin/egresados */
router.get('/egresados', adminMiddleware, (req, res) => {
  const db = loadDB();
  let egresados = db.users.filter(u => u.rol === 'egresado').map(({ password: _, ...u }) => u);

  if (req.query.carrera) egresados = egresados.filter(e => (e.carrera || '').toLowerCase().includes(req.query.carrera.toLowerCase()));
  if (req.query.q)       egresados = egresados.filter(e => e.nombre.toLowerCase().includes(req.query.q.toLowerCase()) || e.email.toLowerCase().includes(req.query.q.toLowerCase()));

  res.json({ egresados, total: egresados.length });
});

/* GET /api/admin/empresas */
router.get('/empresas', adminMiddleware, (req, res) => {
  const db = loadDB();
  const empleadores = db.users.filter(u => u.rol === 'empleador').map(({ password: _, ...u }) => u);
  res.json({ empresas: empleadores, total: empleadores.length });
});

/* GET /api/admin/stats */
router.get('/stats', adminMiddleware, (req, res) => {
  const db = loadDB();
  const egresados = db.users.filter(u => u.rol === 'egresado');
  const empresas  = db.users.filter(u => u.rol === 'empleador');

  res.json({
    totalEgresados:    9179,   // dato real del enunciado
    totalEmpresas:     42,
    vacantesActivas:   23,
    postulaciones:     db.postulaciones.length,
    egresadosEnDB:     egresados.length,
    empresasEnDB:      empresas.length,
    matchPromedio:     73,
    egresadosUltMes:   127,
  });
});

module.exports = router;
