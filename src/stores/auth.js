import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
    loading: false
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

    async register(name, email, password) {
      this.loading = true
      this.error = null

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        this.error = error.message
        this.loading = false
        return
      }

      const userId = data.user.id

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name,
          email,
          role: 'player',
          active: true
        })

      if (profileError) {
        this.error = profileError.message
        this.loading = false
        return
      }

      this.user = {
        id: userId,
        name,
        email,
        role: 'player'
      }

      this.loading = false
    },

    logout() {
      this.user = null
    }
  }
})