<template>
  <div class="lista-libros">
    <!-- Header con búsqueda -->
    <header class="header-libros">
      <div class="left">
        <h1 class="logo">LibraSys</h1>
        <input
          v-model="termino"
          @keyup.enter="buscar"
          type="text"
          placeholder="Buscar títulos, autores, categorías..."
          class="search-bar"
        />
      </div>

      <div class="right">
  <router-link to="/" class="nav-btn">Inicio</router-link>
  <router-link to="/libros" class="nav-btn">Libros</router-link>
  <router-link to="/prestamos" class="nav-btn">Préstamos</router-link>
</div>
    </header>

    <!-- Barra de menús desplegables -->
    <nav class="submenus" ref="submenus">
      <ul class="menu-list">
        <li
          v-for="(cat, idx) in categorias"
          :key="cat.id"
          class="menu-item"
          @mouseenter="hoverIndex = idx"
          @mouseleave="hoverIndex = null"
        >
          <button
            class="menu-button"
            @click.stop="toggleMenu(idx)"
            :aria-expanded="openIndex === idx"
            :aria-controls="'submenu-' + idx"
          >
            {{ cat.titulo }}
            <span class="chev" :class="{ open: openIndex===idx || hoverIndex===idx }">▾</span>
          </button>

          <!-- Panel desplegable -->
          <div
            class="dropdown"
            :id="'submenu-' + idx"
            v-show="openIndex === idx || hoverIndex === idx"
          >
            <ul>
              <li v-for="(sub, sIdx) in cat.items" :key="sIdx">
                <a href="#" @click.prevent="filtrarCategoria(cat.titulo, sub)">{{ sub }}</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Contenido: Novedades / Grid de libros -->
    <section class="novedades">
      <h2>Novedades</h2>
      <div class="novedades-grid">
        <div v-for="(libro, i) in destacados" :key="i" class="libro-card">
          <img :src="libro.portada" :alt="libro.titulo" class="portada" />
          <h3>{{ libro.titulo }}</h3>
          <p class="autor">{{ libro.autor }}</p>
        </div>
      </div>
    </section>

    <section class="todos-libros">
      <h2>Catálogo completo</h2>
      <div class="libros-grid">
        <div v-for="(libro, index) in librosFiltrados" :key="index" class="libro-card">
          <img :src="libro.portada" :alt="libro.titulo" class="portada" />
          <h3>{{ libro.titulo }}</h3>
          <p class="autor">{{ libro.autor }}</p>
          <button class="btn-prestar">📖 Ver más</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ListaLibros from "@/components/ListaLibros.js";
export default ListaLibros;
</script>
