<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <div class="mb-8">
      <h1 class="text-title font-black text-text-main font-sans tracking-tight">
        Mis Reservas
      </h1>
      <p class="text-text-body text-text-muted mt-1">
        Administrá tus turnos agendados y revisá el estado de tus partidos.
      </p>
    </div>

    <div 
      v-if="!reservationsStore.myReservations.length" 
      class="bg-surface-card border border-surface-border rounded-card p-12 text-center shadow-flat"
    >
      <span class="text-5xl block mb-4">📅</span>
      <h3 class="text-card-title font-bold text-text-main">No tenés reservas activas</h3>
      <p class="text-text-body text-text-muted mt-1 max-w-sm mx-auto">
        ¿Te falta fútbol para esta semana? Revisá las canchas disponibles y armá tu partido.
      </p>
      <router-link 
        to="/canchas" 
        class="inline-block mt-5 bg-brand hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-btn shadow-flat transition-colors text-text-body"
      >
        Ver Canchas Disponibles
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="reservation in reservationsStore.myReservations" 
        :key="reservation.id"
        class="bg-surface-card border border-surface-border rounded-card shadow-flat p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-hover transition-all duration-200"
      >
        
        <div class="flex items-start space-x-4">
          <div class="bg-green-50 text-brand p-3 rounded-btn text-2xl hidden sm:block">
            ⚽
          </div>
          <div>
            <h3 class="text-card-title font-bold text-text-main leading-tight">
              {{ reservation.courtName }}
            </h3>
            <p class="text-text-body text-text-muted mt-0.5">
              Club: <span class="font-semibold text-text-main">{{ reservation.clubName }}</span>
            </p>
            <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-text-small font-medium text-text-muted">
              <span>📅 {{ reservation.date }}</span>
              <span>⏰ {{ reservation.time }} hs</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between md:justify-end md:space-x-6 pt-3 md:pt-0 border-t md:border-t-0 border-surface-border">
          <div>
            <span 
              v-if="reservation.status === 'confirmed'" 
              class="px-3 py-1 text-text-small font-bold rounded-full bg-green-50 text-status-success border border-green-200 uppercase tracking-wider"
            >
              Confirmada
            </span>
            <span 
              v-else-if="reservation.status === 'pending'" 
              class="px-3 py-1 text-text-small font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wider"
            >
              Pendiente
            </span>
            <span 
              v-else 
              class="px-3 py-1 text-text-small font-bold rounded-full bg-red-50 text-status-error border border-red-200 uppercase tracking-wider"
            >
              Cancelada
            </span>
          </div>

          <button 
            v-if="reservation.status !== 'cancelled'"
            @click="handleCancel(reservation.id)"
            class="text-text-body font-semibold text-text-muted hover:text-status-error border border-surface-border hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-btn transition-colors duration-200 cursor-pointer"
          >
            Cancelar Turno
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useReservationsStore } from '../stores/reservations'
import { useAuthStore } from '../stores/auth'

const reservationsStore = useReservationsStore()
const authStore = useAuthStore()

onMounted(() => {
  console.log("Usuario logueado actual:", authStore.user)
})

function handleCancel(id) {
  if (confirm('¿Estás seguro de que querés cancelar esta reserva?')) {
    reservationsStore.cancelReservation(id)
  }
}
</script>