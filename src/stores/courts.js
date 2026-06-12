import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import courtsData from '../mocks/courts.json'

export const useCourtsStore = defineStore('courts', {
  state: () => ({
    courts: courtsData, 
    loading: false,
    error: null
  }),

  getters: {
    activeCourts: (state) =>
      state.courts.filter(court => court.active)
  },

  actions: {
    async fetchCourts() {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('courts')
          .select('id, name, sport, club, location, price, image_url, active, created_at')
          .eq('active', true)
          .order('name', { ascending: true })

        if (error) throw error

        this.courts = (data || []).map(court => ({
          id: court.id,
          name: court.name,
          sport: court.sport,
          club: court.club,
          location: court.location,
          price: parseFloat(court.price),
          image_url: court.image_url,
          active: court.active
        }))
      } catch (err) {
        console.error('Error al cargar canchas:', err)
        this.error = err.message
        // Fallback: mantener el mock
      } finally {
        this.loading = false
      }
    }
  }
})