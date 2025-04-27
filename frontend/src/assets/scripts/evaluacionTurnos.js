// Un turno se define por una fecha, el empleado que lo tiene asignado, y un String que contiene codificada:
//  1. Arco horario que ocupa:
//      M - Manhana
//      T - Tarde
//      P - Partido
//  2. Numero de horas que ocupa en función de su contrato
//      8, 6, 5 o 4 horas
//  Asi por ejemplo, un turno de manhana de 6 horas tendria la codificacion 'M6'

// Los turnos partidos serán habitualmente de 8 horas, mientras que mañana o tarde dependerá del contrato.

export default {
  // Descripcion: La funcion esJornadaValida leera los turnos de los empleados para una fecha particular y
  //              determinara si es valida en base a los criterios de cobertura (2 empleados en todo momento,
  //              uno de ellos TAG3) de 10 a 21.
  // Entradas: Un array de turnos con los turnos de esa jornada -> [turno1, turno2 ... turnoN]
  // Salidas: (0) si es valida, (-1) si no es válida porque en algún momento falta un TAG3, (-2) si no es válida
  //          porque en algún momento hay < 2 empleados
  esJornadaValida(arrayDeTurnosDeJornada) {
    let codigoADevolver;

    // Comprobamos que para esa fecha particular, hay en todo momento un TAG3
    // Para ello, agrupamos en un array todos los turnos de una jornada particular

    const faltaTag3EnAlgunMomento = !this.hay_Un_EmpleadoEnTodoMomento(
      arrayDeTurnosDeJornada.filter((t) => t.empleado.tag === 3)
    );
    const hayHuecosConMenosDeDosEmpleados =
      !this.hay_DosOMas_EmpleadosEnTodoMomento(arrayDeTurnosDeJornada);

    if (faltaTag3EnAlgunMomento) {
      codigoADevolver = -1;
    } else if (hayHuecosConMenosDeDosEmpleados) {
      codigoADevolver = -2;
    } else {
      codigoADevolver = 0;
    }

    return codigoADevolver;
  },

  // Este metodo devuelve si dado un array de turnos, toda la franja horaria esta cubierta por al menos un empelado
  hay_Un_EmpleadoEnTodoMomento(arrayTurnos) {
    // Este array contiene 11 elementos, que son las 11 horas cubiertas en el dia.
    // 0:(10-11), 1:(11-12) ... 10(20-21)
    const arrayHorario = new Array(11).fill(0);

    // Rellenamos el array con las horas cubiertas por el array de turnos recibido
    for (let turno of arrayTurnos) {
      const franjaDelTurno = turno.codigoTurno[0];
      const horasTrabajadas = turno.codigoTurno[1];

      if (franjaDelTurno === "M") {
        for (let i = 0; i < horasTrabajadas; i++) {
          arrayHorario[i] = 1;
        }
      } else if (franjaDelTurno === "T") {
        for (let i = 10; i >= 11 - horasTrabajadas; i--) {
          arrayHorario[i] = 1;
        }
      } else if (franjaDelTurno === "P") {
        for (let i = 0; i < horasTrabajadas / 2 + (horasTrabajadas % 2); i++) {
          arrayHorario[i] = 1;
        }
        for (let i = 10; i >= 11 - horasTrabajadas / 2; i--) {
          arrayHorario[i] = 1;
        }
      }
    }

    const todasLasHorasTienenUnEmpleado = !arrayHorario.some((h) => h === 0);

    return todasLasHorasTienenUnEmpleado;
  },

  hay_DosOMas_EmpleadosEnTodoMomento(arrayTurnos) {
    // Este array contiene 11 elementos, que son las 11 horas cubiertas en el dia.
    // 0:(10-11), 1:(11-12) ... 10(20-21)
    const arrayHorario = new Array(11).fill(0);

    // Rellenamos el array con las horas cubiertas por el array de turnos recibido
    for (let turno of arrayTurnos) {
      const franjaDelTurno = turno.codigoTurno[0];
      const horasTrabajadas = turno.codigoTurno[1];

      if (franjaDelTurno === "M") {
        for (let i = 0; i < horasTrabajadas; i++) {
          arrayHorario[i] += 1;
        }
      } else if (franjaDelTurno === "T") {
        for (let i = 10; i >= 11 - horasTrabajadas; i--) {
          arrayHorario[i] += 1;
        }
      } else if (franjaDelTurno === "P") {
        for (let i = 0; i < horasTrabajadas / 2 + (horasTrabajadas % 2); i++) {
          arrayHorario[i] += 1;
        }
        for (let i = 10; i >= 11 - horasTrabajadas / 2; i--) {
          arrayHorario[i] += 1;
        }
      }
    }

    const todasLasHorasTienenDosOMasEmpleados = !arrayHorario.some(
      (h) => h < 2
    );

    return todasLasHorasTienenDosOMasEmpleados;
  },

  recuperarArrayHorasCubiertasPorTag3(arrayDeTurnosDeJornada) {
    const arrayHorario = new Array(11).fill(0);
    let arrayTurnosTag3 = arrayDeTurnosDeJornada.filter((t) => t.empleado.tag === 3)

    for (let turno of arrayTurnosTag3) {
      const franjaDelTurno = turno.codigoTurno[0];
      const horasTrabajadas = turno.codigoTurno[1];

      if (franjaDelTurno === "M") {
        for (let i = 0; i < horasTrabajadas; i++) {
          arrayHorario[i] = 1;
        }
      } else if (franjaDelTurno === "T") {
        for (let i = 10; i >= 11 - horasTrabajadas; i--) {
          arrayHorario[i] = 1;
        }
      } else if (franjaDelTurno === "P") {
        for (let i = 0; i < horasTrabajadas / 2 + (horasTrabajadas % 2); i++) {
          arrayHorario[i] = 1;
        }
        for (let i = 10; i >= 11 - horasTrabajadas / 2; i--) {
          arrayHorario[i] = 1;
        }
      }
    }

    return arrayHorario;
  },

  obtenerArrayCodigosDeTurnoPropuestoParaTag3(arrayDeTurnosDeJornada) {
    const arrayHorario = this.recuperarArrayHorasCubiertasPorTag3(arrayDeTurnosDeJornada)
    let codigosPropuestos = [];

    if (arrayHorario[0] === 0 && arrayHorario[10] === 0) {
      codigosPropuestos.push('P8')
    } else if (arrayHorario[4] === 0 && arrayHorario[6] === 0) {
      codigosPropuestos.push('T8', 'M8', 'M6', 'T6')
    }
    
    if (arrayHorario[0] === 0 && arrayHorario[7] === 0) {
      codigosPropuestos.push('M8')
    }
    
    if (arrayHorario[0] === 0 && arrayHorario[5] === 0) {
      codigosPropuestos.push('M6', 'M8')
    }
    
    if (arrayHorario[0] === 0 && arrayHorario[3] === 0) {
      codigosPropuestos.push('M4', 'M5', 'M6', 'M8')
    }
    
    if (arrayHorario[10] === 0 && arrayHorario[3] === 0) {
      codigosPropuestos.push('T8')
    }
    
    if (arrayHorario[10] === 0 && arrayHorario[5] === 0) {
      codigosPropuestos.push('T6', 'T8')
    }
    
    if (arrayHorario[10] === 0 && arrayHorario[6] === 0) {
      codigosPropuestos.push('T4', 'T5', 'T6', 'T8')
    }

    return [...new Set(codigosPropuestos)];
  },

  recuperarArrayHorasCubiertasPorNumeroEmpleados(arrayDeTurnosDeJornada) {
    const arrayHorario = new Array(11).fill(0);

    for (let turno of arrayDeTurnosDeJornada) {
      const franjaDelTurno = turno.codigoTurno[0];
      const horasTrabajadas = turno.codigoTurno[1];

      if (franjaDelTurno === "M") {
        for (let i = 0; i < horasTrabajadas; i++) {
          arrayHorario[i] += 1;
        }
      } else if (franjaDelTurno === "T") {
        for (let i = 10; i >= 11 - horasTrabajadas; i--) {
          arrayHorario[i] += 1;
        }
      } else if (franjaDelTurno === "P") {
        for (let i = 0; i < horasTrabajadas / 2 + (horasTrabajadas % 2); i++) {
          arrayHorario[i] += 1;
        }
        for (let i = 10; i >= 11 - horasTrabajadas / 2; i--) {
          arrayHorario[i] += 1;
        }
      }
    }

    return arrayHorario;
  },

  obtenerArrayCodigosDeTurnoPropuesto(arrayDeTurnosDeJornada) {
    const arrayHorario = this.recuperarArrayHorasCubiertasPorNumeroEmpleados(arrayDeTurnosDeJornada)
    let codigosPropuestos = [];

    if (arrayHorario[0] === 0 && arrayHorario[10] === 0) {
      codigosPropuestos.push('P8')
    } else if (arrayHorario[4] < 2 && arrayHorario[6] < 2) {
      codigosPropuestos.push('T8', 'M8', 'M6', 'T6')
    }
    
    if (arrayHorario[0] < 2 && arrayHorario[7] < 2) {
      codigosPropuestos.push('M8')
    }
    
    if (arrayHorario[0] < 2 && arrayHorario[5] < 2) {
      codigosPropuestos.push('M6', 'M8')
    }
    
    if (arrayHorario[0] < 2 && arrayHorario[3] < 2) {
      codigosPropuestos.push('M4', 'M5', 'M6', 'M8')
    }
    
    if (arrayHorario[10] < 2 && arrayHorario[3] < 2) {
      codigosPropuestos.push('T8')
    }
    
    if (arrayHorario[10] < 2 && arrayHorario[5] < 2) {
      codigosPropuestos.push('T6', 'T8')
    }
    
    if (arrayHorario[10] < 2 && arrayHorario[6] < 2) {
      codigosPropuestos.push('T4', 'T5', 'T6', 'T8')
    }

    return [...new Set(codigosPropuestos)];
  },

};
