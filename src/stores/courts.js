import { defineStore } from "pinia";
import courtsData from "../mocks/courts.json";

export const useCourtsStore = defineStore("courts", {
  state: () => ({
    courts: courtsData,
    searchQuery: "",
    selectedSport: "",
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
    setSportFilter(sport) {
      this.selectedSport = sport;
    },
    clearFilters() {
      this.selectedSport = "";
      this.searchQuery = "";
    },
  },
});
