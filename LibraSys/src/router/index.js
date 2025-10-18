import { createRouter, createWebHistory } from 'vue-router'

// Importa tus vistas
import PaginaInicio from '../views/PaginaInicio.vue'
import ListaLibros from '../views/ListaLibros.vue'
import GestionPrestamos from '../views/GestionPrestamos.vue'
import Verificacion2FA from '../views/Verificacion2FA.vue' // 👈 nueva vista

const routes = [
  { path: '/', name: 'Inicio', component: PaginaInicio },
  { path: '/libros', name: 'ListaLibros', component: ListaLibros },
  { path: '/prestamos', name: 'Prestamos', component: GestionPrestamos },
  { path: '/verificacion', name: 'Verificacion2FA', component: Verificacion2FA } // 👈 nueva ruta
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
