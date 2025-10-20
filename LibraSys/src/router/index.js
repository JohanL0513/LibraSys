// router.js
import { createRouter, createWebHistory } from 'vue-router'

// Importa tus vistas
import PaginaInicio from '../views/PaginaInicio.vue'
import ListaLibros from '../views/ListaLibros.vue'
import GestionPrestamos from '../views/GestionPrestamos.vue'
import Verificacion2FA from '../views/Verificacion2FA.vue'

const routes = [
  { path: '/', name: 'Inicio', component: PaginaInicio },
  { path: '/libros', name: 'ListaLibros', component: ListaLibros },
  { path: '/prestamos', name: 'Prestamos', component: GestionPrestamos },
  { path: '/verificacion', name: 'Verificacion2FA', component: Verificacion2FA },
  // :id? hace que el id sea opcional (puedes pasar libro como objeto serializado o solo id)
  { path: '/detalle-libro/:id?', name: 'DetalleLibro', component: () => import('../views/DetalleLibro.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
