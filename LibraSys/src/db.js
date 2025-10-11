
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',       
  database: 'librasys',    
  password: '0513',      
  port: 5432,              
});


pool.connect()
  .then(client => {
    console.log('Conectado a PostgreSQL (librasys)');
    client.release();
  })
  .catch(err => console.error('Error de conexión:', err.stack));

module.exports = {
  query: (text, params) => pool.query(text, params),
};

//node src/db.js
