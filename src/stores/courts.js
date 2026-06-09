import { defineStore } from 'pinia'
import courtsData from '../mocks/courts.json'

export const useCourtsStore = defineStore('courts', {
  state: () => ({
    courts: courtsData
  }),

  getters: {
    activeCourts: (state) =>
      state.courts.filter(court => court.active)
  }
})