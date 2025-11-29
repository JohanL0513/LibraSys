<template>
  <section class="gestion-prestamos">
    <h2 class="titulo">Gestión de Préstamos</h2>
    <p class="subtitulo">Consulta el estado de tus préstamos actuales.</p>

    <div v-if="cargando" class="cargando">
      <p>Cargando préstamos...</p>
    </div>

    <div v-else-if="error" class="mensaje-error">
      <p>{{ error }}</p>
    </div>

    <table v-else class="tabla-prestamos">
      <thead>
        <tr>
          <th>Libro</th>
          <th>Autor</th>
          <th>Fecha de préstamo</th>
          <th>Fecha de devolución</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prestamo in prestamos" :key="prestamo.id">
          <td>{{ prestamo.titulo }}</td>
          <td>{{ prestamo.autor }}</td>
          <td>{{ prestamo.fechaPrestamo }}</td>
          <td>{{ prestamo.fechaDevolucion }}</td>
          <td>
            <span
              :class="{
                'estado-ok': !estaVencido(prestamo.fechaDevolucion),
                'estado-multa': estaVencido(prestamo.fechaDevolucion)
              }"
            >
              {{ estaVencido(prestamo.fechaDevolucion) ? 'Con multa' : 'En curso' }}
            </span>
          </td>
          <td>
            <button
              class="btn-devolver"
              @click="devolverLibro(prestamo)"
              :disabled="prestamo.devuelto"
            >
              {{ prestamo.devuelto ? 'Devuelto' : 'Devolver' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="mensaje" class="confirmacion">
      <p>{{ mensaje }}</p>
      <button class="btn-volver" @click="mensaje = ''">Cerrar</button>
    </div>
  </section>
</template>

<script>
export default {
  name: "GestionPrestamos",
  data() {
    return {
      prestamos: [],
      cargando: false,
      error: null,
      mensaje: "",
      apiBase: "https://0bb83f20-aad4-466f-b2d8-3b014ae922f3.mock.pstmn.io",
    };
  },
  async mounted() {
    this.cargando = true;
    try {
      const res = await fetch(this.apiBase);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Si la API devuelve libros válidos, les agregamos fechas simuladas
      if (Array.isArray(data) && data.length > 0) {
        this.prestamos = data.map((libro, i) => {
          const hoy = new Date();
          const prestamo = new Date(hoy);
          prestamo.setDate(hoy.getDate() - (i + 2)); // hace pocos días
          const devolucion = new Date(prestamo);
          devolucion.setDate(prestamo.getDate() + 10);
          return {
            id: libro.id || i + 1,
            titulo: libro.titulo || "Sin título",
            autor: libro.autor || "Desconocido",
            fechaPrestamo: prestamo.toISOString().split("T")[0],
            fechaDevolucion: devolucion.toISOString().split("T")[0],
            devuelto: false,
          };
        });
      } else {
        this.cargarPrestamosLocales();
      }
    } catch (err) {
      console.error(err);
      this.error = "Error al cargar los préstamos. Usando datos locales.";
      this.cargarPrestamosLocales();
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    cargarPrestamosLocales() {
      this.prestamos = [
        {
          id: 1,
          titulo: "Cien años de soledad",
          autor: "Gabriel García Márquez",
          fechaPrestamo: "2025-10-20",
          fechaDevolucion: "2025-11-05",
          devuelto: false,
        },
        {
          id: 2,
          titulo: "Don Quijote de la Mancha",
          autor: "Miguel de Cervantes",
          fechaPrestamo: "2025-10-25",
          fechaDevolucion: "2025-11-10",
          devuelto: false,
        },
      ];
    },
    estaVencido(fechaDevolucion) {
      const hoy = new Date();
      const fechaDev = new Date(fechaDevolucion);
      return hoy > fechaDev;
    },
    devolverLibro(prestamo) {
      prestamo.devuelto = true;
      if (this.estaVencido(prestamo.fechaDevolucion)) {
        this.mensaje = `⚠️ Has devuelto "${prestamo.titulo}" con retraso. Se aplicará una multa.`;
      } else {
        this.mensaje = `✅ Has devuelto "${prestamo.titulo}" correctamente.`;
      }
    },
  },
};
</script>

<style scoped>
.gestion-prestamos {
  padding: 50px 40px;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  color: #e2e8f0;
}

.titulo {
  font-size: 2rem;
  color: #60a5fa;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitulo {
  color: #94a3b8;
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

/* === Tabla === */
.tabla-prestamos {
  width: 100%;
  border-collapse: collapse;
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.tabla-prestamos th,
.tabla-prestamos td {
  padding: 15px 20px;
  text-align: center;
  border-bottom: 1px solid #334155;
}

.tabla-prestamos th {
  background-color: #0f172a;
  color: #60a5fa;
  font-weight: 700;
}

.tabla-prestamos tr:hover {
  background: #273449;
}

/* === Estados === */
.estado-ok {
  color: #22c55e;
  font-weight: 600;
}

.estado-multa {
  color: #ef4444;
  font-weight: 600;
}

/* === Botón Devolver === */
.btn-devolver {
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
}

.btn-devolver:hover {
  background: linear-gradient(90deg, #3b82f6, #1e40af);
  transform: scale(1.03);
}

.btn-devolver:disabled {
  background: #475569;
  cursor: not-allowed;
}

/* === Confirmación === */
.confirmacion {
  background: #ecfdf5;
  color: #065f46;
  margin-top: 30px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #10b981;
  font-weight: 500;
}

.btn-volver {
  background: #1e3a8a;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  margin-top: 15px;
  cursor: pointer;
}

.btn-volver:hover {
  background: #1d4ed8;
}
</style>
