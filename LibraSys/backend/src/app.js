// backend/src/app.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Servidor backend de LibraSys funcionando 🚀'));

module.exports = app;
