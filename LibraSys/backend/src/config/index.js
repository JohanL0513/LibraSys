// backend/src/config/index.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASS || '0513',
    port: Number(process.env.DB_PORT || 5432)
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  twofa: {
    
    ttlMs: 5 * 60 * 1000 // 5 minutos
  }
};    
