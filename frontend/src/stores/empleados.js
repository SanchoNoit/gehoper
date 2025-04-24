import { defineStore } from "pinia";

export const useEmpleadosStore = defineStore("empleados", {
  state: () => ({
    empleados: []
  }),

  getters: {},

  actions: {
    // Se chequea si la lista de empleados se encuentra en el localStorage. Si está, se carga en el store. Si no está, se genera desde el JSON del proyecto.
    async cargarEmpleados() {
      const empleadosEnLocalStorage = localStorage.getItem('empleados')
      if (empleadosEnLocalStorage) {
        this.empleados = JSON.parse(empleadosEnLocalStorage)
      } else {
        const varEmpleadosJson = await import('@/assets/json/empleados.json')
        this.empleados = varEmpleadosJson._embedded.empleados
        console.log(this.empleados)
      }
    },

    // Guarda en el localStorage los empleados cada vez que se modifica el objeto empleados.
    guardarEmpleadosEnLocalStorage() {
      localStorage.setItem('empleados', JSON.stringify(this.empleados));
    }
  },
});
