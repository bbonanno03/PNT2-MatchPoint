<template>
  <Navbar />
  <router-view />

  <Alert />
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Alert from './components/Alert.vue'
</script>