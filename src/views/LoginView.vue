<template>
  <section>
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Contraseña</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit">Ingresar</button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')

const router = useRouter()
const authStore = useAuthStore()

function handleLogin() {
  authStore.login(email.value, password.value)
  router.push('/canchas')
}
</script>