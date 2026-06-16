import { defineStore } from "pinia";
import { supabase } from "../services/supabase";

export const useCourtsStore = defineStore("courts", {
  state: () => ({
    courts: [],
    searchQuery: "",
    selectedSport: "",
    loading: false,
    error: null,
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
    // Traer todas las canchas de Supabase
    async fetchCourts() {
      this.loading = true;
      this.error = null;
      console.log("🚀 Iniciando fetchCourts desde Supabase...");

      try {
        console.log("📡 Conectando a Supabase...");
        const { data, error } = await supabase.from("courts").select("*");

        if (error) {
          console.error("❌ Error de Supabase:", error.message, error.code);
          this.error = error.message;
          return;
        }

        console.log("✅ Datos recibidos de Supabase:", data);
        this.courts = data || [];
      } catch (err) {
        console.error("❌ Error al conectar a Supabase:", err.message);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Insertar una nueva cancha en Supabase
    async addCourt(newCourtData) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from("courts")
          .insert([
            {
              name: newCourtData.name,
              sport: newCourtData.sport,
              club: newCourtData.club,
              location: newCourtData.location,
              price: Number(newCourtData.price),
              active: true, // Dejamos que por defecto se cree activa
            },
          ])
          .select(); // El .select() es clave para que devuelva el objeto creado con su ID real de la BD

        if (error) {
          console.error("❌ Error al añadir cancha:", error.message);
          this.error = error.message;
          return;
        }

        if (data && data.length > 0) {
          console.log("✅ Cancha añadida con éxito:", data[0]);
          this.courts.push(data[0]); // Guardamos en el estado local la cancha con el ID real generado por la BD
        }
      } catch (err) {
        console.error("❌ Error inesperado al añadir:", err.message);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Actualizar una cancha existente por ID
    async updateCourt(id, updatedData) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from("courts")
          .update({
            ...updatedData,
            price: Number(updatedData.price),
          })
          .eq("id", id)
          .select(); // Nos devuelve los datos actualizados

        if (error) {
          console.error("❌ Error al actualizar cancha:", error.message);
          this.error = error.message;
          return;
        }

        if (data && data.length > 0) {
          console.log("✅ Cancha actualizada con éxito:", data[0]);
          const index = this.courts.findIndex((c) => c.id === id);
          if (index !== -1) {
            this.courts[index] = data[0]; // Sincronizamos el estado local
          }
        }
      } catch (err) {
        console.error("❌ Error inesperado al actualizar:", err.message);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Eliminar una cancha físicamente de Supabase
    async deleteCourt(id) {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabase.from("courts").delete().eq("id", id);

        if (error) {
          console.error("❌ Error al eliminar cancha:", error.message);
          this.error = error.message;
          return;
        }

        console.log(`✅ Cancha con ID ${id} eliminada con éxito.`);
        this.courts = this.courts.filter((c) => c.id !== id); // Filtramos localmente para removerla de la vista
      } catch (err) {
        console.error("❌ Error inesperado al eliminar:", err.message);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Filtros de UI (Siguen siendo puramente síncronos y locales)
    setSportFilter(sport) {
      this.selectedSport = sport;
    },
    clearFilters() {
      this.selectedSport = "";
      this.searchQuery = "";
    },
  },
});
