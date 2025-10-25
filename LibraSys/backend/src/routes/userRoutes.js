// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const TWOFA_TTL_MS = 5 * 60 * 1000; // 5 minutos

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

// ----------------- REGISTER -----------------
router.post('/register', async (req, res) => {
  try {
    const { nombre, segundoNombre, apellido, email, pais, telefono, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ error: 'Nombre, email y password son obligatorios' });

    // Verificar duplicado
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const nombreCompleto = nombre + (segundoNombre ? ' ' + segundoNombre : '');
    const insertQ = `
      INSERT INTO users (nombre, apellido, email, telefono, pais, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nombre, apellido, email, telefono, pais, created_at;
    `;
    const values = [nombreCompleto, apellido || null, email, telefono || null, pais || null, hash];
    const result = await pool.query(insertQ, values);

    return res.status(201).json({ message: 'Usuario registrado', usuario: result.rows[0] });
  } catch (err) {
    console.error('Error en /api/users/register:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ----------------- LOGIN (password -> generar 2FA) -----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });

    const userRes = await pool.query('SELECT id, nombre, email, password_hash, role FROM users WHERE email = $1', [email]);
    if (!userRes.rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = userRes.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + TWOFA_TTL_MS);

    await pool.query(
      `INSERT INTO two_factor_sessions (user_id, code, expires_at) VALUES ($1, $2, $3)`,
      [user.id, code, expiresAt]
    );

    // En desarrollo mostramos el código en consola. En producción, enviar por email/SMS.
    console.log(`2FA code for user ${user.email}: ${code} (expires at ${expiresAt.toISOString()})`);

    return res.json({ message: 'Código 2FA enviado', need2FA: true, userId: user.id });
  } catch (err) {
    console.error('Error en /api/users/login:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ----------------- VERIFY 2FA -----------------
router.post('/verify-2fa', async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) return res.status(400).json({ error: 'Faltan datos' });

    const q = `
      SELECT * FROM two_factor_sessions
      WHERE user_id = $1 AND expires_at > now()
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const sessRes = await pool.query(q, [userId]);
    if (!sessRes.rows.length) return res.status(400).json({ error: 'Sesión 2FA no encontrada o expirada' });
    const sess = sessRes.rows[0];

    if (sess.attempts >= 5) return res.status(429).json({ error: 'Demasiados intentos. Solicita nuevo código.' });

    const codeStr = String(code).trim();
    const sessCodeStr = String(sess.code).trim();

    if (sessCodeStr !== codeStr) {
      await pool.query('UPDATE two_factor_sessions SET attempts = attempts + 1 WHERE id = $1', [sess.id]);
      return res.status(401).json({ error: 'Código inválido' });
    }

    const userRes = await pool.query('SELECT id, nombre, email, role FROM users WHERE id = $1', [userId]);
    if (!userRes.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    const user = userRes.rows[0];

    const token = jwt.sign(
      { sub: user.id, name: user.nombre, email: user.email, role: user.role || 'user' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // eliminar la sesión usada
    await pool.query('DELETE FROM two_factor_sessions WHERE id = $1', [sess.id]);

    return res.json({ message: 'Autenticado', token });
  } catch (err) {
    console.error('Error en /api/users/verify-2fa:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ----------------- RESEND 2FA ----------------- (genera un nuevo código)
router.post('/resend-2fa', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Falta userId' });

    // eliminar sesiones antiguas (opcional)
    await pool.query('DELETE FROM two_factor_sessions WHERE user_id = $1', [userId]);

    const code = generateCode();
    const expiresAt = new Date(Date.now() + TWOFA_TTL_MS);
    await pool.query('INSERT INTO two_factor_sessions (user_id, code, expires_at) VALUES ($1,$2,$3)', [userId, code, expiresAt]);

    console.log(`Resend 2FA code for userId ${userId}: ${code} (expires ${expiresAt.toISOString()})`);
    return res.json({ message: 'Nuevo código 2FA enviado' });
  } catch (err) {
    console.error('Error en /api/users/resend-2fa:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

