// backend/src/controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userModel');
const pool = require('../db');

const SALT_ROUNDS = 10;

// Register
async function register(req, res) {
  try {
    const { nombre, segundoNombre, apellido, email, pais, telefono, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ error: 'Nombre, email y password son obligatorios' });

    const exist = await userModel.findByEmail(email);
    if (exist) return res.status(409).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const nombreCompleto = nombre + (segundoNombre ? ' ' + segundoNombre : '');

    const user = await userModel.createUser({
      nombre: nombreCompleto,
      apellido,
      email,
      telefono,
      pais,
      password_hash: hash
    });

    return res.status(201).json({ message: 'Usuario registrado', usuario: user });
  } catch (err) {
    console.error('Error en register controller:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Login -> generar 2FA
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    // generar 2FA
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + config.twofa.ttlMs);

    await pool.query(
      'INSERT INTO two_factor_sessions (user_id, code, expires_at) VALUES ($1,$2,$3)',
      [user.id, code, expiresAt]
    );

    console.log(`2FA code for user ${user.email}: ${code} (expires at ${expiresAt.toISOString()})`);

    return res.json({ message: 'Código 2FA enviado', need2FA: true, userId: user.id });
  } catch (err) {
    console.error('Error en login controller:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Verify 2FA -> devuelve JWT
async function verify2FA(req, res) {
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

    if (sess.attempts >= 5) return res.status(429).json({ error: 'Demasiados intentos' });

    if (String(sess.code).trim() !== String(code).trim()) {
      await pool.query('UPDATE two_factor_sessions SET attempts = attempts + 1 WHERE id = $1', [sess.id]);
      return res.status(401).json({ error: 'Código inválido' });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const token = jwt.sign(
      { sub: user.id, name: user.nombre, email: user.email, role: user.role || 'user' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    await pool.query('DELETE FROM two_factor_sessions WHERE id = $1', [sess.id]);

    return res.json({ message: 'Autenticado', token });
  } catch (err) {
    console.error('Error en verify2FA controller:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Reenviar código
async function resend2FA(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Falta userId' });

    await pool.query('DELETE FROM two_factor_sessions WHERE user_id = $1', [userId]);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + config.twofa.ttlMs);
    await pool.query('INSERT INTO two_factor_sessions (user_id, code, expires_at) VALUES ($1,$2,$3)', [userId, code, expiresAt]);

    console.log(`Resend 2FA code for userId ${userId}: ${code} (expires ${expiresAt.toISOString()})`);
    return res.json({ message: 'Nuevo código 2FA enviado' });
  } catch (err) {
    console.error('Error en resend2FA controller:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  register,
  login,
  verify2FA,
  resend2FA
};
