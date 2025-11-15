<template>
  <section class="detalle-libro" v-if="cargando">
    <p class="cargando">Cargando información del libro...</p>
  </section>

  <section class="detalle-libro" v-else-if="libro">
    <div class="tarjeta-libro">
      <img :src="libro.imagen || placeholder" :alt="libro.titulo" class="portada" />
      <div class="info-libro">
        <h2 class="titulo">{{ libro.titulo }}</h2>
        <p class="autor">Autor: {{ libro.autor }}</p>
        <p class="anio">Año: {{ libro.año || "Desconocido" }}</p>
        <p class="categoria">Categoría: {{ libro.categoria || "N/A" }}</p>
        <p class="descripcion">{{ libro.descripcion || "Sin descripción disponible." }}</p>

        <button class="btn-previsualizar" @click="mostrarModal = true">
          Previsualizar
        </button>
        <button class="btn-volver" @click="volverBiblioteca">
          ← Volver
        </button>
      </div>
    </div>


    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-contenido">
        <h3>Previsualización: {{ libro.titulo }}</h3>

        <div v-if="libro.pdf" class="pdf-container">
          <iframe
            :src="pdfPreviewUrl(libro.pdf)"
            width="100%"
            height="100%"
            style="border: none;"
          ></iframe>
        </div>

        <p v-else>No hay PDF disponible para este libro.</p>

        <button class="btn-cerrar" @click="cerrarModal">Cerrar</button>
      </div>
    </div>
  </section>

  <p v-else-if="error" class="mensaje-error">{{ error }}</p>
</template>

<script>
export default {
  name: "DetalleLibro",
  props: {
    id: { type: [String, Number], required: false },
  },

  data() {
    return {
      libro: null,
      cargando: true,
      error: null,
      apiBase: "https://0bb83f20-aad4-466f-b2d8-3b014ae922f3.mock.pstmn.io",
      redirectDelayMs: 1200,
      placeholder: "https://via.placeholder.com/200x300?text=Sin+imagen",
      mostrarModal: false,
    };
  },

  computed: {
    idResuelto() {
      return this.id ?? this.$route?.params?.id ?? null;
    },
  },

  async mounted() {
    await this.cargarListaYBuscarPorId(this.idResuelto);
  },

  watch: {
    "$route.params.id"() {
      this.cargarListaYBuscarPorId(this.idResuelto);
    },
  },

  methods: {
    volverBiblioteca() {
      this.$router.push({ name: "Biblioteca" });
    },

    cerrarModal() {
      this.mostrarModal = false;
    },

    pdfPreviewUrl(url) {
      if (!url) return null;
      const match = url.match(/\/d\/(.*?)\//);
      return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
    },

    async cargarListaYBuscarPorId(id) {
      this.cargando = true;
      this.error = null;
      this.libro = null;

      if (!id) {
        this.error = "ID inválido. Redirigiendo…";
        this.programarRedirect();
        this.cargando = false;
        return;
      }

      try {
        const res = await fetch(this.apiBase);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const lista = await res.json();
        const encontrado = lista.find((item) => String(item.id) === String(id));

        if (encontrado) {
          this.libro = encontrado;
        } else {
          this.error = `Libro con id ${id} no encontrado.`;
          this.programarRedirect();
        }
      } catch (err) {
        this.error = `Error al obtener información: ${err.message}`;
        this.programarRedirect();
      } finally {
        this.cargando = false;
      }
    },

    programarRedirect() {
      setTimeout(() => {
        this.$router.replace({ name: "ListaLibros" });
      }, this.redirectDelayMs);
    },
  },
};
</script>

<style scoped>
@import "@/assets/DetalleLibro.css";

</style>
