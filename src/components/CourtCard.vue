<template>
  <article>
    <h2>{{ court.name }}</h2>

    <p>Deporte: {{ court.sport }}</p>
    <p>Club: {{ court.club }}</p>
    <p>Ubicación: {{ court.location }}</p>
    <p>Precio: ${{ court.price }}</p>

    <button>Reservar</button>

    <hr />
  </article>
</template>

<script setup>
defineProps({
  court: {
    type: Object,
    required: true
  }
})
</script>