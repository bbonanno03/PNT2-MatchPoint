import { defineStore } from "pinia";
import reservationsData from "../mocks/reservations.json";
import { useAuthStore } from "./auth";

export const useReservationsStore = defineStore("reservations", {
  state: () => ({
    reservations: reservationsData,
  }),

  getters: {
    activeReservations: (state) =>
      state.reservations.filter(
        (reservation) => reservation.status === "active",
      ),

    myReservations: (state) => {
      const authStore = useAuthStore();

      if (!authStore.user) return [];

      return state.reservations.filter(
        (reservation) => reservation.userId === authStore.user.id,
      );
    },
  },

  actions: {
    cancelReservation(id) {
      const reservation = this.reservations.find((res) => res.id === id);
      if (reservation) {
        reservation.status = "cancelled";
      }
    },

    addReservation(userId, courtName, clubName, date, time) {
      const newReservation = {
        id: Date.now(),
        userId: userId,
        courtName: courtName,
        clubName: clubName,
        date: date,
        time: time,
        status: "confirmed",
      };

      this.reservations.push(newReservation);
    },
  },
});
