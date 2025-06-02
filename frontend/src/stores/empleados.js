import { defineStore } from "pinia";
import {
  getEmpleados,
  deleteEntidad,
  postEmpleadoLaboral,
  postEmpleadoPracticas,
} from "@/stores/api-service-gehoper";
import moment from "moment";
import evaluacionEmpleados from "../assets/scripts/evaluacionEmpleados";
import { putEntidad } from "./api-service-gehoper";

export const useEmpleadosStore = defineStore("empleados", {
  state: () => ({
    empleados: [],
  }),

  getters: {},

  actions: {
    // API: Se cargan los empleados desde la API. Sino están, se cargan los predefinidos en el JSON.
    async cargarEmpleadosDesdeAPI() {
      await getEmpleados()
        .then((response) => {
          const empleadosLaborales =
            response.data._embedded["empleados-laborales"];
          const empleadosPracticas =
            response.data._embedded["empleados-practicas"];
          this.empleados = empleadosLaborales.concat(empleadosPracticas);
        })
        .catch((err) => {
          console.log(
            "No se pueden extraer empleados de la API ni del localStorage.",
            " Se crean en base al JSON de emergencia 🚨.",
            err
          );
          const varEmpleadosJson = import("@/assets/json/empleados.json");
          this.empleados = varEmpleadosJson._embedded.empleados;
        });
    },

    // Agrega una asignación a un empleado
    agregarAsignacionAEmpleado(
      fechaParametro,
      codigoTurnoParametro,
      empleadoParametro
    ) {
      if (this.empleados.some((e) => e.id === empleadoParametro.id)) {
        const nuevoTurno = {
          fecha: fechaParametro,
          codigoTurno: codigoTurnoParametro,
          empleado: this.empleados.find((e) => e.id === empleadoParametro.id),
        };

        this.empleados
          .find((e) => e.id === empleadoParametro.id)
          .turnos.push(nuevoTurno);
      } else {
        console.error(
          `Se ha intentado agregar al empleado ${empleadoParametro} pero no se encuentra`
        );
      }
    },

    // API: Agrega un turno a un empleado en la BBDD
    agregarAsignacionAEmpleadoEnAPI(
      fechaParametro,
      codigoTurnoParametro,
      empleadoParametro
    ) {
      if (
        this.empleados.some(
          (e) => e._links.self === empleadoParametro._links.self
        )
      ) {
        const nuevaAsignacion = {
          fecha: fechaParametro,
          codigoTurno: codigoTurnoParametro,
          empleado: empleadoParametro._links_self,
        };

        this.empleados
          .find((e) => e.id === empleadoParametro.id)
          .turnos.push(nuevoTurno);
      } else {
        console.error(
          `Se ha intentado agregar la asignación a ${empleadoParametro} pero ha sucedido algún error.`
        );
      }
    },

    // Agrega turnos para empleados de turno fijo
    agregarTurnosFijos(fecha) {
      if (moment(new Date(fecha)).day() !== 6) {
        for (let emp of this.empleados.filter(
          (emp) => emp.contrato.esReductor
        )) {
          if (
            !evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(emp, fecha)
          ) {
            this.agregarAsignacionAEmpleado(
              new Date(fecha),
              emp.turnosPosibles[0],
              emp
            );
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
            this.agregarAsignacionAEmpleado(
              new Date(fecha),
              codigoTurnoAAsignar,
              emp
            );
          }
        }
      }
    },

    // Guarda en el localStorage los empleados cada vez que se modifica el objeto empleados.
    guardarEmpleadosEnLocalStorage() {
      const empleadosParaLocalStorage = this.empleados.map((e) => ({
        id: e.id,
        nombreCompleto: e.nombreCompleto,
        tag: e.tag,
        contrato: e.contrato,
        _links: e._links,
        turnosPosibles: e.turnosPosibles,
        turnos: e.turnos.map((t) => ({
          fecha: t.fecha,
          codigoTurno: t.codigoTurno,
          empleado: {
            id: e.id,
            nombreCompleto: e.nombreCompleto,
            tag: e.tag,
          },
        })),
      }));

      try {
        JSON.stringify(empleadosParaLocalStorage);
      } catch (e) {
        console.error("Error durante la serializacion:", e);
      }

      localStorage.setItem(
        "empleados",
        JSON.stringify(empleadosParaLocalStorage)
      );
    },

    // API: Crea un nuevo empleado
    async anadirEmpleadoEnAPI(nuevoEmpleado) {
      console.log("En el store, lo que recibe: ", nuevoEmpleado);
      try {
        const responseEmpleados = nuevoEmpleado.tipoEmpleado
          ? await postEmpleadoLaboral(nuevoEmpleado)
          : await postEmpleadoPracticas(nuevoEmpleado);

        console.log("La respuesta de la API es: ", responseEmpleados);
        if (responseEmpleados.status >= 200 & responseEmpleados.status <= 299) {
          const empleadoAgregado = {
            ...nuevoEmpleado,
            _links: responseEmpleados.data._links,
          };

          console.log(empleadoAgregado)
          this.empleados.unshift(empleadoAgregado);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    },

    // API: Modifica un empleado
    async modificarEmpleadoAPI(empleadoEditado) {
      console.log("En el store, modificando empleado, lo que recibe: ", empleadoEditado);
      const index = this.empleados.findIndex(e => e._links.self.href === empleadoEditado._links.self.href)
      console.log(index)
      try {
        const responseEmpleados = await putEntidad(empleadoEditado._links.self.href, empleadoEditado)

        console.log("La respuesta de la API es: ", responseEmpleados);
        if (responseEmpleados.status >= 200 & responseEmpleados.status <= 299) {
          const empleadoAgregado = {
            ...empleadoEditado,
            _links: responseEmpleados.data._links,
          };

          this.empleados[index] = empleadoAgregado;
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    },

    // API: Eliminar un empleado, que incluye eliminarlo del store y en la BBDD
    async eliminarEmpleadoEnStore(empleadoHref) {
      try {
        const response = await deleteEntidad(empleadoHref);
        if (response.status === 200) {
          const index = this.empleados.findIndex(
            (e) => e._links.self.href === empleadoHref
          );
          if (index !== -1) {
            this.empleados.splice(index, 1);
          }
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    },
  },
});
