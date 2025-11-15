<template>
  <section class="reserva-libro">
    <h2 class="titulo">Reservar libro</h2>
    <p class="subtitulo">Selecciona un libro disponible en la biblioteca.</p>

    <div v-if="cargando" class="cargando">
      <p>Cargando libros...</p>
    </div>

    <div v-else-if="error" class="mensaje-error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="lista-libros">
      <div v-for="libro in libros" :key="libro.id" class="tarjeta-libro">
        <img :src="libro.imagen || placeholder" alt="Portada del libro" class="portada" />
        <div class="info-libro">
          <h3 class="titulo-libro">{{ libro.titulo }}</h3>
          <p class="autor">Autor: {{ libro.autor }}</p>
          <center><button class="btn-reservar" @click="abrirModal(libro)">Reservar</button></center>
        </div>
      </div>
    </div>

    <!-- ✅ Modal de reserva -->
    <div v-if="mostrarModal" class="modal-fondo">
      <div class="modal">
        <h3>Reservar: {{ libroSeleccionado.titulo }}</h3>
        <img :src="libroSeleccionado.imagen" class="portada-modal" />

        <label for="fecha" class="label-fecha">Selecciona una fecha disponible:</label>
        <select v-model="fechaSeleccionada" id="fecha" class="select-fecha">
          <option disabled value="">-- Elige una fecha --</option>
          <option v-for="fecha in fechasDisponibles" :key="fecha" :value="fecha">
            {{ fecha }}
          </option>
        </select>

        <div class="acciones-modal">
          <button class="btn-confirmar" :disabled="!fechaSeleccionada" @click="confirmarReserva">
            Confirmar Reserva
          </button>
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- ✅ Mensaje de confirmación -->
    <div v-if="mensaje" class="confirmacion">
      <p>{{ mensaje }}</p>
      <button class="btn-volver" @click="mensaje = ''">Cerrar</button>
    </div>
  </section>
</template>

<script>
export default {
  name: "ReservarLibro",
  data() {
    return {
      libros: [],
      cargando: false,
      error: null,
      mensaje: "",
      mostrarModal: false,
      libroSeleccionado: {},
      fechaSeleccionada: "",
      fechasDisponibles: [],
      placeholder: "https://via.placeholder.com/200x300?text=Sin+Portada",
      apiBase: "https://0bb83f20-aad4-466f-b2d8-3b014ae922f3.mock.pstmn.io",
    };
  },

  async mounted() {
    this.cargando = true;
    try {
      const res = await fetch(this.apiBase);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        this.libros = data;
      } else {
        this.cargarLibrosLocales();
      }
    } catch (err) {
      console.error(err);
      this.error = "Error al cargar los libros, usando datos locales.";
      this.cargarLibrosLocales();
    } finally {
      this.cargando = false;
    }
  },

  methods: {
    cargarLibrosLocales() {
      this.libros = [
      ];
    },

    abrirModal(libro) {
      this.libroSeleccionado = libro;
      this.fechaSeleccionada = "";
      this.fechasDisponibles = this.generarFechasDisponibles();
      this.mostrarModal = true;
    },

    cerrarModal() {
      this.mostrarModal = false;
    },

    generarFechasDisponibles() {
      const hoy = new Date();
      return Array.from({ length: 5 }, (_, i) => {
        const fecha = new Date();
        fecha.setDate(hoy.getDate() + i + 1);
        return fecha.toISOString().split("T")[0];
      });
    },

    confirmarReserva() {
      this.mostrarModal = false;
      this.mensaje = `✅ Has reservado "${this.libroSeleccionado.titulo}" para el día ${this.fechaSeleccionada}.`;
    },
  },
};
</script>

<style scoped>
@import "@/assets/ReservarLibro.css";

.tarjeta-libro {
  background: #1e293b;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  width: 100%;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 520px;
}

</style>
