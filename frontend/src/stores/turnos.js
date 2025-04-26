import { defineStore } from "pinia";
import { mapState } from "pinia";
import { useEmpleadosStore } from "@/stores/empleados";

export const useTurnosStore = defineStore("jornadas", {
  state: () => {
    return {
    };
  },

  getters: {
    todosLosTurnos() {
      const empleadosStore = useEmpleadosStore();
      return empleadosStore.empleados.flatMap(empleado => empleado.turnos);
    }
  },

  actions: {
  },
});
