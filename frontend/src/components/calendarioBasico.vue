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
        initialView: "dayGridTwoWeek",
        views: {
          dayGridTwoWeek: {
            type: "dayGrid",
            duration: { weeks: 2 },
          },
        },
        dateClick: this.handleDateClick,
        events: [],
      },

      dateOptions: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },

      colors: [
      "blue",
      "darkblue",
      "orange",
      "darkred",
      "darkgreen",
      "purple",
      "olive",
      "grey",
      "tan",
    ]
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

    refrescarCalendario() {
      const turnosDeCadaEmpleado = this.empleados.map(e => ({
        turnos: e.turnos.map(t => ({
          fecha: t.fecha,
          codigoTurno: t.codigoTurno,
          empleadoID: e.id,
          empleadoIniciales: e.nombreCompleto.split(' ').map(palabra => palabra[0].toUpperCase()).join('')
        }))
      }))

      this.calendarOptions.events = turnosDeCadaEmpleado.flatMap(t => t.turnos).map(t => (
      {
      title: `ID:${t.empleadoID} - ${ t.empleadoIniciales } - ${t.codigoTurno}`,
      date: new Date(t.fecha),
      display: 'block',
      backgroundColor: this.colors[t.empleadoID],
      allDay: true
      }))
    }
  },
};
</script>

<template>
  <div class="container-flex text-center m-3 p-2">
    <button class="btn btn-primary" @click="generarTurnos">Generar turnos</button>
  </div>
  <div class="container">
    <FullCalendar :options="calendarOptions" />
  </div>

  <!-- Modal de informacion de un dia particular-->
  <div
    class="modal fade"
    id="modalInformacionJornada"
    tabindex="-1"
    aria-labelledby="modalInformacionJornadaLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalInformacionJornadaLabel">
            Aquí va el título del modal
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h1>Aquí va el BODY de los días particulares</h1>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de autogeneracion del calenario-->
  <div
    class="modal fade"
    id="modalAutogeneracionTurnos"
    tabindex="-1"
    aria-labelledby="modalInformacionJornadaLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalInformacionJornadaLabel">
            Generar turnos
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <FormularioGenerarCalendario @formulario-actualizado="refrescarCalendario"></FormularioGenerarCalendario>
        </div>
      </div>
    </div>
  </div>
</template>
