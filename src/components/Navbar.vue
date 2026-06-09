<template>
  <nav class="navbar">
    <router-link to="/canchas">Canchas</router-link>
    <router-link to="/reservas">Reservas</router-link>
    <router-link to="/politicas">Políticas</router-link>
    <router-link to="/admin/canchas">Admin</router-link>
    <router-link to="/admin/metricas">Métricas</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/admin/usuarios">Usuarios</router-link>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 20px;
  padding: 15px;
  background-color: #f5f5f5;
}
</style>