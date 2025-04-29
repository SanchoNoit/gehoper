<script>
import { mapState, mapActions } from "pinia";
import { useEmpleadosStore } from "@/stores/empleados";
import moment from "moment";
import validacionDiaComoJornadaLaboral from "@/assets/scripts/validacionDiaComoJornadaLaboral";
import evaluacionTurnos from "@/assets/scripts/evaluacionTurnos";
import evaluacionEmpleados from "@/assets/scripts/evaluacionEmpleados";

export default {
  emits: [],
  props: [],

  data() {
    return {
      fechaInicialGeneracionTurnos: new Date().toISOString().slice(0, 10),
      numeroSemanasAGenerar: 2,
    };
  },

  computed: {
    ...mapState(useEmpleadosStore, ["empleados"]),
  },

  methods: {
    ...mapActions(useEmpleadosStore, ['agregarTurnoAEmpleado', 'agregarTurnosFijos']),

    async rellenarFormulario() {
      const fechaInicio = new Date(this.fechaInicialGeneracionTurnos);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + this.numeroSemanasAGenerar * 7);

      for (
        let dia = new Date(fechaInicio);
        dia < fechaFin;
        dia.setDate(dia.getDate() + 1)
      ) {
        console.log(
          `Generando turnos para dia ${dia.toLocaleDateString("es-ES")}`
        );
        const esDiaLaborable =
          await validacionDiaComoJornadaLaboral.esDiaLaborable(new Date(dia));

        // Se comprueba si es un día laborable
        if (!esDiaLaborable) {
          // console.log(
          //   `El dia ${dia.toDateString()} se trata de dia festivo, y no se generan jornadas para este día.`
          // );
          continue;
        }

        // Se asignan los turnos fijos
        this.agregarTurnosFijos(dia)

        // Se comprueba que haya un TAG3 en todo momento. Se asignan TAG3 hasta que se valida la condicion.
        const empleadosTag3 = this.empleados.filter((emp) => emp.tag === 3)
        let arrayDeTurnosJornadaDeTag3 =  empleadosTag3.flatMap((empleado) => empleado.turnos)
                                                       .filter(t => moment(t.fecha).isSame(new Date(dia), 'days'))

        while (!evaluacionTurnos.hay_Un_EmpleadoEnTodoMomento(arrayDeTurnosJornadaDeTag3)) {
          let arrayCodigosPropuestos = evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(arrayDeTurnosJornadaDeTag3)
          let turnoOptimo = evaluacionEmpleados.devolverTurnoOptimo(new Date(dia), arrayCodigosPropuestos, empleadosTag3)
          if (typeof(turnoOptimo) !== null) {
            this.agregarTurnoAEmpleado(turnoOptimo);
          } else {
            console.log('No se genera el turno optimo')
            debugger;
          }          
          
          arrayDeTurnosJornadaDeTag3 =  empleadosTag3.flatMap((empleado) => empleado.turnos)
                                                         .filter(t => moment(t.fecha).isSame(dia, 'days'))
        }

        // Si es viernes o sábado, se asignan todos los empleados posibles
        // if ((new Date(dia)).getDay() === 5 || (new Date(dia)).getDay() === 6) {
        //   for (let emp of this.empleados) {
        //     if(!emp.contrato.esReductor && !emp.contrato.esConciliador && !evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(emp, new Date(dia))) {
        //       let arrayCodigosPropuestos = 
        //         evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(arrayDeTurnosJornadaDeTag3).length > 0 
        //         ? evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(arrayDeTurnosJornadaDeTag3)
        //         : ["M8", "M6", "M5", "M4", "T8", "T6", "T5", "T4"];
        //       let turnoOptimo = evaluacionEmpleados.devolverTurnoOptimo(new Date(dia), arrayCodigosPropuestos, [emp])

        //       if (typeof(turnoOptimo) !== null) {
        //         this.agregarTurnoAEmpleado(turnoOptimo);
        //       } else {
        //         console.log('No se genera el turno optimo')
        //        break;
        //       }    
        //     }
        //   }
        // }

        // Se comprueba que hay dos empleados en todo momento. Se asignan empleados hasta que se valida la condición.
        let arrayDeTurnosDeLaJornada =  this.empleados.flatMap((empleado) => empleado.turnos)
                                           .filter(t => moment(t.fecha).isSame(new Date(dia), 'days'))

        while (!evaluacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(arrayDeTurnosDeLaJornada)) {
          let arrayCodigosPropuestos = evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(arrayDeTurnosDeLaJornada)

          debugger
          let turnoOptimo = evaluacionEmpleados.devolverTurnoOptimo(new Date(dia), arrayCodigosPropuestos, this.empleados)
          if (typeof(turnoOptimo) !== null) {
            this.agregarTurnoAEmpleado(turnoOptimo);
          } else {
            console.log('No se genera el turno optimo')
            debugger;
          }          
          
          arrayDeTurnosDeLaJornada =  this.empleados.flatMap((empleado) => empleado.turnos)
                                                    .filter(t => moment(t.fecha).isSame(new Date(dia), 'days'))
        }

        this.empleados.flatMap(e => e.turnos).forEach(turno => {
          if(moment(turno.fecha).isSame(new Date(dia), 'days')) {
            console.log(`Turno asignado a ${turno.empleado.nombreCompleto} en formato ${turno.codigoTurno}`)
          }
        });
        console.log(`¿La jornada es válida? ${evaluacionTurnos.esJornadaValida(this.empleados.flatMap(e => e.turnos).filter(t => moment(t.fecha).isSame(new Date(dia), 'days')))}`)
      }
    },
  },
};
</script>

<template>
  <form @submit.prevent="rellenarFormulario">
    <div class="row mb-3">
      <div class="col">
        <label for="fechaInicialGeneracionTurnos" class="form-label"
          >¿A partir de qué día quiere generar nuevos turnos?</label
        >
        <input
          type="date"
          class="form-control"
          id="fechaInicialGeneracionTurnos"
          aria-describedby="Fecha en la que iniciamos la generacion de turnos"
          v-model="fechaInicialGeneracionTurnos"
          :min="fechaInicialGeneracionTurnos"
        />
      </div>

      <div class="col">
        <label for="numeroSemanasAGenerar" class="form-label">
          ¿Cuántas semanas deberíamos generar?
        </label>
        <select
          class="form-select"
          id="numeroSemanasAGenerar"
          v-model="numeroSemanasAGenerar"
          aria-describedby="Cantidad de semanas a generar"
        >
          <option v-for="n in 6" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <div class="mb-3 form-check">
      <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">
        Generar turnos
      </button>
      <button
        type="button"
        class="btn btn-secondary ms-3"
        data-bs-dismiss="modal"
      >
        Cerrar
      </button>
    </div>
  </form>
</template>
