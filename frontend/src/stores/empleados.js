import { defineStore } from "pinia";
import evaluacionEmpleados from "../assets/scripts/evaluacionEmpleados";

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
        const varEmpleadosJson = await import('@/assets/json/empleados.json') // Solo cargaremos el JSON en caso de requerirlo
        this.empleados = varEmpleadosJson._embedded.empleados
      }
    },

    // Agrega un turno a un empleado
    async agregarTurnoAEmpleado(turno) {
      const empleadoAsignado = this.empleados.find(e => e.id === turno.empleado.id);

      if (empleadoAsignado) {
        empleadoAsignado.turnos.push(turno);
      } else {
        console.error(`Se ha intentado agregar al empleado del turno ${turno} pero no se encuentra`)
      }
    },

    // Agrega turnos para empleados de turno fijo
    async agregarTurnosFijos(fecha) {
      let empleadosReductores = this.empleados.filter((emp) => emp.contrato.esReductor)
      if ((new Date(fecha)).getDay() !== 6) {
        for (let emp of empleadosReductores) {
          if (!evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(emp, fecha)) {
            this.agregarTurnoAEmpleado({
              fecha: fecha,
              empleado: emp,
              codigoTurno: "M" + emp.contrato.numeroHorasSemanales / 5
            })
          }
        }
      }

      let empleadosConciliadores = this.empleados.filter((emp) => emp.contrato.esConciliador)
        for (let emp of empleadosConciliadores) {
          if (!evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(emp, fecha)) {
            let codigoTurnoAAsignar = (new Date(fecha)).getDay() === 6 ? "M8" : "P8";

            this.agregarTurnoAEmpleado({
              fecha: fecha,
              empleado: emp,
              codigoTurno: codigoTurnoAAsignar
            })
          }
        }

    },

    // Guarda en el localStorage los empleados cada vez que se modifica el objeto empleados.
    guardarEmpleadosEnLocalStorage() {
      localStorage.setItem('empleados', JSON.stringify(this.empleados));
    }
  },
});
