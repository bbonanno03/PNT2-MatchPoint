<template>
  <section>
    <h1>Canchas Disponibles</h1>

    <CourtCard
      v-for="court in courtsStore.activeCourts"
      :key="court.id"
      :court="court"
    />
  </section>
</template>

<script setup>
import { useCourtsStore } from '../stores/courts'
import CourtCard from '../components/CourtCard.vue'

const courtsStore = useCourtsStore()
</script>