import { defineStore } from 'pinia'
import reservationsData from '../mocks/reservations.json'

export const useReservationsStore = defineStore('reservations', {
  state: () => ({
    reservations: reservationsData
  }),

  getters: {
    activeReservations: (state) =>
      state.reservations.filter(
        reservation => reservation.status === 'active'
      )
  }
})