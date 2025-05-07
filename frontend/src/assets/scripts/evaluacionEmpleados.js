import moment from "moment";
import funcionesAuxiliares from "@/assets/scripts/funcionesAuxiliares";

export default {
  devolverTurnoOptimo(fechaParametro, codigosPropuestos, empleados) {
    const nuevoTurno = {
      fecha: fechaParametro,
      empleado: this.empleadoOptimo(empleados, fechaParametro),
    };

    if (nuevoTurno.empleado) {
      nuevoTurno.codigoTurno = this.definirCodigoTurnoParaEmpleado(
        nuevoTurno.empleado,
        codigosPropuestos
      );
      return nuevoTurno;
    }
  },

  empleadosDisponibles(empleados, fechaParametro, codigosTurnoPropuestos) {
    // Cribamos a los empleados que pueden asignarse
    // 1. Reductores o conciliadores
    let empleadosFiltrados = empleados.filter(
      (e) => !e.contrato.esReductor && !e.contrato.esConciliador
    );

    // 2. Han trabajado menos de 5 turnos en la última semana
    empleadosFiltrados = empleadosFiltrados.filter((e) =>
      this.trabajaMenosDeCincoJornadas(e, fechaParametro)
    );

    // 3. No está asignado a esta jornada laboral
    empleadosFiltrados = empleadosFiltrados.filter(
      (e) => !this.estaEmpleadoAsignadoAEstaJornada(e, fechaParametro)
    );

    // 4. Alguno de sus turnos posibles se encuentran entre los propuestos
    empleadosFiltrados = empleadosFiltrados.filter((e) =>
      this.turnosPropuestosEntreLosPosibles(e, codigosTurnoPropuestos)
    );

    return empleadosFiltrados;
  },

  proponerEmpleadoEnBaseAPuntuacion(empleados) { 
    if (empleados.length > 0) {
      const empleadoPropuesto = empleados.reduce((mejor, actual) => {
        if (
          this.obtenerPuntuacionEmpleado(actual) ===
            this.obtenerPuntuacionEmpleado(mejor) &&
          mejor.tag === 3
        ) {
          return actual;
        } else {
          return this.obtenerPuntuacionEmpleado(actual) >
            this.obtenerPuntuacionEmpleado(mejor)
            ? actual
            : mejor;
        }
      }
    );

    return empleadoPropuesto;

    } else {
      console.warn("Nos hemos quedado sin empleados que proponer");
      return null;
    }
  },

  trabajaMenosDeCincoJornadas(empleado, fecha) {
    let trabajoMenosDeCincoJornadas = true;
    let numeroJornadasTrabajadas = 0;
    const NUMERO_JORNADAS_A_REVISAR = 7;
    const NUMERO_JORNADAS_MAXIMAS = 5;

    for (let i = 0; i < NUMERO_JORNADAS_A_REVISAR; i++) {
      let jornadaEstudiada = moment(fecha).subtract(i, "days");

      if (
        empleado.turnos.some((t) =>
          moment(t.fecha).isSame(jornadaEstudiada, "days")
        )
      ) {
        numeroJornadasTrabajadas++;
      }

      if (numeroJornadasTrabajadas >= NUMERO_JORNADAS_MAXIMAS) {
        trabajoMenosDeCincoJornadas = false;
        break;
      }
    }

    return trabajoMenosDeCincoJornadas;
  },

  estaEmpleadoAsignadoAEstaJornada(empleado, fechaParametro) {
    return empleado.turnos.some((t) =>
      moment(t.fecha).isSame(fechaParametro, "days")
    );
  },

  obtenerPuntuacionEmpleado(empleado, fechaParametro) {
    let numeroHorasTrabajadas = 0;
    const NUMERO_JORNADAS_A_REVISAR = 7;

    for (let i = 0; i < NUMERO_JORNADAS_A_REVISAR; i++) {
      let jornadaEstudiada = moment(fechaParametro).subtract(i, "days");

      if (
        empleado.turnos.some((t) =>
          moment(t.fecha).isSame(jornadaEstudiada, "day")
        )
      ) {
        numeroHorasTrabajadas += parseInt(
          empleado.turnos
            .filter((t) => moment(t.fecha).isSame(jornadaEstudiada, "day"))
            .map((t) => parseInt(t.codigoTurno.replace(/\D/g, ""), 10))
        );
      }
    }

    return empleado.contrato.numeroHorasSemanales / numeroHorasTrabajadas;
  },

  turnosPropuestosEntreLosPosibles(empleado, codigosTurnoPropuestos) {
    return funcionesAuxiliares.compartenElementoDosArray(
      empleado.turnosPosibles,
      codigosTurnoPropuestos
    );
  },

  definirCodigoTurnoParaEmpleado(empleado, codigosPropuestos) {
    let codigoADevolver;

    let codigosComunesEntrePosiblesYPropuestos = codigosPropuestos.filter(
      (cod) => empleado.turnosPosibles.includes(cod)
    );

    codigoADevolver = codigosComunesEntrePosiblesYPropuestos.reduce(
      (max, actual) => {
        const numeroMenor = parseInt(max.slice(1));
        const numeroActual = parseInt(actual.slice(1));
        const tipoTurnoActual = actual[0];
        const tipoTurnoMinimo = max[0];

        if (numeroMenor === numeroActual && tipoTurnoActual === "T") {
          return actual;
        } else {
          return numeroActual > numeroMenor ? actual : max;
        }
      }
    );

    // TODO: Algoritmizar la asignacion de turno por defecto
    return codigoADevolver;
  },

  definirMinimoTurnoPosibleEntreLosDisponibles(empleado, codigosPropuestos) {
    let codigosComunesEntrePosiblesYPropuestos = codigosPropuestos.filter(
      (cod) => empleado.turnosPosibles.includes(cod)
    );

    let codigoADevolver = codigosComunesEntrePosiblesYPropuestos.reduce(
      (min, actual) => {
        const numeroMenor = parseInt(min.slice(1));
        const numeroActual = parseInt(actual.slice(1));
        const tipoTurnoActual = actual[0];
        const tipoTurnoMinimo = min[0];

        if (numeroMenor === numeroActual && tipoTurnoActual === "T") {
          return actual;
        } else {
          return numeroActual < numeroMenor ? actual : min;
        }
      }
    );

    // TODO: Algoritmizar la asignacion de turno por defecto
    return codigoADevolver;
  },

  calcularHorasTrabajadasEnLaUltimaSemana(empleado, fecha) {
    let numeroHorasTrabajadas = 0;
    const NUMERO_JORNADAS_A_REVISAR = 7;

    for (let i = 0; i < NUMERO_JORNADAS_A_REVISAR; i++) {
      let jornadaEstudiada = moment(fecha).subtract(i, "days");

      if (
        empleado.turnos.some((t) =>
          moment(t.fecha).isSame(jornadaEstudiada, "days")
        )
      ) {
        numeroHorasTrabajadas += parseInt(
          empleado.turnos.find((t) =>
            moment(t.fecha).isSame(jornadaEstudiada, "days")
          ).codigoTurno[1]
        );
      }
    }

    return numeroHorasTrabajadas;
  },

  calcularHorasTrabajadasEnSemanaLaboral(empleado, anho, semanaDelAnho) {
    let numeroHorasTrabajadas = 0;
    const lunesDeSemanaAnalizada = moment().year(anho).week(semanaDelAnho).startOf('week').add(1, 'days').format('YYYY-MM-DD');

    for (let i = 0; i < 6; i++) {
      let jornadaEstudiada = lunesDeSemanaAnalizada.add(i, "days");

      if (
        empleado.turnos.some((t) =>
          moment(t.fecha).isSame(jornadaEstudiada, "days")
        )
      ) {
        numeroHorasTrabajadas += parseInt(
          empleado.turnos.find((t) =>
            moment(t.fecha).isSame(jornadaEstudiada, "days")
          ).codigoTurno[1]
        );
      }
    }

    return numeroHorasTrabajadas;
  },

  comprabarHorasTrabajadasEnSemanaEnRelacionAContratadas(empleado, anho, semanaDelAnho) {
    let codigoADevolver = 0;
    const numeroHorasTrabajadasEnSemanaParticular = calcularHorasTrabajadasEnSemanaLaboral(empleado, anho, semanaDelAnho);

    if (empleado.contrato.numeroHorasSemanales > numeroHorasTrabajadasEnSemanaParticular) {
      codigoADevolver = -1;
    } else if (empleado.contrato.numeroHorasSemanales < numeroHorasTrabajadasEnSemanaParticular) {
      codigoADevolver = -2
    }

    return codigoADevolver;
  }
};
