// Un turno se define por una fecha, el empleado que lo tiene asignado, y un String que contiene codificada:
//  1. Arco horario que ocupa:
//      M - Manhana
//      T - Tarde
//      P - Partido
//  2. Numero de horas que ocupa en función de su contrato
//      8, 6, 5 o 4 horas
//  Asi por ejemplo, un turno de manhana de 6 horas tendria la codificacion 'M6'

// Los turnos partidos serán habitualmente de 8 horas, mientras que mañana o tarde dependerá del contrato.

// Descripcion: La funcion esJornadaValida leera los turnos de los empleados para una fecha particular y
//              determinara si es valida en base a los criterios de cobertura (2 empleados en todo momento,
//              uno de ellos TAG3) de 10 a 21.
// Entradas: Un array de turnos con los turnos de esa jornada -> [turno1, turno2 ... turnoN]
// Salidas: (0) si es valida, (-1) si no es válida porque en algún momento falta un TAG3, (-2) si no es válida
//          porque en algún momento hay < 2 empleados

export default {
  esJornadaValida(arrayDeTurnosDeJornada) {
    let codigoADevolver;

    // Comprobamos que para esa fecha particular, hay en todo momento un TAG3
    // Para ello, agrupamos en un array todos los turnos de una jornada particular

    const faltaTag3EnAlgunMomento = !this.hay_Un_EmpleadoEnTodoMomento(arrayDeTurnosDeJornada.filter((t) => t.empleado.tag === 3))
    const hayHuecosConMenosDeDosEmpleados = !this.hay_DosOMas_EmpleadosEnTodoMomento(arrayDeTurnosDeJornada)

    console.log(`En el turno ${arrayDeTurnosDeJornada}, ¿falta tag 3 en algun momento?: ${faltaTag3EnAlgunMomento}, ¿faltan empleados min 2 en algun momento?: ${hayHuecosConMenosDeDosEmpleados}`)

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
    for(let turno of arrayTurnos) {
        const franjaDelTurno = turno.codigoTurno[0];
        const horasTrabajadas = turno.codigoTurno[1];
        
        if (franjaDelTurno === 'M') {
            for (let i = 0; i < horasTrabajadas; i++) {
                arrayHorario[i] = 1;
            }
        } else if (franjaDelTurno === 'T') {
            for (let i = 10; i >= (11 - horasTrabajadas); i--) {
                arrayHorario[i] = 1;
            }
        } else if (franjaDelTurno === 'P') {
            for (let i = 0; i < (horasTrabajadas / 2) + (horasTrabajadas % 2); i++) {
                arrayHorario[i] = 1;
            }
            for (let i = 10; i >= (11 - (horasTrabajadas / 2)); i--) {
                arrayHorario[i] = 1;
            }
        }
    }

    const todasLasHorasTienenUnEmpleado = !arrayHorario.some((h) => h === 0)

    return todasLasHorasTienenUnEmpleado;
  },

  hay_DosOMas_EmpleadosEnTodoMomento(arrayTurnos) {
    // Este array contiene 11 elementos, que son las 11 horas cubiertas en el dia.
    // 0:(10-11), 1:(11-12) ... 10(20-21)
    const arrayHorario = new Array(11).fill(0);

    // console.log(`El empleado ${turno.empleado.nombreCompleto} tiene el turno ${turno.codigoTurno}`)

    // Rellenamos el array con las horas cubiertas por el array de turnos recibido
    for(let turno of arrayTurnos) {
        const franjaDelTurno = turno.codigoTurno[0];
        const horasTrabajadas = turno.codigoTurno[1];
        
        if (franjaDelTurno === 'M') {
            for (let i = 0; i < horasTrabajadas; i++) {
                arrayHorario[i] += 1;
            }
        } else if (franjaDelTurno === 'T') {
            for (let i = 10; i >= (11 - horasTrabajadas); i--) {
                arrayHorario[i] += 1;
            }
        } else if (franjaDelTurno === 'P') {
            for (let i = 0; i < (horasTrabajadas / 2) + (horasTrabajadas % 2); i++) {
                arrayHorario[i] += 1;
            }
            for (let i = 10; i >= (11 - (horasTrabajadas / 2)); i--) {
                arrayHorario[i] += 1;
            }
        }
    }

    const todasLasHorasTienenDosOMasEmpleados = !arrayHorario.some((h) => h < 2)

    return todasLasHorasTienenDosOMasEmpleados;
  },
};
