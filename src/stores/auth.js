import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    login(email, password) {
      if (email === 'admin@matchpoint.com') {
        this.user = {
          id: 1,
          name: 'Administrador',
          email,
          role: 'admin'
        }
      } else {
        this.user = {
          id: 2,
          name: 'Jugador',
          email,
          role: 'player'
        }
      }
    },

    register(name, email, password) {
      this.user = {
        id: Date.now(),
        name,
        email,
        role: 'player'
      }
    },

    logout() {
      this.user = null
    }
  }
})