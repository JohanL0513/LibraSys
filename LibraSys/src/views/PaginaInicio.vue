<template>
  <section class="pagina-inicio">
    <div class="contenido">
      <h1>Bienvenido a <span class="marca">Libra Sys</span></h1>
      <h2>Biblioteca Virtual</h2>
      <p>Aprende, investiga y crece con acceso inmediato a libros y recursos desde cualquier lugar del mundo.</p>

      <!-- Menú debajo -->
      <div class="menu-botones">
        <router-link to="/">Inicio</router-link>
        <router-link to="/libros">Libros</router-link>
        <router-link to="/prestamos">Préstamos</router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PaginaInicio",
};
</script>

<style scoped>
.pagina-inicio {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  background: linear-gradient(to bottom, #0d1b2a, #1b263b, #415a77);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.marca {
  color: #4fc3f7;
}

.menu-botones {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.menu-botones a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid #4fc3f7;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.menu-botones a:hover {
  background-color: #4fc3f7;
  color: #0d1b2a;
}
</style>