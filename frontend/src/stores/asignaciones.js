import { defineStore } from "pinia";
import { mapState } from "pinia";
import { useEmpleadosStore } from "@/stores/empleados";
import { getAsignaciones } from "@/stores/api-service-gehoper";

export const useAsignacionesStore = defineStore("jornadas", {
  state: () => {
    return {
      asignaciones: [],
    };
  },

  getters: {},

  actions: {

    async cargarAsignacionesDesdeAPI() {
            await getAsignaciones()
        .then((response) => {
          this.asignaciones = response.data._embedded.asignaciones;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
});
