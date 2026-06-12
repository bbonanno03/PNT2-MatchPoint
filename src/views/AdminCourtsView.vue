<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-title font-black text-text-main font-sans tracking-tight">
          Panel de Administración
        </h1>
        <p class="text-text-body text-text-muted mt-1">
          Gestioná el catálogo de canchas disponibles en MatchPoint.
        </p>
      </div>
    </div>

    <div class="bg-surface-card border border-surface-border rounded-card p-6 shadow-flat mb-8">
      <h2 class="text-card-title font-bold text-text-main mb-4">
        {{ isEditing ? '📝 Editar Cancha' : '➕ Agregar Nueva Cancha' }}
      </h2>
      
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-text-small font-bold text-text-main mb-1">Nombre de la Cancha:</label>
          <input v-model="form.name" type="text" required placeholder="Nombre de la cancha" class="w-full text-text-body border border-surface-border rounded-btn px-3 py-2 bg-surface-bg text-text-main focus:outline-none focus:border-brand" />
        </div>

        <div>
          <label class="block text-text-small font-bold text-text-main mb-1">Deporte:</label>
          <select v-model="form.sport" required class="w-full text-text-body border border-surface-border rounded-btn px-3 py-2 bg-surface-bg text-text-main focus:outline-none focus:border-brand">
            <option value="" disabled>Seleccionar deporte</option>
            <option value="Pádel">🎾 Pádel</option>
            <option value="Tenis">🥎 Tenis</option>
            <option value="Fútbol">⚽ Fútbol</option>
          </select>
        </div>

        <div>
          <label class="block text-text-small font-bold text-text-main mb-1">Club:</label>
          <input v-model="form.club" type="text" required placeholder="Nombre del club" class="w-full text-text-body border border-surface-border rounded-btn px-3 py-2 bg-surface-bg text-text-main focus:outline-none focus:border-brand" />
        </div>

        <div>
          <label class="block text-text-small font-bold text-text-main mb-1">Ubicación / Barrio:</label>
          <input v-model="form.location" type="text" required placeholder="Ubicacion de la cancha" class="w-full text-text-body border border-surface-border rounded-btn px-3 py-2 bg-surface-bg text-text-main focus:outline-none focus:border-brand" />
        </div>

        <div>
          <label class="block text-text-small font-bold text-text-main mb-1">Precio por hora ($):</label>
          <input v-model="form.price" type="number" required min="0" placeholder="Valor por hora" class="w-full text-text-body border border-surface-border rounded-btn px-3 py-2 bg-surface-bg text-text-main focus:outline-none focus:border-brand" />
        </div>

        <div class="flex items-end gap-2">
          <button type="submit" class="flex-1 bg-brand hover:bg-brand-dark text-white font-bold py-2 rounded-btn shadow-flat transition-colors text-text-body cursor-pointer text-center">
            {{ isEditing ? 'Guardar Cambios' : 'Crear Cancha' }}
          </button>
          <button v-if="isEditing" type="button" @click="resetForm" class="bg-surface-bg hover:bg-surface-border text-text-muted border border-surface-border font-bold py-2 px-4 rounded-btn transition-colors text-text-body cursor-pointer">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="bg-surface-card border border-surface-border rounded-card shadow-flat overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-bg border-b border-surface-border text-text-small font-bold text-text-muted">
              <th class="p-4">Cancha</th>
              <th class="p-4">Deporte</th>
              <th class="p-4">Club / Ubicación</th>
              <th class="p-4">Precio</th>
              <th class="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border text-text-body text-text-main">
            <tr v-for="court in courtsStore.courts" :key="court.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4 font-semibold">{{ court.name }}</td>
              <td class="p-4">
                <span class="px-2.5 py-0.5 text-text-small font-bold rounded-full bg-surface-bg border border-surface-border">
                  {{ court.sport }}
                </span>
              </td>
              <td class="p-4">
                <div class="font-medium">{{ court.club }}</div>
                <div class="text-text-small text-text-muted">{{ court.location }}</div>
              </td>
              <td class="p-4 font-bold text-brand">${{ court.price }}</td>
              <td class="p-4">
                <div class="flex justify-center gap-2">
                  <button @click="editCourt(court)" class="text-text-small bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-btn font-bold transition-colors cursor-pointer">
                    Editar
                  </button>
                  <!-- 🌟 Cambiado para disparar la función local handleDelete -->
                  <button @click="handleDelete(court)" class="text-text-small bg-red-50 text-status-error hover:bg-red-100 border border-red-200 px-3 py-1 rounded-btn font-bold transition-colors cursor-pointer">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCourtsStore } from '../stores/courts'
// 🌟 1. Importamos el store de alertas globales
import { useAlertsStore } from '../stores/alerts.js'

const courtsStore = useCourtsStore()
const alertsStore = useAlertsStore() // 🌟 2. Instanciamos el store de alertas

const defaultForm = {
  name: '',
  sport: '',
  club: '',
  location: '',
  price: ''
}

const form = ref({ ...defaultForm })
const isEditing = ref(false)
const currentCourtId = ref(null)

function handleSubmit() {
  if (isEditing.value) {
    courtsStore.updateCourt(currentCourtId.value, form.value)
    // 🌟 3. Reemplazo del alert nativo por la alerta verde
    alertsStore.showAlert(`¡Cancha "${form.value.name}" modificada con éxito!`, 'success')
  } else {
    courtsStore.addCourt(form.value)
    // 🌟 4. Reemplazo del alert nativo por la alerta verde
    alertsStore.showAlert(`¡Cancha "${form.value.name}" creada con éxito!`, 'success')
  }
  resetForm()
}

// 🌟 5. Función nueva para manejar el borrado de forma prolija con alerta roja
function handleDelete(court) {
  courtsStore.deleteCourt(court.id)
  alertsStore.showAlert(`Se eliminó la cancha "${court.name}" del catálogo.`, 'error')
}

function editCourt(court) {
  isEditing.value = true
  currentCourtId.value = court.id
  form.value = { ...court }
}

function resetForm() {
  form.value = { ...defaultForm }
  isEditing.value = false
  currentCourtId.value = null
}
</script>