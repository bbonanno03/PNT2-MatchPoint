import { defineStore } from "pinia";
import { supabase } from "../services/supabase";

export const useCourtsStore = defineStore("courts", {
  state: () => ({
    courts: [],
    searchQuery: "",
    selectedSport: "",
    loading: false,
    error: null
  }),

  getters: {
    activeCourts: (state) => state.courts.filter((court) => court.active),

    filteredCourts: (state) => {
      return state.courts.filter((court) => {
        if (!court.active) return false;
        if (!court.sport) return false;

        const matchesSport =
          !state.selectedSport ||
          court.sport.toLowerCase() === state.selectedSport.toLowerCase();

        const courtName = court.name ? court.name.toLowerCase() : "";
        const courtClub = court.club ? court.club.toLowerCase() : "";
        const query = state.searchQuery.toLowerCase().trim();

        const matchesSearch =
          !query || courtName.includes(query) || courtClub.includes(query);

        return matchesSport && matchesSearch;
      });
    },
  },

  actions: {
    async fetchCourts() {
      this.loading = true
      this.error = null
      
      console.log('🚀 Iniciando fetchCourts desde Supabase...')

      try {
        console.log('📡 Conectando a Supabase...')
        const { data, error } = await supabase
          .from('courts')
          .select('*')

        if (error) {
          console.error('❌ Error de Supabase:', error.message, error.code)
          this.error = error.message
          return
        }

        console.log('✅ Datos recibidos de Supabase:', data)
        this.courts = data || []
      } catch (err) {
        console.error('❌ Error al conectar a Supabase:', err.message)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setSportFilter(sport) {
      this.selectedSport = sport;
    },
    clearFilters() {
      this.selectedSport = "";
      this.searchQuery = "";
    },

    addCourt(newCourtData) {
      const newCourt = {
        id: Date.now(),
        name: newCourtData.name,
        sport: newCourtData.sport,
        club: newCourtData.club,
        location: newCourtData.location,
        price: Number(newCourtData.price),
        active: true,
      };
      this.courts.push(newCourt);
    },

    updateCourt(id, updatedData) {
      const index = this.courts.findIndex((c) => c.id === id);
      if (index !== -1) {
        this.courts[index] = {
          ...this.courts[index],
          ...updatedData,
          price: Number(updatedData.price),
        };
      }
    },

    deleteCourt(id) {
      this.courts = this.courts.filter((c) => c.id !== id);
    },
  },
});
