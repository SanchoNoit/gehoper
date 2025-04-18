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
    buscarEmpleadoOptimoEnBloqueHorario(tag, fecha, indiceHora) {
      // console.log(`Se solicita un empleado ${tag} para la franja horaria ${fecha} - ${(indiceHora + 10) }`);
    },
  },
});
