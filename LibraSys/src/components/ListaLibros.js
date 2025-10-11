import "@/assets/listaLibros.css";

export default {
  name: "ListaLibros",
  data() {
    return {
      termino: "",
      categorias: [
        { id: 1, titulo: "Libros", items: ["Todos", "Infantil", "Juvenil", "Adultos"] },
        { id: 2, titulo: "Ficción", items: ["Novela", "Ciencia ficción", "Misterio", "Romántica"] },
        { id: 3, titulo: "No ficción", items: ["Historia", "Ciencia", "Ensayo", "Biografías"] },
        { id: 4, titulo: "Bonos", items: ["Descuentos", "Paquetes", "Cupones"] },
        { id: 5, titulo: "Promociones", items: ["Ofertas", "2x1", "Lanzamientos"] }
      ],
      openIndex: null,
      hoverIndex: null,

      destacados: [
        { titulo: "El rugido de nuestro tiempo", autor: "Carlos Granés", portada: "https://via.placeholder.com/150x220" },
        { titulo: "No hay nada malo en ti", autor: "Marta Segrelles", portada: "https://via.placeholder.com/150x220" },
        { titulo: "Armero", autor: "Mario Villalobos", portada: "https://via.placeholder.com/150x220" }
      ],
      libros: [
        { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", portada: "https://via.placeholder.com/150x220", categoria: "Novela" },
        { titulo: "Rayuela", autor: "Julio Cortázar", portada: "https://via.placeholder.com/150x220", categoria: "Novela" },
        { titulo: "El Principito", autor: "Antoine de Saint-Exupéry", portada: "https://via.placeholder.com/150x220", categoria: "Infantil" },
        { titulo: "Breves respuestas", autor: "Stephen Hawking", portada: "https://via.placeholder.com/150x220", categoria: "Ciencia" },
      ],
      filtroActual: { categoria: null, sub: null }
    };
  },
  computed: {
    librosFiltrados() {
      let list = this.libros.slice();

      if (this.termino) {
        const t = this.termino.toLowerCase();
        list = list.filter(
          (b) =>
            b.titulo.toLowerCase().includes(t) ||
            b.autor.toLowerCase().includes(t) ||
            (b.categoria && b.categoria.toLowerCase().includes(t))
        );
      }

      if (this.filtroActual.sub && this.filtroActual.sub !== "Todos") {
        list = list.filter((b) => b.categoria === this.filtroActual.sub);
      }

      return list;
    }
  },
  methods: {
    toggleMenu(idx) {
      this.openIndex = this.openIndex === idx ? null : idx;
    },
    filtrarCategoria(cat, sub) {
      this.filtroActual = { categoria: cat, sub };
      this.openIndex = null;
    },
    buscar() {
      // ya filtra con computed
    },
    handleClickOutside(e) {
      const node = this.$refs.submenus;
      if (!node) return;
      if (!node.contains(e.target)) {
        this.openIndex = null;
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
