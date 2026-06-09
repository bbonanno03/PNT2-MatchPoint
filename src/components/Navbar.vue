<script setup>

import { useAuthStore } from '../stores/auth'
import {useRouter} from 'vue-router'

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

</script>

<template>
  <nav class="navbar">
    <router-link to="/canchas">Canchas</router-link>
    <router-link to="/reservas">Reservas</router-link>
    <router-link to="/politicas">Políticas</router-link>

    <router-link v-if="authStore.isAdmin" to="/admin/canchas">Admin</router-link>
    <router-link v-if="authStore.isAdmin" to="/admin/metricas">Métricas</router-link>
    <router-link v-if="authStore.isAdmin" to="/admin/usuarios">Usuarios</router-link>

    <router-link v-if="!authStore.isAuthenticated" to="/login">Login</router-link>
    <router-link v-if="!authStore.isAuthenticated" to="/register">Registro</router-link>

    <span v-if="authStore.isAuthenticated">
      Usuario: {{ authStore.user.name }} - {{ authStore.user.role }}
    </span>

    <button v-if="authStore.isAuthenticated" @click="handleLogout">
      Cerrar sesión
    </button>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 16px;
  padding: 15px;
  background-color: #f5f5f5;
  align-items: center;
}
</style>