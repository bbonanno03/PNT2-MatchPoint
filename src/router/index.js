import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CourtsView from '../views/CourtsView.vue'
import ReservationsView from '../views/ReservationsView.vue'
import PoliciesView from '../views/PoliciesView.vue'
import AdminCourtsView from '../views/AdminCourtsView.vue'
import MetricsView from '../views/MetricsView.vue'

const routes = [
  { path: '/', redirect: '/canchas' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/canchas', component: CourtsView },
  { path: '/reservas', component: ReservationsView },
  { path: '/politicas', component: PoliciesView },
  { path: '/admin/canchas', component: AdminCourtsView },
  { path: '/admin/metricas', component: MetricsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router