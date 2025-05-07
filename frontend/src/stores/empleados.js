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
        console.log('Empleados encontrados en el localStorage. Se cargan.')
        this.empleados = JSON.parse(empleadosEnLocalStorage);
      } else {
        console.log('No se encuentran empleados en el localStorage. Se crean a partir del JSON.')
        const varEmpleadosJson = await import("@/assets/json/empleados.json"); // Solo cargaremos el JSON en caso de requerirlo
        this.empleados = varEmpleadosJson._embedded.empleados;
      }
    },

    // Agrega un turno a un empleado
    agregarTurnoAEmpleado(fechaParametro, codigoTurnoParametro, empleadoParametro) {

      if (this.empleados.some((e) => e.id === empleadoParametro.id)) {
        const nuevoTurno = {
          fecha: fechaParametro,
          codigoTurno: codigoTurnoParametro,
          empleado: this.empleados.find((e) => e.id === empleadoParametro.id)
        }

        this.empleados.find((e) => e.id === empleadoParametro.id).turnos.push(nuevoTurno)
      } else {
        console.error(
          `Se ha intentado agregar al empleado ${empleadoParametro} pero no se encuentra`
        );
      }
    },

    // Agrega turnos para empleados de turno fijo
    agregarTurnosFijos(fecha) {

      if (moment(new Date(fecha)).day() !== 6) {
        for (let emp of this.empleados.filter((emp) => emp.contrato.esReductor)) {
          if (!evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(emp, fecha)) {
            this.agregarTurnoAEmpleado(new Date(fecha), emp.turnosPosibles[0], emp);
          }
        }
      }

      for (let emp of this.empleados.filter(
        (emp) => emp.contrato.esConciliador
      )) {
        if (!evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(emp, fecha)) {
          let codigoTurnoAAsignar =
            moment(fecha).day() === 6
              ? emp.turnosPosibles.find((t) => t[0] === "M")
              : emp.turnosPosibles.find((t) => t[0] === "P");

          if (evaluacionEmpleados.trabajaMenosDeCincoJornadas(emp, fecha)) {
            this.agregarTurnoAEmpleado(new Date(fecha), codigoTurnoAAsignar, emp);
          }
        }
      }
    },

    // Guarda en el localStorage los empleados cada vez que se modifica el objeto empleados.
    guardarEmpleadosEnLocalStorage() {
      const empleadosParaLocalStorage = this.empleados.map(e => ({
        id: e.id,
        nombreCompleto: e.nombreCompleto,
        tag: e.tag,
        contrato: e.contrato,
        _links: e._links,
        turnosPosibles: e.turnosPosibles,
        turnos: e.turnos.map(t => ({
          fecha: t.fecha,
          codigoTurno: t.codigoTurno,
          empleado: ({
            id: e.id,
            nombreCompleto: e.nombreCompleto,
            tag: e.tag
          })
        }))
      }));

      try {
        JSON.stringify(empleadosParaLocalStorage);
      } catch (e) {
        console.error("Error durante la serializacion:", e);
      }

      localStorage.setItem("empleados", JSON.stringify(empleadosParaLocalStorage));
    },
  },
});
