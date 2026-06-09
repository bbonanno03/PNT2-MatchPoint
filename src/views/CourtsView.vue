<template>
  <section>
    <h1>Canchas Disponibles</h1>

    <div v-for="court in courtsStore.activeCourts" :key="court.id">
      <h2>{{ court.name }}</h2>
      <p>Deporte: {{ court.sport }}</p>
      <p>Club: {{ court.club }}</p>
      <p>Ubicación: {{ court.location }}</p>
      <p>Precio: ${{ court.price }}</p>
      <hr />
    </div>
  </section>
</template>

<script setup>
import { useCourtsStore } from '../stores/courts'

const courtsStore = useCourtsStore()
</script>