// backend/src/models/userModel.js
// Aquí centralizamos las consultas relacionadas con 'users'
const pool = require('../db');

async function findByEmail(email) {
  const q = 'SELECT id, nombre, apellido, email, password_hash, role FROM users WHERE email = $1';
  const res = await pool.query(q, [email]);
  return res.rows[0] || null;
}

async function createUser({ nombre, apellido, email, telefono, pais, password_hash }) {
  const q = `
    INSERT INTO users (nombre, apellido, email, telefono, pais, password_hash)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id, nombre, apellido, email, telefono, pais, role, created_at;
  `;
  const values = [nombre, apellido, email, telefono, pais, password_hash];
  const res = await pool.query(q, values);
  return res.rows[0];
}

async function findById(id) {
  const q = 'SELECT id, nombre, apellido, email, telefono, pais, role FROM users WHERE id = $1';
  const res = await pool.query(q, [id]);
  return res.rows[0] || null;
}

module.exports = {
  findByEmail,
  createUser,
  findById
};
