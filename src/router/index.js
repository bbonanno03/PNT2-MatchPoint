import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CatalogView from '../views/CatalogView.vue'
import LoansView from '../views/LoansView.vue'
import RulesView from '../views/RulesView.vue'
import AdminBooksView from '../views/AdminBooksView.vue'
import MetricsView from '../views/MetricsView.vue'

const routes = [
  { path: '/', redirect: '/catalogo' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/catalogo', component: CatalogView },
  { path: '/prestamos', component: LoansView },
  { path: '/reglas', component: RulesView },
  { path: '/admin/libros', component: AdminBooksView },
  { path: '/admin/metricas', component: MetricsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router