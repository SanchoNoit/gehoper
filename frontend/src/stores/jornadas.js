import { defineStore } from "pinia";
import jornadasDelAnho from "@/assets/json/jornadasDelAnho";
import { mapState, mapActions } from "pinia";
import { useEmpleadosStore } from "./empleados";
import moment from "moment";
import funcionesAuxiliares from "@/assets/scripts/funcionesAuxiliares";

export const useJornadasStore = defineStore("jornadas", {
  state: () => {
    return {
      jornadasGuardadasEnPinia: [],
      esCalendarioNuevo: true,
      jornadasAgrupadasEnSemanasLaborales: [],
    };
  },

  getters: {
    ...mapState(useEmpleadosStore, ["empleados"]),
  },

  actions: {
    ...mapActions(useEmpleadosStore, ["buscarEmpleadoOptimoEnBloqueHorario"]),

    inicializarJornadas() {
      // Vamos a comprobar que el array de jornadas está en el local storage.
      const estaEnLocalStorage = localStorage.getItem(
        "jornadasGuardadasEnPinia"
      );

      let jornadas;

      // Si está el el localStorage, lo cargamos en el estado de la store.
      if (estaEnLocalStorage) {
        jornadas = JSON.parse(estaEnLocalStorage);
        this.esCalendarioNuevo = false;
        console.log(
          "Encontrado calendario de turnos en el local storage."
        );
      } else {
        jornadas = jornadasDelAnho._embedded.jornadasDelAnho.map((jornada) => {
          const fecha = new Date(jornada.fecha);
          return {
            ...jornada,
            esFestivo: fecha.getDay() === 0,
          };
        });
        console.log(
          "No encontrado calendario de turnos en el local storage. Se crea."
        );
      }

      // Finalmente, asignamos el array de jornadas de la store a la variable local.
      this.jornadasGuardadasEnPinia = jornadas;
    },

    rellenarCalendario() {
      // Agrupamos las jornadas por semana
      this.agruparJornadasEnSemanas();

      // Si es un Calendario recién creado, se autorellena desde 0. Si no, no se autorellena.
      if (this.esCalendarioNuevo) {
        // Rellenaremos el calendario semana a semana.
        this.rellenarSemanaLaboral();

        // TODO : Guardar el calendario relleno en el local storage.
        // console.log("Finalmente, guardamos la version en Pinia")
        // localStorage.removeItem("jornadasGuardadasEnPinia")        
        // localStorage.setItem(
        //   "jornadasGuardadasEnPinia",
        //   JSON.stringify(this.jornadasGuardadasEnPinia)
        // );
        
      }

      debugger
    },

    rellenarSemanaLaboral() {
      // Ahora vamos a rellenar las semanas en base a la prioridad marcada según el algoritmo desarrollado.
      for (let claveSemanaLaboral in this.jornadasAgrupadasEnSemanasLaborales) {
        // Primero, asignamos los turnos fijos de los reductores de jornada.
        this.asignarTurnosDeReductores(claveSemanaLaboral);
        // Luego, asignamos los turnos de conciliadores.
        this.asignarTurnosDeConciliadores(claveSemanaLaboral);
        // Por último, rellenamos los huecos restantes.
        this.rellenarHuecosRestantes(claveSemanaLaboral);
      }
    },

    asignarTurnosDeReductores(claveSemanaLaboral) {
      // Los reductores trabajan de lunes a viernes, siempre de horario de manhana.
      // Primero, identificamos a los reductores
      let coleccionDeEmpleadosReductores = this.empleados.filter(
        (empleado) => empleado.contrato.esReductor
      );

      // Iteramos empleado a empleado reductor asignándole el turno
      for (let empleadoReductor of coleccionDeEmpleadosReductores) {
        let horasTrabajadasPorEmpleadoAlDia =
          empleadoReductor.contrato.numeroHorasSemanales / 5;
        for (let jornadaIteradaEnAsignarTurnosReductores of this
          .jornadasAgrupadasEnSemanasLaborales[claveSemanaLaboral]) {
          if (
            !jornadaIteradaEnAsignarTurnosReductores.esFestivo &&
            new Date(jornadaIteradaEnAsignarTurnosReductores.fecha).getDay() !==
              6
          ) {
            this.introducirEmpleadoEnTurnoContinuo(
              jornadaIteradaEnAsignarTurnosReductores,
              true,
              horasTrabajadasPorEmpleadoAlDia,
              empleadoReductor
            );
          }
        }
      }
    },

    asignarTurnosDeConciliadores(claveSemanaLaboral) {
      // Los conciliadores trabajan siempre de en turno partido de lunes a viernes,
      // y en horario de mañana los sabados.

      // Primero, identificamos a los conciliadores.
      let coleccionEmpleadosConciliadores = this.empleados.filter(
        (empleado) => empleado.contrato.esConciliador
      );

      // Ahora, iteramos empleado conciliador a empleado conciliador asignándole el turno.
      for (let empleadoConciliador of coleccionEmpleadosConciliadores) {
        let horasTrabajadasPorEmpleadoAlDia =
          empleadoConciliador.contrato.numeroHorasSemanales / 5;
        for (let jornadaIteradaEnAsignarTurnosConciliadores of this
          .jornadasAgrupadasEnSemanasLaborales[claveSemanaLaboral]) {
          if (!jornadaIteradaEnAsignarTurnosConciliadores.esFestivo) {
            if (
              new Date(
                jornadaIteradaEnAsignarTurnosConciliadores.fecha
              ).getDay() === 6
            ) {
              this.introducirEmpleadoEnTurnoContinuo(
                jornadaIteradaEnAsignarTurnosConciliadores,
                true,
                horasTrabajadasPorEmpleadoAlDia,
                empleadoConciliador
              );
            } else {
              this.introducirEmpleadoEnTurnoPartido(
                jornadaIteradaEnAsignarTurnosConciliadores,
                empleadoConciliador
              );
            }
          }
        }
      }
    },

    rellenarHuecosRestantes(claveSemanaLaboral) {
      // Necesitamos asignar todas las horas disponibles por contrato a los empleados que no son reductores, ni conciliadores.
      // Crearemos una lista de empleados que se llevará la cuenta de las horas que tienen asignadas esa semana.
      let empleadosNoReductoresNiConciliadores = this.empleados
        .filter((e) => !(e.contrato.esReductor || e.contrato.esConciliador))
        .map((e) => {
          return {
            ...e,
            horasTrabajadasEstaSemana: 0,
          };
        });

      // BUCLE QUE ASIGNA TODAS LAS HORAS DISPONIBLES DE LOS EMPLEADOS
      for (let empleado of empleadosNoReductoresNiConciliadores) {
        let numeroJornadasAsignadas = 0;
        this.obtenerJornadasDeMenorPuntuacionDeLaSemanaPorTag(claveSemanaLaboral, empleado.tag)
        do {

          // JORNADAS DE MENOR COBERTURA POR TAG
          let jornadaDeMenorCobertura;
          let indice = 0;
          do {
            jornadaDeMenorCobertura = this.obtenerJornadasDeMenorPuntuacionDeLaSemanaPorTag(claveSemanaLaboral, empleado.tag)[indice++];
          } while (this.estaEmpleadoPresenteEnJornada(empleado, jornadaDeMenorCobertura) &&
                    indice < this.obtenerJornadasDeMenorPuntuacionDeLaSemanaPorTag(claveSemanaLaboral, empleado.tag).length);

        // TURNO RECOMENDADO EN FUNCION DEL DIA Y TAG
        let turnoRecomendado = this.recomendarTurno(jornadaDeMenorCobertura, empleado.tag);

        // ASIGNAR TURNO
        const horasDeTurnoPartido = 8;
        if (turnoRecomendado === "partido") {
          this.introducirEmpleadoEnTurnoPartido(
            jornadaDeMenorCobertura,
            empleado
          );

          empleado.horasTrabajadasEstaSemana += horasDeTurnoPartido;

        } else {
          this.introducirEmpleadoEnTurnoContinuo(
            jornadaDeMenorCobertura,
            turnoRecomendado === "manhana",
            empleado.contrato.numeroHorasSemanales / 5,
            empleado
          );

          empleado.horasTrabajadasEstaSemana +=
            empleado.contrato.numeroHorasSemanales / 5;
        }

        numeroJornadasAsignadas++;
        } while ((empleado.horasTrabajadasEstaSemana < empleado.contrato.numeroHorasSemanales) 
                  && numeroJornadasAsignadas < this.obtenerJornadasDeMenorPuntuacionDeLaSemanaPorTag(claveSemanaLaboral, empleado.tag).length)
          
      }
    },

    introducirEmpleadoEnTurnoContinuo(
      jornadaEnLaQueIntroducimosTurno,
      esTurnoDeManhana,
      horasTrabajadasPorEmpleadoAlDia,
      empleadoAgregar
    ) {
      let indiceHoraInicial = esTurnoDeManhana
        ? 0
        : 11 - horasTrabajadasPorEmpleadoAlDia;
      let indiceHoraFinal = esTurnoDeManhana
        ? horasTrabajadasPorEmpleadoAlDia - 1
        : 10;

      for (let i = indiceHoraInicial; i <= indiceHoraFinal; i++) {
        if (empleadoAgregar.tag === 1) {
          jornadaEnLaQueIntroducimosTurno.asignacionesPorHoraTag1[i].push(
            empleadoAgregar
          );
        } else if (empleadoAgregar.tag === 3) {
          jornadaEnLaQueIntroducimosTurno.asignacionesPorHoraTag3[i].push(
            empleadoAgregar
          );
        }
      }
    },

    introducirEmpleadoEnTurnoPartido(
      jornadaEnLaQueIntroducimosTurno,
      empleadoAgregar
    ) {
      for (let i = 0; i <= 3; i++) {
        if (empleadoAgregar.tag === 1) {
          jornadaEnLaQueIntroducimosTurno.asignacionesPorHoraTag1[i].push(
            empleadoAgregar
          );
        } else if (empleadoAgregar.tag === 3) {
          jornadaEnLaQueIntroducimosTurno.asignacionesPorHoraTag3[i].push(
            empleadoAgregar
          );
        }
      }

      for (let i = 7; i <= 10; i++) {
        if (empleadoAgregar.tag === 1) {
          jornadaEnLaQueIntroducimosTurno.asignacionesPorHoraTag1[i].push(
            empleadoAgregar
          );
        } else if (empleadoAgregar.tag === 3) {
          jornadaEnLaQueIntroducimosTurno.asignacionesPorHoraTag3[i].push(
            empleadoAgregar
          );
        }
      }
    },

    puntuarFaltaTrabajadoresEnJornadaPorTag(tag, jornadaAEvaluar) {
      // Puntuaremos como 3 si no hay ningún empleado asignado a una hora particular,
      // 1 si hay un empleado, y 0 si hay más de 1 empleado asignado a una hora.
      let puntuacion = 0;
      let arrayTurnos = [];

      if (tag === 1) {
        arrayTurnos =
          jornadaAEvaluar.asignacionesPorHoraTag1;
      } else if (tag === 3) {
        arrayTurnos =
          jornadaAEvaluar.asignacionesPorHoraTag3;
      }

      for (let i = 0; i < arrayTurnos.length; i++) {
        puntuacion += arrayTurnos[i].length < 1 ? 3 : 1
      }

      return puntuacion;
    },

    obtenerJornadasDeMenorPuntuacionDeLaSemanaPorTag(claveSemanaLaboral, tag) {
      let jornadasADevolver = 
        this.jornadasAgrupadasEnSemanasLaborales[claveSemanaLaboral].filter((jornada) => !jornada.esFestivo)
                                                                    .sort(
                                                                      (jornada1, jornada2) =>
                                                                        this.puntuarFaltaTrabajadoresEnJornadaPorTag(tag, jornada2) -
                                                                        this.puntuarFaltaTrabajadoresEnJornadaPorTag(tag, jornada1)
                                                                    );

      return jornadasADevolver
    },

    obtenerEmpleadosAsignablesJornadaYTag(
      empleadosNoReductoresNiConciliadores,
      jornadaDeMenorPuntuacionTag,
      tagEvaluado
    ) {
      return empleadosNoReductoresNiConciliadores
        .filter(
          (emp) =>
            emp.horasTrabajadasEstaSemana < emp.contrato.numeroHorasSemanales &&
            !this.estaEmpleadoPresenteEnJornada(
              emp,
              jornadaDeMenorPuntuacionTag
            ) &&
            emp.tag === tagEvaluado
        )
        .sort((empl1, empl2) => {
          return empl1.contrato.numeroHorasSemanales ===
            empl2.contrato.numeroHorasSemanales
            ? empl2.horasTrabajadasEstaSemana - empl1.horasTrabajadasEstaSemana
            : empl2.contrato.numeroHorasSemanales -
                empl1.contrato.numeroHorasSemanales;
        });
    },

    recomendarTurno(jornadaAEvaluar, tagAEvaluar) {
      let arrayTurnosJornadaPorTag;
      let turnoRecomendado = null;

      if (tagAEvaluar === 1) {
        arrayTurnosJornadaPorTag = jornadaAEvaluar.asignacionesPorHoraTag1;
      } else if (tagAEvaluar === 3) {
        arrayTurnosJornadaPorTag = jornadaAEvaluar.asignacionesPorHoraTag3;
      }

      // Si la primera hora esta vacia, recomendaremos directamente un turno de manhana
      if (arrayTurnosJornadaPorTag[0].length === 0) {
        turnoRecomendado = "manhana";

        // A continuacion, la ultima hora esta vacia, recomendaremos turno de tarde.
      } else if (arrayTurnosJornadaPorTag[10].length === 0) {
        turnoRecomendado = "tarde";

        // Si tanto la primera como la ultima horas estan cubiertas, recomendaremos al menos un turno partido al dia.
        // Lo cual, honestamente, es una verdadera ganhanada cara al estatuto de los trabajadores. Pero eh, viva la libertad, carajo.
      } else if (
        !funcionesAuxiliares.compartenElementoDosArray(
          arrayTurnosJornadaPorTag[0],
          arrayTurnosJornadaPorTag[10]
        )
      ) {
        turnoRecomendado = "partido";

        // Si los casos anteriores no se dan, entramos a evaluar cuantos empleados hay en una franja horaria. Recomendaremos manhana o tarde
        // para equilibrarlos.
      } else if (
        arrayTurnosJornadaPorTag[0].length > arrayTurnosJornadaPorTag[10].length
      ) {
        turnoRecomendado = "tarde";
      } else if (
        arrayTurnosJornadaPorTag[0].length < arrayTurnosJornadaPorTag[10].length
      ) {
        turnoRecomendado = "manhana";

        // En cualquier otro caso, asignaremos tardes.
      } else {
        turnoRecomendado = "tarde";
      }

      return turnoRecomendado;
    },

    estaEmpleadoPresenteEnJornada(empleadoEvaluado, jornadaEvaluada) {
      let retornoDeFuncion = false;

      if (empleadoEvaluado.tag === 1) {
        for (let empleadosPorHora of jornadaEvaluada.asignacionesPorHoraTag1) {
          if (
            empleadosPorHora.some(
              (empleado) => empleado.id === empleadoEvaluado.id
            )
          ) {
            retornoDeFuncion = true;
            break;
          }
        }
      } else if (empleadoEvaluado.tag === 3) {
        for (let empleadosPorHora of jornadaEvaluada.asignacionesPorHoraTag3) {
          if (
            empleadosPorHora.some(
              (empleado) => empleado.id === empleadoEvaluado.id
            )
          ) {
            retornoDeFuncion = true;
            break;
          }
        }
      }

      return retornoDeFuncion;
    },

    quedanEmpleadosConHorasPorAsignarEnSemana(
      empleadosNoReductoresNiConciliadores
    ) {
      return empleadosNoReductoresNiConciliadores.some(
        (e) => e.horasTrabajadasEstaSemana < e.contrato.numeroHorasSemanales
      );
    },

    agruparJornadasEnSemanas() {
      // Vamos a agrupar las jornadas por semana laboral.
      this.jornadasGuardadasEnPinia.forEach((jornada) => {
        const fecha = moment(jornada.fecha);
        const semana = fecha.isoWeek();
        const anho = fecha.isoWeekYear();
        const clave = `${anho}-S${String(semana).padStart(2, "0")}`;

        // Si no existe la clave en el array de jornadas agrupadas por semana laboral, se crea una nueva entrada.
        if (!this.jornadasAgrupadasEnSemanasLaborales[clave]) {
          this.jornadasAgrupadasEnSemanasLaborales[clave] = [];
        }

        // Añadimos la jornada a la semana correspondiente en el array de jornadas agrupadas por semana laboral.
        this.jornadasAgrupadasEnSemanasLaborales[clave].push(jornada);
      });
    }
  },
});
