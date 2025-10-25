// backend/index.js

const app = require('./src/app'); // Importa la app principal desde /src/app.js

const PORT = process.env.PORT || 3000; // Puerto del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend iniciado en http://localhost:${PORT}`);
});
