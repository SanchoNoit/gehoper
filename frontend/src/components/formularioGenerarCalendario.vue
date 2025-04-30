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

      for (let dia = new Date(fechaInicio); dia < fechaFin; dia.setDate(dia.getDate() + 1)) {
        console.log(
          `Generando turnos para dia ${dia.toLocaleDateString("es-ES")}`
        );
        // Se comprueba si es un día laborable, se salta si no lo es.
          const esDiaLaborable = await validacionDiaComoJornadaLaboral.esDiaLaborable(new Date(dia));
          if (!esDiaLaborable) {
            // console.log(
            //   `El dia ${dia.toDateString()} se trata de dia festivo, y no se generan jornadas para este día.`
            // );
            continue;
          }

        // Se asignan los turnos fijos de los empleados reductores o conciliadores
        this.agregarTurnosFijos(dia)

        // Se comprueba que haya un TAG3 en todo momento. Se asignan TAG3 hasta que se valida la condicion.
        let turnosDeJornadaDeTag3 = this.empleados.filter(e => e.tag === 3).flatMap(e => e.turnos)
                                                                           .filter(t => moment(t.fecha).isSame(new Date(dia), 'days'))

        while(!evaluacionTurnos.hay_Un_EmpleadoEnTodoMomento(turnosDeJornadaDeTag3)) {
          // ¿Qué códigos de turno cubren la necesidad actual?
          const arrayCodigosPropuestos = evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnosDeJornadaDeTag3)

          // ¿Qué empleados pueden cubrir los turnos indicados?
          let empleadosQuePuedenRealizarTurnosPropuestos = 
            evaluacionEmpleados.empleadosDisponibles(this.empleados, new Date(dia), arrayCodigosPropuestos).filter(e => e.tag === 3)

          // De estos empleados, ¿cual es el más idóneo?
          let empleadoPropuesto = evaluacionEmpleados.proponerEmpleadoEnBaseAPuntuacion(empleadosQuePuedenRealizarTurnosPropuestos)

          // De los turnos propuestos, seleccionaremos el mínimo posible para el empleado propuesto.
          let codigoPropuesto = evaluacionEmpleados.definirCodigoTurnoParaEmpleado(empleadoPropuesto, arrayCodigosPropuestos)

          // Agregamos el turno propuesto al empleado
          this.agregarTurnoAEmpleado(new Date(dia), codigoPropuesto, empleadoPropuesto)

          turnosDeJornadaDeTag3 = this.empleados.filter(e => e.tag === 3).flatMap(e => e.turnos)
                                                .filter(t => moment(t.fecha).isSame(new Date(dia), 'days')) 

        }

        // Asignamos turnos hasta completar que una jornada está cubierta
        let turnosDeJornada = this.empleados.flatMap(e => e.turnos)
                                            .filter(t => moment(t.fecha).isSame(new Date(dia), 'days'))

        while(!evaluacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnosDeJornada)) {
          // ¿Qué códigos de turno cubren la necesidad actual?
          const arrayCodigosPropuestos = evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaCubrirDosEmpleados(turnosDeJornada)

          // ¿Qué empleados pueden cubrir los turnos indicados?
          let empleadosQuePuedenRealizarTurnosPropuestos = 
            evaluacionEmpleados.empleadosDisponibles(this.empleados, new Date(dia), arrayCodigosPropuestos)

          // De estos empleados, ¿cual es el más idóneo?
          let empleadoPropuesto = evaluacionEmpleados.proponerEmpleadoEnBaseAPuntuacion(empleadosQuePuedenRealizarTurnosPropuestos)

          // De los turnos propuestos, seleccionaremos el mínimo posible para el empleado propuesto.
          let codigoPropuesto = evaluacionEmpleados.definirCodigoTurnoParaEmpleado(empleadoPropuesto, arrayCodigosPropuestos)

          debugger
          // Agregamos el turno propuesto al empleado
          this.agregarTurnoAEmpleado(new Date(dia), codigoPropuesto, empleadoPropuesto)

          turnosDeJornada = this.empleados.flatMap(e => e.turnos)
                                          .filter(t => moment(t.fecha).isSame(new Date(dia), 'days')) 

        }

        // Se comprueba que hay dos empleados en todo momento. Se asignan empleados hasta que se valida la condición.

        this.empleados.flatMap(e => e.turnos).forEach(turno => {
          if(moment(turno.fecha).isSame(new Date(dia), 'days')) {
            console.log(`Turno asignado a ${turno.empleado.nombreCompleto}, TAG ${turno.empleado.tag} en formato ${turno.codigoTurno}, ha trabajado ${evaluacionEmpleados.calcularHorasTrabajadasEnLaUltimaSemana(turno.empleado, turno.fecha)} horas en la ultima semana, de un contrato de ${turno.empleado.contrato.numeroHorasSemanales}`)
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
