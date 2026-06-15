import { defineStore } from "pinia";
import { supabase } from "../services/supabase";

export const useUsersStore = defineStore("users", {
  state: () => ({
    // 👥 Datos Mock de usuarios iniciales
    users: [
      {
        id: 1,
        name: "Nicolás Gómez",
        email: "nico@matchpoint.com",
        role: "Admin",
        active: true,
      },
      {
        id: 2,
        name: "Lucas Pérez",
        email: "lucas@gmail.com",
        role: "Cliente",
        active: true,
      },
      {
        id: 3,
        name: "Martina Silva",
        email: "marti@hotmail.com",
        role: "Cliente",
        active: true,
      },
      {
        id: 4,
        name: "Julián Rossi",
        email: "juli@matchpoint.com",
        role: "Admin",
        active: false,
      },
    ],
  }),

  actions: {

    async loadUsers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (!error) {
        this.users = data;
      }
    },
    // 📝 UPDATE: Modificar datos de un usuario existente
    async updateUser(id, updatedData) {
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', id)

      if (!error) {
        await this.loadUsers()
      }
    },

    // 🔒 DISABLE / TOGGLE: Alternar estado activo/inactivo de un usuario
    async toggleUserStatus(id) {
  const user = this.users.find(u => u.id === id)

  if (!user) return

  const { error } = await supabase
    .from('profiles')
    .update({
      active: !user.active
    })
    .eq('id', id)

  if (!error) {
    await this.loadUsers()
  }
}
  },
});
