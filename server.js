/**
 * CONECTA UNSA — server.js
 * Backend temporal Express para la Hackathon Transformagob 2026.
 * Sirve los archivos estáticos + API REST simulada.
 */

const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const app = express();

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

/* ── Servir archivos estáticos desde la raíz del proyecto ── */
app.use(express.static(path.join(__dirname)));

/* ── Rutas API ── */
app.use('/api/auth',          require('./server/routes/auth'));
app.use('/api/postulaciones', require('./server/routes/postulaciones'));
app.use('/api/empleos',       require('./server/routes/empleos'));
app.use('/api/admin',         require('./server/routes/admin'));

/* ── 404 personalizado — solo para peticiones de páginas HTML ── */
app.use((req, res) => {
  if (req.accepts('html') && !req.path.startsWith('/api')) {
    return res.status(404).sendFile(path.join(__dirname, '404.html'));
  }
  res.status(404).json({ error: 'Recurso no encontrado' });
});

/* ── Iniciar servidor ── */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   🎓  CONECTA UNSA — Backend Temporal    ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`\n   🌐  http://localhost:${PORT}`);
  console.log('\n   Usuarios de prueba:');
  console.log('   📚  Egresado  → ana@unsa.edu.pe       / unsa2025');
  console.log('   🏢  Empleador → empresa@yape.com.pe   / yape2025');
  console.log('   🛡️   Admin     → admin@unsa.edu.pe     / admin2025');
  console.log('\n   Ctrl+C para detener\n');
});
