<template>
  <div class="layout">
    <aside class="sidebar">
      <h1 class="logo">LibraSys</h1>
      <nav>
        <ul>
          <li @click="volverBiblioteca">Biblioteca</li>
          <li>Reserva de libros</li>
          <li>Préstamos</li>
          <li>Salir</li>
        </ul>
      </nav>
    </aside>

    <main class="contenido">
      <header class="topbar">
        <h2>Detalle del Libro</h2>
      </header>

      <!-- estado de carga -->
      <section class="detalle-libro" v-if="cargando">
        <p class="cargando">Cargando información del libro...</p>
      </section>

      <!-- detalle -->
      <section class="detalle-libro" v-else-if="libro">
        <div class="tarjeta-libro">
          <img :src="libro.imagen || placeholder" :alt="libro.titulo" class="portada" />
          <div class="info-libro">
            <h2 class="titulo">{{ libro.titulo }}</h2>
            <p class="autor"> Autor :{{  libro.autor }}</p>
            <p class="anio">  Año: {{ libro.año || "Desconocido" }}</p>
            <p class="categoria">  Categoría: {{ libro.categoria || "N/A" }}</p>
            <p class="descripcion">
              {{ libro.descripcion || "Sin descripción disponible." }}
            </p>
          </div>
        </div>
      </section>

      <!-- error -->
      <p v-else-if="error" class="mensaje-error">{{ error }}</p>
    </main>
  </div>
</template>

<script>
export default {
  name: "DetalleLibro",

  // id como prop ya no es obligatorio (aceptamos varias fuentes)
  props: {
    id: { type: [String, Number], required: false }
  },

  data() {
    return {
      libro: null,
      cargando: true,
      error: null,
      apiBase: "https://323bde55-c001-4f08-8b32-50ee8c177012.mock.pstmn.io/",
      redirectDelayMs: 1200,
      placeholder: "https://via.placeholder.com/200x300?text=Sin+imagen"
    };
  },

  computed: {
    // resolvemos el id desde prop, params o query (prioridad en ese orden)
    idResuelto() {
      // this.id (prop) puede ser undefined; chequeamos params y query
      const fromProp = this.id;
      const fromParams = this.$route && this.$route.params && this.$route.params.id;
      const fromQuery = this.$route && this.$route.query && this.$route.query.id;

      // Log para debug
      console.log("DetalleLibro - sources:", { prop: fromProp, params: fromParams, query: fromQuery });

      return (
        (fromProp !== undefined && fromProp !== null && String(fromProp) !== "") ?
          String(fromProp) :
        (fromParams !== undefined && fromParams !== null && String(fromParams) !== "") ?
          String(fromParams) :
        (fromQuery !== undefined && fromQuery !== null && String(fromQuery) !== "") ?
          String(fromQuery) :
        null
      );
    }
  },

  async mounted() {
    console.log("DetalleLibro montado. idResuelto =", this.idResuelto);
    await this.cargarListaYBuscarPorId(this.idResuelto);
  },

  watch: {
    // si cambia la ruta o prop, recargamos
    "$route.params.id"(nv) {
      console.log("watch $route.params.id ->", nv);
      this.cargarListaYBuscarPorId(this.idResuelto);
    },
    id(nv) {
      console.log("watch prop id ->", nv);
      this.cargarListaYBuscarPorId(this.idResuelto);
    }
  },

  methods: {
    
    volverBiblioteca() {
      this.$router.push({ name: "ListaLibros" });
    },

    async cargarListaYBuscarPorId(id) {
      this.cargando = true;
      this.error = null;
      this.libro = null;

      if (!id) {
        // id es falsy: mostramos mensaje claro y redirigimos
        console.warn("DetalleLibro: id inválido o no suministrado:", id);
        this.error = "ID de libro inválido o no proporcionado. Redirigiendo a la biblioteca...";
        this.programarRedirect();
        this.cargando = false;
        return;
      }

      try {
        console.log("Fetching lista desde:", this.apiBase);
        const res = await fetch(this.apiBase);
        if (!res.ok) throw new Error(`Fetch error ${res.status}`);
        const lista = await res.json();

        if (!Array.isArray(lista)) {
          console.error("Respuesta de API no es array:", lista);
          this.error = "Respuesta inesperada de la API.";
          this.programarRedirect();
          return;
        }

        const encontrado = lista.find(item => String(item.id) === String(id));
        if (encontrado) {
          this.libro = encontrado;
          console.log("Libro encontrado:", this.libro);
        } else {
          console.warn("No se encontró libro con id:", id);
          this.error = `No se encontró el libro con id ${id}. Redirigiendo...`;
          this.programarRedirect();
        }
      } catch (err) {
        console.error("Error al obtener lista:", err);
        this.error = "Error al obtener información desde la API.";
        this.programarRedirect();
      } finally {
        this.cargando = false;
      }
    },

    programarRedirect() {
      setTimeout(() => {
        this.$router.replace({ name: "ListaLibros" });
      }, this.redirectDelayMs);
    }
  }
};
</script>

<style scoped>
@import "@/assets/DetalleLibro.css";


</style>

