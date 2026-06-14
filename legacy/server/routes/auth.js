/**
 * routes/auth.js — Login y Registro
 * Token: base64url(JSON) sin criptografía real (demo).
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const router  = express.Router();

const DB_PATH = path.join(__dirname, '../db.json');

/* ── Helpers ── */
function loadDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

function signToken(payload) {
  const data = { ...payload, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  return Buffer.from(JSON.stringify(data)).toString('base64url');
}

function verifyToken(token) {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

/* ══════════════════════════════════════
   POST /api/auth/login
   Body: { email, password }
   Returns: { token, user }
══════════════════════════════════════ */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  const db   = loadDB();
  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: 'No encontramos una cuenta con esas credenciales. Verifica tu email o contraseña.',
    });
  }

  /* No enviar la contraseña en la respuesta */
  const { password: _p, ...safeUser } = user;

  const token = signToken({ id: user.id, rol: user.rol, email: user.email });

  res.json({ token, user: safeUser });
});

/* ══════════════════════════════════════
   POST /api/auth/register
   Body: { rol, nombre, email, password, carrera?, empresa?, cargo? }
   Returns: { token, user }
══════════════════════════════════════ */
router.post('/register', (req, res) => {
  const { rol, nombre, email, password, carrera, empresa, cargo, ruc } = req.body;

  if (!rol || !nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const db = loadDB();

  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese email. Inicia sesión.' });
  }

  const newUser = {
    id:             'U' + Date.now(),
    email:          email.toLowerCase().trim(),
    password,
    rol,
    nombre,
    nombre_corto:   nombre.split(' ')[0],
    avatar_initial: nombre.charAt(0).toUpperCase(),
    ...(rol === 'egresado'  && { carrera: carrera || '', facultad: '', anio_egreso: new Date().getFullYear() }),
    ...(rol === 'empleador' && { empresa: empresa || '', cargo: cargo || '', ruc: ruc || '' }),
    ...(rol === 'admin'     && { cargo: cargo || 'Administrador' }),
  };

  db.users.push(newUser);
  saveDB(db);

  const { password: _p, ...safeUser } = newUser;
  const token = signToken({ id: newUser.id, rol: newUser.rol, email: newUser.email });

  res.status(201).json({ token, user: safeUser });
});

/* ══════════════════════════════════════
   GET /api/auth/me
   Header: Authorization: Bearer <token>
   Returns: { user }
══════════════════════════════════════ */
router.get('/me', (req, res) => {
  const auth  = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Sesión inválida o expirada. Inicia sesión nuevamente.' });
  }

  const db   = loadDB();
  const user = db.users.find(u => u.id === payload.id);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  const { password: _p, ...safeUser } = user;
  res.json({ user: safeUser });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
