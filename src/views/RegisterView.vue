<template>
  <section>
    <h1>Registro</h1>

    <form @submit.prevent="handleRegister">
      <div>
        <label>Nombre</label>
        <input v-model="name" type="text" required />
      </div>

      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Contraseña</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit">Registrarme</button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')

const router = useRouter()
const authStore = useAuthStore()

function handleRegister() {
  authStore.register(name.value, email.value, password.value)
  router.push('/canchas')
}
</script>