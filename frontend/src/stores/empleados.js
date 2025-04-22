import { defineStore } from "pinia";
import empleadosDatosJson from "@/assets/json/empleados.json";

export const useEmpleadosStore = defineStore("empleados", {
  state: () => ({
    empleados: empleadosDatosJson._embedded.empleados.map((empleado) => ({
      ...empleado,
    })),
  }),

  getters: {},

  actions: {
  },
});
