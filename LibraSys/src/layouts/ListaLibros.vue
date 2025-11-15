<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h1 class="logo">LibraSys</h1>
      <nav>
        <ul>
          <li :class="{ activo: $route.name === 'Biblioteca' }" @click="irBiblioteca">Biblioteca</li>
          <li :class="{ activo: $route.name === 'Prestamos' }" @click="irPrestamos">Préstamos</li>
          <li @click="irReservas">Reservas</li>
          <li @click="irSalir">Salir</li>
        </ul>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <main class="contenido">
      <header class="topbar">
        <div class="busqueda">
          <input
            v-model="termino"
            @keyup.enter="buscar"
            type="text"
            placeholder="Buscar..."
          />
        </div>
        <div class="usuario">
          <div class="avatar"></div>
          <div>
            <p class="nombre">Luis Lopez</p>
            <p class="rol">Administrador</p>
          </div>
        </div>
      </header>

      <!-- 👇 Aquí se cargan las vistas hijas -->
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      termino: "",
    };
  },
  methods: {
    buscar() {
      console.log("Buscando:", this.termino);
    },
    irBiblioteca() {
      this.$router.push({ name: "Biblioteca" });
    },
    irPrestamos() {
      this.$router.push({ name: "Prestamos" });
    },
    irReservas() {
      this.$router.push({ name: "Reservas" });
   },
    irSalir() {
      this.$router.push({ name: "Inicio" });
    },
  },
};
</script>

<style src="@/assets/listaLibros.css"></style>