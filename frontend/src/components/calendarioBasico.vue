<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import * as bootstrap from "bootstrap";
import FormularioGenerarCalendario from "@/components/formularioGenerarCalendario.vue";
import { useEmpleadosStore } from '@/stores/empleados'
import { mapActions, mapState } from "pinia";
import evaluacionTurnos from "@/assets/scripts/evaluacionTurnos";
import moment from "moment";

export default {
  mounted() {
    this.refrescarCalendario();
  },

  components: {
    FullCalendar, FormularioGenerarCalendario
  },
  data: function () {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayTwoWeeksGrid",
        contentHeight: 600,
        views: {
          dayTwoWeeksGrid: {
            type: "dayGrid",
            duration: { weeks: 2 },
          },

          dayMonthGrid: {
            type: "dayGrid",
            duration: { months: 1 },
          },
        },

        buttonText: {
          dayTwoWeeksGrid: 'Bi - Semanal',
          dayMonthGrid: 'Mensual',
        },
        dateClick: this.handleDateClick,
        events: [],
        headerToolbar: {
          start: 'dayTwoWeeksGrid,dayMonthGrid',
          center: 'title',
          end: 'prev,next'
        }
      },

      dateOptions: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },

      colors: [
      "darkblue",
      "darkred",
      ],

      fechaSeleccionada: "",
      turnosAsignadosDelDia: []
    };
  },

  computed: {
    ...mapState(useEmpleadosStore, ['empleados']),
  },

  methods: {
    handleDateClick: function (arg) {
      let options = {
        keyboard: true,
      };
      this.fechaSeleccionada = (new Date(arg.dateStr)).toLocaleDateString('es-ES')
      this.turnosAsignadosDelDia = this.empleados.flatMap(e => e.turnos).filter(t => moment(t.fecha).isSame(new Date(arg.dateStr), 'days'))

      const myModal = new bootstrap.Modal(
        "#modalInformacionJornada",
        options
      );

      myModal.show();
    },

    generarTurnos() {
      let options = {
        keyboard: true,
      };

      const myModal = new bootstrap.Modal(
        "#modalAutogeneracionTurnos",
        options
      );

      myModal.show();
    },

    abrirModalLeyenda() {
      let options = {
        keyboard: true,
      };

      const myModal = new bootstrap.Modal(
        "#modalLeyenda",
        options
      );

      myModal.show();
    },

    refrescarCalendario() {

      const turnosDeCadaEmpleado = this.empleados.map(e => ({
        turnos: e.turnos.map(t => ({
          fecha: t.fecha,
          codigoTurno: t.codigoTurno,
          empleadoID: e.id,
          empleadoTAG: e.tag,
          empleadoIniciales: e.nombreCompleto.split(' ').map(palabra => palabra[0].toUpperCase()).join('')
        }))
      }))

      this.calendarOptions.events = turnosDeCadaEmpleado.flatMap(t => t.turnos).map(t => (
      {
      title: `${ t.empleadoIniciales } - ${t.codigoTurno}`,
      date: new Date(t.fecha),
      display: 'block',
      backgroundColor: t.empleadoTAG === 1 ? this.colors[0] : this.colors[1],
      allDay: true
      }))
    },

    devolverHorario(codigoTurno) {
      let stringDeHorarioADevolver = "";

      if (codigoTurno === "P8") {
        stringDeHorarioADevolver = "(10:00-14:00 y 17:00-21:00)"
      } else if (codigoTurno[0] === "M") {
        stringDeHorarioADevolver = "(10:00-1" + codigoTurno[1] + ":00)"
      } else if (codigoTurno[0] === "T") {
        stringDeHorarioADevolver = "(" + (21 - parseInt(codigoTurno[1])) + ":00-21:00)"
      }

      return stringDeHorarioADevolver;
    }
  },
};
</script>

<template>
  <div class="container-flex text-center m-2 p-1">
    <div class="row">
      <div class="col-4">
        <button class="btn btn-moderno btn-lg mt-4" @click="generarTurnos">
          <div class="container">
            <div class="row">
              <div class="col">
                <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" size="l" />
                Generar turnos &nbsp;&nbsp;
              </div>

            </div>
          </div>
        </button>
      </div>
      <div class="col-4">
        <button class="btn btn-moderno btn-lg mt-4" @click="abrirModalLeyenda">
          <div class="container">
            <div class="row">
              <div class="col">
                <font-awesome-icon :icon="['fas', 'circle-question']" size="xl" />
                Mostrar Leyenda &nbsp;&nbsp;
              </div>
            </div>
          </div>
        </button>
      </div>
      <div class="col-4">
        <h4><u>Avisos</u></h4>
      </div>
    </div>

  </div>
  <div class="container-flex border">
    <div class="container shadow-lg p-3 mb-5 bg-body-tertiary rounded">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>


  <!-- Modal de informacion de un dia particular-->
  <div class="modal fade" id="modalInformacionJornada" tabindex="-1" aria-labelledby="modalInformacionJornadaLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalInformacionJornadaLabel">
            {{ this.fechaSeleccionada }}
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p v-for="turno of this.turnosAsignadosDelDia" v-if="this.turnosAsignadosDelDia">
            {{ `ID:${ turno.empleado.id } - ${ turno.empleado.nombreCompleto } - ${
            this.devolverHorario(turno.codigoTurno) }` }}
          </p>
          <h2 v-if="this.turnosAsignadosDelDia.length === 0">
            Lo siento, no hay turnos asignados a este día 🤔
          </h2>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de autogeneracion del calenario-->
  <div class="modal fade" id="modalAutogeneracionTurnos" tabindex="-1" aria-labelledby="modalInformacionJornadaLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalInformacionJornadaLabel">
            Generar turnos
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
        </div>
        <div class="modal-body">
          <FormularioGenerarCalendario @formulario-actualizado="refrescarCalendario"></FormularioGenerarCalendario>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de informacion de un dia particular-->
  <div class="modal fade" id="modalLeyenda" tabindex="-1" aria-labelledby="modalInformacionJornadaLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalInformacionJornadaLabel">
            Leyenda
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5>Turno de tag 3 <span class="badge text-bg-danger">&nbsp;</span></h5>
          <h5>Turno de tag 1 <span class="badge text-bg-primary">&nbsp;</span></h5>
          <hr class="section-title-hr">
          <p>P: Partido</p>
          <p>M: Mañana</p>
          <p>T: Tarde</p>
          &nbsp;
          <p>El número a continuación del código de turno</p>
          <p>indica el número de horas del turno.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-moderno {
  background: rgba(3, 48, 5, 0.829);
  border: none;
  backdrop-filter: blur(6px);
  color: #b3e0c7;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-moderno:hover {
  background: rgba(15, 105, 37, 0.4);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(0, 123, 255, 0.5);
}

.btn-moderno:active {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.6);
}
</style>
