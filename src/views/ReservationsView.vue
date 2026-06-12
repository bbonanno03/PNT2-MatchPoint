<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-title font-black text-text-main font-sans tracking-tight">
        Mis Reservas
      </h1>
      <p class="text-text-body text-text-muted mt-1">
        Administrá tus turnos agendados y revisá el estado de tus partidos.
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 mb-6 border-b border-surface-border">
      <button
        @click="activeTab = 'active'"
        :class="[
          'px-4 py-2 text-text-body font-semibold border-b-2 transition-colors',
          activeTab === 'active'
            ? 'border-brand text-brand'
            : 'border-transparent text-text-muted hover:text-text-main'
        ]"
      >
        Activas ({{ reservationsStore.myActiveReservations.length }})
      </button>
      <button
        @click="activeTab = 'cancelled'"
        :class="[
          'px-4 py-2 text-text-body font-semibold border-b-2 transition-colors',
          activeTab === 'cancelled'
            ? 'border-brand text-brand'
            : 'border-transparent text-text-muted hover:text-text-main'
        ]"
      >
        Canceladas ({{ reservationsStore.myCancelledReservations.length }})
      </button>
      <button
        @click="activeTab = 'all'"
        :class="[
          'px-4 py-2 text-text-body font-semibold border-b-2 transition-colors',
          activeTab === 'all'
            ? 'border-brand text-brand'
            : 'border-transparent text-text-muted hover:text-text-main'
        ]"
      >
        Historial ({{ historicalReservations.length }})
      </button>
    </div>

    <!-- Empty State -->
    <div 
      v-if="!reservationsStore.myReservations.length" 
      class="bg-surface-card border border-surface-border rounded-card p-12 text-center shadow-flat"
    >
      <span class="text-5xl block mb-4">📅</span>
      <h3 class="text-card-title font-bold text-text-main">No tenés reservas</h3>
      <p class="text-text-body text-text-muted mt-1 max-w-sm mx-auto">
        ¿Te falta fútbol? Revisá las canchas disponibles y hacé tu primera reserva.
      </p>
      <router-link 
        to="/canchas" 
        class="inline-block mt-5 bg-brand hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-btn shadow-flat transition-colors text-text-body"
      >
        Ver Canchas Disponibles
      </router-link>
    </div>

    <!-- Active Reservations Tab -->
    <div v-else-if="activeTab === 'active'" class="space-y-4">
      <div 
        v-if="!reservationsStore.myActiveReservations.length"
        class="bg-surface-card border border-surface-border rounded-card p-8 text-center"
      >
        <p class="text-text-body text-text-muted">No tenés reservas activas en este momento.</p>
      </div>
      <ReservationCard
        v-for="reservation in reservationsStore.myActiveReservations"
        :key="reservation.id"
        :reservation="reservation"
        @cancel="handleCancel"
      />
    </div>

    <!-- Cancelled Reservations Tab -->
    <div v-else-if="activeTab === 'cancelled'" class="space-y-4">
      <div 
        v-if="!reservationsStore.myCancelledReservations.length"
        class="bg-surface-card border border-surface-border rounded-card p-8 text-center"
      >
        <p class="text-text-body text-text-muted">No tenés reservas canceladas.</p>
      </div>
      <ReservationCard
        v-for="reservation in reservationsStore.myCancelledReservations"
        :key="reservation.id"
        :reservation="reservation"
        :is-cancelled="true"
      />
    </div>

    <!-- All Reservations Tab (History) -->
    <div v-else-if="activeTab === 'all'" class="space-y-4">
      <div 
        v-if="!historicalReservations.length"
        class="bg-surface-card border border-surface-border rounded-card p-8 text-center"
      >
        <p class="text-text-body text-text-muted">No hay reservas en el historial.</p>
      </div>
      <ReservationCard
        v-for="reservation in historicalReservations"
        :key="reservation.id"
        :reservation="reservation"
        :is-cancelled="true"
      />
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="pendingCancel"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4"
    >
      <div class="w-full max-w-md bg-white rounded-card border border-surface-border shadow-xl p-6">
        <h2 class="text-title font-bold text-text-main mb-4">Confirmar cancelación</h2>
        <p class="text-text-body text-text-muted mb-6">
          ¿Querés cancelar la reserva del
          <strong>{{ formatDate(pendingCancel.reservation_date || pendingCancel.date) }}</strong>
          a las
          <strong>{{ pendingCancel.start_time || pendingCancel.time }}</strong>?
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="cancelCancel"
            class="text-text-body font-semibold text-text-muted border border-surface-border hover:bg-surface-bg px-4 py-2 rounded-btn transition-colors"
          >
            Volver
          </button>
          <button
            @click="confirmCancel"
            class="bg-status-error hover:bg-red-600 text-white font-bold px-4 py-2 rounded-btn transition-colors"
          >
            Confirmar cancelación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReservationsStore } from '../stores/reservations'
import { useAuthStore } from '../stores/auth'
import { useAlertsStore } from '../stores/alerts'
import ReservationCard from '../components/ReservationCard.vue'

const reservationsStore = useReservationsStore()
const authStore = useAuthStore()
const alertsStore = useAlertsStore()
const activeTab = ref('active')
const pendingCancel = ref(null)

const todayDate = new Date().toISOString().split('T')[0]

const sortedReservations = computed(() => {
  return [...reservationsStore.myReservations].sort((a, b) => {
    const dateA = new Date(a.reservation_date || a.date)
    const dateB = new Date(b.reservation_date || b.date)
    return dateB - dateA
  })
})

const historicalReservations = computed(() => {
  return sortedReservations.value.filter((reservation) => {
    const reservationDate = reservation.reservation_date || reservation.date
    return (
      reservation.status === 'cancelled' ||
      reservationDate < todayDate
    )
  })
})

onMounted(async () => {
  if (authStore.user) {
    await reservationsStore.fetchUserReservations()
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('es-AR', options)
}

function handleCancel(reservationId) {
  const reservation = reservationsStore.myReservations.find(
    (r) => r.id === reservationId
  )

  if (!reservation) {
    alertsStore.showAlert('No se encontró la reserva para cancelar.', 'error')
    return
  }

  pendingCancel.value = reservation
}

function cancelCancel() {
  pendingCancel.value = null
}

async function confirmCancel() {
  if (!pendingCancel.value) return

  const reservation = pendingCancel.value
  pendingCancel.value = null

  try {
    await reservationsStore.cancelReservation(
      reservation.id,
      reservation.reservation_date || reservation.date,
      reservation.start_time || reservation.time
    )
    alertsStore.showAlert('Reserva cancelada correctamente.', 'success')
  } catch (error) {
    alertsStore.showAlert(error.message || 'No se pudo cancelar la reserva.', 'error')
  }
}
</script>