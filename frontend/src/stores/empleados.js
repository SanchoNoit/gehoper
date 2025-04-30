import { defineStore } from "pinia";
import moment from "moment";
import evaluacionEmpleados from "../assets/scripts/evaluacionEmpleados";

export const useEmpleadosStore = defineStore("empleados", {
  state: () => ({
    empleados: [],
  }),

  getters: {},

  actions: {
    // Se chequea si la lista de empleados se encuentra en el localStorage. Si está, se carga en el store. Si no está, se genera desde el JSON del proyecto.
    async cargarEmpleados() {
      const empleadosEnLocalStorage = localStorage.getItem("empleados");
      if (empleadosEnLocalStorage) {
        this.empleados = JSON.parse(empleadosEnLocalStorage);
      } else {
        const varEmpleadosJson = await import("@/assets/json/empleados.json"); // Solo cargaremos el JSON en caso de requerirlo
        this.empleados = varEmpleadosJson._embedded.empleados;
      }
    },

    // Agrega un turno a un empleado
    async agregarTurnoAEmpleado(
      fechaParametro,
      codigoTurnoParametro,
      empleadoParametro
    ) {
      const empleadoAsignado = this.empleados.find(
        (e) => e.id === empleadoParametro.id
      );

      if (empleadoAsignado) {
        // TODO: Agregar setters a turnos para agregar estos turnos
        empleadoAsignado.turnos.push({
          fecha: fechaParametro,
          codigoTurno: codigoTurnoParametro,
          empleado: empleadoAsignado,
        });
      } else {
        console.error(
          `Se ha intentado agregar al empleado ${empleadoParametro} pero no se encuentra`
        );
      }
    },

    // Agrega turnos para empleados de turno fijo
    agregarTurnosFijos(fecha) {
      // let empleadosReductores = this.empleados.filter(
      //   (emp) => emp.contrato.esReductor
      // );
      if (moment(new Date(fecha)).day() !== 6) {
        for (let emp of this.empleados.filter(
          (emp) => emp.contrato.esReductor
        )) {
          if (
            !evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(emp, fecha)
          ) {
            this.agregarTurnoAEmpleado(fecha, emp.turnosPosibles[0], emp);
          }
        }
      }

      // let empleadosConciliadores = this.empleados.filter(
      //   (emp) => emp.contrato.esConciliador
      // );
      for (let emp of this.empleados.filter(
        (emp) => emp.contrato.esConciliador
      )) {
        debugger;
        if (!evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(emp, fecha)) {
          debugger;
          let codigoTurnoAAsignar =
            moment(fecha).day() === 6
              ? emp.turnosPosibles.find((t) => t[0] === "M")
              : emp.turnosPosibles.find((t) => t[0] === "P");

          this.agregarTurnoAEmpleado(fecha, codigoTurnoAAsignar, emp);
        }
      }
    },

    // Guarda en el localStorage los empleados cada vez que se modifica el objeto empleados.
    guardarEmpleadosEnLocalStorage() {
      localStorage.setItem("empleados", JSON.stringify(this.empleados));
    },
  },
});
