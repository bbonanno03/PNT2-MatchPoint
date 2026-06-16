import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import * as reservationsService from "../services/reservationsService";

export const useReservationsStore = defineStore("reservations", {
  state: () => ({
    reservations: [],
    loading: false,
    error: null,
  }),

  getters: {
    myReservations: (state) => {
      const authStore = useAuthStore();
      if (!authStore.user) return [];
      return state.reservations.filter(
        (reservation) => reservation.user_id === authStore.user.id,
      );
    },

    myActiveReservations: (state) => {
      const authStore = useAuthStore();
      if (!authStore.user) return [];
      return state.reservations.filter(
        (reservation) =>
          reservation.user_id === authStore.user.id &&
          reservation.status === "active",
      );
    },

    myCancelledReservations: (state) => {
      const authStore = useAuthStore();
      if (!authStore.user) return [];
      return state.reservations.filter(
        (reservation) =>
          reservation.user_id === authStore.user.id &&
          reservation.status === "cancelled",
      );
    },

    activeReservations: (state) =>
      state.reservations.filter(
        (reservation) => reservation.status === "active",
      ),

    activeReservationCount: (state) => {
      const authStore = useAuthStore();
      if (!authStore.user) return 0;
      return state.reservations.filter(
        (reservation) =>
          reservation.user_id === authStore.user.id &&
          reservation.status === "active",
      ).length;
    },
  },

  actions: {
    async fetchUserReservations() {
      this.loading = true;
      this.error = null;

      const authStore = useAuthStore();
      if (!authStore.user) {
        this.reservations = [];
        this.loading = false;
        return;
      }

      try {
        const data = await reservationsService.getUserReservations(
          authStore.user.id,
        );
        this.reservations = data;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching reservations:", err);
      } finally {
        this.loading = false;
      }
    },

    async fetchAllReservations() {
      this.loading = true;
      this.error = null;
      try {
        const data = await reservationsService.getAllReservations();
        this.reservations = data;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching all reservations:", err);
      } finally {
        this.loading = false;
      }
    },

    async addReservation(userId, courtId, courtName, clubName, date, time) {
      this.loading = true;
      this.error = null;

      try {
        const endTime = this._calculateEndTime(time);

        const newReservation = await reservationsService.createReservation({
          userId,
          courtId,
          reservationDate: date,
          startTime: time,
          endTime: endTime,
        });

        this.reservations.push(newReservation);
        return newReservation;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async cancelReservation(reservationId, date, time) {
      this.loading = true;
      this.error = null;

      try {
        const result = await reservationsService.cancelReservation(
          reservationId,
          date,
          time,
        );

        const index = this.reservations.findIndex(
          (r) => r.id === reservationId,
        );
        if (index !== -1) {
          this.reservations[index].status = "cancelled";
        }

        return result;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearReservations() {
      this.reservations = [];
    },

    _calculateEndTime(startTime) {
      const [hours, minutes] = startTime.split(":").map(Number);
      const endHours = (hours + 1) % 24;
      return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}`;
    },
  },
});
