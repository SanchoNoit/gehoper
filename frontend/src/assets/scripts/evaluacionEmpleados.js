import moment from 'moment'

export default {
  devolverTurnoOptimo(fechaParametro, codigosPropuestos, empleados) {
    const nuevoTurno = {
      fecha: fechaParametro,
      empleado: this.empleadoOptimo(empleados, fechaParametro),
    };

    if (nuevoTurno.empleado) {
      nuevoTurno.codigoTurno = this.definirCodigoTurnoParaEmpleado(nuevoTurno.empleado, codigosPropuestos)

       return nuevoTurno;
    }
  },

  empleadoOptimo(empleados, fechaParametro) {
    // Cribamos a los que no pueden asignarse
    // 1. Reductores o conciliadores
    let empleadosFiltrados = empleados.filter((e) => !e.contrato.esReductor && !e.contrato.esConciliador)

    // 2. Han trabajado menos de 5 turnos en la última semana
    empleadosFiltrados = empleadosFiltrados.filter((e) => this.trabajaMenosDeCincoJornadas(e, fechaParametro))

    // 3. No está asignado a esta jornada laboral
    empleadosFiltrados = empleadosFiltrados.filter((e) => !this.estaEmpleadoAsignadoAEstaJornada(e, fechaParametro))

    // Obtenemos la puntuación de cada empleado resultante, y nos quedamos con el empleado de mayor puntuación.
    if (empleadosFiltrados.length > 0) {
      return empleadosFiltrados.reduce((mejor,actual) => {
        return this.obtenerPuntuacionEmpleado(actual) > this.obtenerPuntuacionEmpleado(mejor) ? actual : mejor;
      })
    } else {
      console.warn('Nos hemos quedado sin empleados que proponer')
      return null
    }
  },

  trabajaMenosDeCincoJornadas(empleado, fecha) {
    let trabajoMenosDeCincoJornadas = true;
    let numeroJornadasTrabajadas = 0;
    const NUMERO_JORNADAS_A_REVISAR = 7;
    const NUMERO_JORNADAS_MAXIMAS = 5;

    for (let i = 0; i < NUMERO_JORNADAS_A_REVISAR; i++) {
        let jornadaEstudiada = moment(fecha).subtract(i, 'days')

        if (empleado.turnos.some((t) => moment(t.fecha).isSame(jornadaEstudiada, 'days'))) {
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
    return empleado.turnos.some((t) => moment(t.fecha).isSame(fechaParametro, 'days'))
  },

  obtenerPuntuacionEmpleado(empleado, fechaParametro) {
    let numeroHorasTrabajadas = 0;
    const NUMERO_JORNADAS_A_REVISAR = 7;

    for (let i = 0; i < NUMERO_JORNADAS_A_REVISAR; i++) {
        let jornadaEstudiada = moment(fechaParametro).subtract(i, 'days')

        if (empleado.turnos.some((t) => moment(t.fecha).isSame(jornadaEstudiada, 'day'))) {
            numeroHorasTrabajadas += parseInt(empleado.turnos.filter((t) => moment(t.fecha).isSame(jornadaEstudiada, 'day'))
                                                    .map(t => parseInt(t.codigoTurno.replace(/\D/g, ''), 10)))
        }
    }

    return (empleado.contrato.numeroHorasSemanales / numeroHorasTrabajadas)
  },

  definirCodigoTurnoParaEmpleado(empleado, codigosPropuestos) {
    const resultadoDivisionCincoJornadas = empleado.contrato.numeroHorasSemanales / 5;
    let codigoPropuesto;

    debugger

    if (codigosPropuestos.some((c) => parseInt(c[1]) === resultadoDivisionCincoJornadas)) {
      codigoPropuesto = codigosPropuestos.find((c) => parseInt(c[1]) === resultadoDivisionCincoJornadas)
    } else {
      codigoPropuesto = codigosPropuestos.reduce((min, actual) => {
        const numeroMenor = parseInt(min.slice(1));
        const numeroActual = parseInt(actual.slice(1));
        return numeroActual < numeroMenor ? actual : min;
      });
      
    }

    return codigoPropuesto;
  }

};
