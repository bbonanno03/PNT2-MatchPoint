<template>
  <div class="bg-surface-card border border-surface-border rounded-card shadow-flat p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-hover transition-all duration-200">
    
    <!-- Info Section -->
    <div class="flex items-start space-x-4">
      <div class="bg-green-50 text-brand p-3 rounded-btn text-2xl hidden sm:block">
        ⚽
      </div>
      <div>
        <h3 class="text-card-title font-bold text-text-main leading-tight">
          {{ reservation.courts?.name || reservation.courtName || 'Cancha' }}
        </h3>
        <p class="text-text-body text-text-muted mt-0.5">
          Club: <span class="font-semibold text-text-main">{{ reservation.courts?.club || reservation.clubName || 'Club' }}</span>
        </p>
        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-text-small font-medium text-text-muted">
          <span>📅 {{ formatDate(reservation.reservation_date || reservation.date) }}</span>
          <span>⏰ {{ reservation.start_time || reservation.time }} - {{ reservation.end_time || reservation.endTime }} hs</span>
          <span v-if="reservation.created_at || reservation.createdAt" class="text-text-small">
            Reservado el {{ formatDate(reservation.created_at || reservation.createdAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Status & Actions Section -->
    <div class="flex items-center justify-between md:justify-end md:space-x-6 pt-3 md:pt-0 border-t md:border-t-0 border-surface-border">
      <!-- Status Badge -->
      <div>
        <span 
          v-if="reservation.status === 'active'" 
          class="px-3 py-1 text-text-small font-bold rounded-full bg-green-50 text-status-success border border-green-200 uppercase tracking-wider"
        >
          Activa
        </span>
        <span 
          v-else-if="reservation.status === 'confirmed'" 
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
          v-else-if="reservation.status === 'cancelled'" 
          class="px-3 py-1 text-text-small font-bold rounded-full bg-red-50 text-status-error border border-red-200 uppercase tracking-wider"
        >
          Cancelada
        </span>
      </div>

      <!-- Cancel Button -->
      <button 
        v-if="!isCancelled && reservation.status !== 'cancelled'"
        @click="$emit('cancel', reservation.id)"
        class="text-text-body font-semibold text-text-muted hover:text-status-error border border-surface-border hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-btn transition-colors duration-200 cursor-pointer"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  reservation: {
    type: Object,
    required: true
  },
  isCancelled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['cancel'])

function formatDate(dateStr) {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('es-AR', options)
}
</script>
