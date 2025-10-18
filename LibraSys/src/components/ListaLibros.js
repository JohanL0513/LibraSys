import "@/assets/listaLibros.css";

export default {
  name: "ListaLibros",
  data() {
    return {
      termino: "",
      filtroLetra: "TODOS",
      letras: [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#", "TODOS"],

      libros: [], // 🔹 Solo libros desde la API
      filtroActual: { categoria: null, sub: null },
      cargando: false,
      error: null,
    };
  },

  computed: {
    librosFiltrados() {
      let lista = this.libros.slice();

      if (this.termino.trim() !== "") {
        const t = this.termino.toLowerCase();
        lista = lista.filter(
          (b) =>
            b.titulo?.toLowerCase().includes(t) ||
            b.autor?.toLowerCase().includes(t) ||
            b.categoria?.toLowerCase().includes(t)
        );
      }

      if (this.filtroLetra !== "TODOS" && this.filtroLetra !== "#") {
        lista = lista.filter(
          (b) => b.titulo?.[0]?.toUpperCase() === this.filtroLetra
        );
      } else if (this.filtroLetra === "#") {
        lista = lista.filter((b) => !/^[A-Z]/i.test(b.titulo?.[0] || ""));
      }

      return lista;
    },
  },

  methods: {
    async cargarLibros() {
      this.cargando = true;
      this.error = null;
      try {
        const res = await fetch("https://323bde55-c001-4f08-8b32-50ee8c177012.mock.pstmn.io/");
        if (!res.ok) throw new Error("Error al cargar los libros.");
        const data = await res.json();

        console.log("📚 Datos recibidos de la API:");
        console.table(data);

        // 🧹 Eliminar duplicados por título
        const sinDuplicados = Array.isArray(data)
          ? data.filter(
              (libro, index, self) =>
                index === self.findIndex((b) => b.titulo === libro.titulo)
            )
          : [];

        console.log(`✅ Libros cargados sin duplicados: ${sinDuplicados.length}`);
        console.table(sinDuplicados);

        this.libros = sinDuplicados;
      } catch (err) {
        console.error("❌ Error al obtener libros:", err);
        this.error = "No se pudieron cargar los libros.";
      } finally {
        this.cargando = false;
      }
    },

    filtrarPorLetra(letra) {
      this.filtroLetra = letra;
    },
    buscar() {
      this.filtroLetra = "TODOS";
    },
  },

  mounted() {
    // 🔹 Evita recargar si ya existen libros
    if (this.libros.length === 0) {
      this.cargarLibros();
    }
  },
};
