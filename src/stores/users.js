import { defineStore } from "pinia";

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
    // 📝 UPDATE: Modificar datos de un usuario existente
    updateUser(id, updatedData) {
      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          ...updatedData,
        };
      }
    },

    // 🔒 DISABLE / TOGGLE: Alternar estado activo/inactivo de un usuario
    toggleUserStatus(id) {
      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users[index].active = !this.users[index].active;
      }
    },
  },
});
