<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h1 class="logo">LibraSys</h1>
      <nav>
        <ul>
          <li class="activo"> Biblioteca</li>
          <li> Reserva de libros</li>
          <li> Configuración</li>
          <li> Soporte</li>
          <li> Salir</li>
        </ul>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <main class="contenido">
      <!-- Header -->
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

      <!-- Sección principal -->
      <section class="coleccion">
        <h2>Índice</h2>

        <!-- 🔤 ÍNDICE DE LETRAS -->
        <div class="indice-letras">
          <button
            v-for="(letra, i) in letras"
            :key="i"
            @click="filtrarPorLetra(letra)"
            :class="{ activo: filtroLetra === letra }"
          >
            {{ letra }}
          </button>
        </div>
      </section>

      <!-- 📚 Listado de libros -->
      <section class="libros-lista">
        <div
          v-for="(libro, i) in librosFiltrados"
          :key="i"
          class="libro-card"
        >
          <img :src="libro.portada" :alt="libro.titulo" />
          <h3>{{ libro.titulo }}</h3>
          <p class="autor">{{ libro.autor }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import ListaLibros from "@/components/ListaLibros.js";
export default ListaLibros;
</script>

<style src="@/assets/listaLibros.css"></style>
