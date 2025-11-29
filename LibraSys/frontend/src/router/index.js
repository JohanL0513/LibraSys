import { createRouter, createWebHistory } from 'vue-router'

// === VISTAS PRINCIPALES ===
import PaginaInicio from '../views/PaginaInicio.vue'
import Verificacion2FA from '../views/Verificacion2FA.vue'

// === LAYOUTS Y SUBVISTAS ===
import ListaLibros from '../layouts/ListaLibros.vue'
import BibliotecaView from '../views/BibliotecaView.vue'
import DetalleLibro from '../views/DetalleLibro.vue'
import GestionPrestamos from '../views/GestionPrestamos.vue'
import ReservarLibro from '../views/ReservarLibro.vue' // ✅ Nueva vista agregada

const routes = [
  // Página de inicio y verificación
  { path: '/', name: 'Inicio', component: PaginaInicio },
  { path: '/verificacion', name: 'Verificacion2FA', component: Verificacion2FA },

  // Sección principal de libros (usa el layout ListaLibros)
  {
    path: '/libros',
    component: ListaLibros,
    children: [
      { path: '', name: 'Biblioteca', component: BibliotecaView },
      { path: 'detalle/:id', name: 'DetalleLibro', component: DetalleLibro },
      { path: 'prestamos', name: 'Prestamos', component: GestionPrestamos },
      { path: 'reservas', name: 'Reservas', component: ReservarLibro }, // ✅ Nueva ruta funcional
    ],
  },

  // Cualquier ruta desconocida redirige al inicio
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
