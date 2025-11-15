<template>
  <section class="coleccion">
    <h2>Índice</h2>

    
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

  
    <div class="libros-lista">
      <div
        v-for="(libro, i) in librosFiltrados"
        :key="i"
        class="libro-card"
        @click="verDetalle(libro)"
      >
        <img :src="libro.imagen" :alt="libro.titulo" />
        <h3>{{ libro.titulo }}</h3>
        <p class="autor">{{ libro.autor }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import ListaLibros from "@/components/ListaLibros.js";

export default {
  ...ListaLibros,
  methods: {
    ...ListaLibros.methods,
    verDetalle(libro) {
      this.$router.push({ name: "DetalleLibro", params: { id: libro.id } });
    },
  },
};
</script>