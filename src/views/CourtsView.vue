<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <h1 class="text-title font-black text-text-main mb-8 font-sans tracking-tight">
      Canchas Disponibles
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <CourtCard
        v-for="court in courtsStore.activeCourts"
        :key="court.id"
        :court="court"
      />

    </div>
  </div>
</template>

<script setup>
import { useCourtsStore } from '../stores/courts'
import CourtCard from '../components/CourtCard.vue'

const courtsStore = useCourtsStore()
</script>