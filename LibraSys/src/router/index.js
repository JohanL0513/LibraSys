import { createRouter, createWebHistory } from 'vue-router'

// Importa tus vistas
import PaginaInicio from '../views/PaginaInicio.vue'
import ListaLibros from '../views/ListaLibros.vue'
import GestionPrestamos from '../views/GestionPrestamos.vue'

const routes = [
  { path: '/', name: 'Inicio', component: PaginaInicio },
  { path: '/libros', name: 'Libros', component: ListaLibros },
  { path: '/prestamos', name: 'Prestamos', component: GestionPrestamos },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router