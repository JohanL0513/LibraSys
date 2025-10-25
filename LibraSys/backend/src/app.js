// backend/src/app.js

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // importamos las rutas de usuarios

const app = express();

// Permitir solicitudes desde el frontend (Vue en localhost:8080)
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware para leer JSON
app.use(express.json());

// Rutas principales
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend de LibraSys funcionando 🚀');
});

module.exports = app;
