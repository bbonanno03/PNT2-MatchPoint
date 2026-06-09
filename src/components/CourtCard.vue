<template>
  <article class="bg-surface-card border border-surface-border rounded-card shadow-flat overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
    
   
    <div class="bg-slate-50/70 p-4 border-b border-surface-border flex justify-between items-center">
      <h2 class="text-text-card-title font-bold text-text-main font-sans tracking-tight">
        {{ court.name }}
      </h2>
      
      <span class="px-2.5 py-1 text-text-small font-bold rounded-full bg-green-50 text-brand border border-green-100">
        {{ court.sport }}
      </span>
    </div>

    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div class="space-y-2.5">
        
        <div class="flex justify-between items-center text-text-body">
          <span class="font-medium text-text-muted">Club</span>
          <span class="font-semibold text-text-main">{{ court.club }}</span>
        </div>
        
        <div class="flex justify-between items-center text-text-body">
          <span class="font-medium text-text-muted">Ubicación</span>
          <span class="text-text-main">{{ court.location }}</span>
        </div>
      </div>

      <hr class="border-surface-border" />

      <div class="flex items-center justify-between pt-1">
        <div>
          <p class="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Por Hora</p>
          <p class="text-xl font-black text-text-main">${{ court.price }}</p>
        </div>

        <button class="bg-brand hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-btn shadow-flat hover:shadow-md transition-all duration-200 text-text-body cursor-pointer active:scale-95">
          Reservar
        </button>
      </div>
    </div>
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