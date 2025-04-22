<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import funcionesAuxiliares from "@/assets/scripts/funcionesAuxiliares";
import * as bootstrap from "bootstrap";
import { mapActions, mapState } from "pinia";
import { useJornadasStore } from "@/stores/jornadas";
import { useEmpleadosStore } from "@/stores/empleados";
import moment from "moment";
import { onMounted } from "vue";

export default {
  mounted() {
    this.calendarOptions.events = this.arrayDeTurnos
  },

  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data: function () {

    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridTwoWeek',
        views: {
          dayGridTwoWeek: {
          type: 'dayGrid',
          duration: { weeks: 2 }
          }
        },
        dateClick: this.handleDateClick,
        events: [], // Si quiero agregar eventos que aparecieran en el calendario, lo haria aqui
      },

      fechaDelDiaSeleccionado: "",
      arrayStringHorariosTag1: [],
      arrayStringHorariosTag3: [],
      dateOptions: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    };
  },

  computed: {
    ...mapState(useJornadasStore, [
      "jornadasGuardadasEnPinia",
      "jornadasAgrupadasEnSemanasLaborales",
      "arrayDeTurnos"
    ]),
    ...mapState(useEmpleadosStore, ["empleados"]),
  },

  methods: {
    ...mapActions(useJornadasStore, ["estaEmpleadoPresenteEnJornada"]),

    handleDateClick: function (arg) {
      let options = {
        keyboard: true,
      };

      const myModalAlternative = new bootstrap.Modal(
        "#modalInformacionJornada",
        options
      );
      const myModalEl = document.getElementById("modalInformacionJornada");

      // La fecha definida por la casilla en la que hacemos click es:
      this.fechaDelDiaSeleccionado = new Date(arg.dateStr);
      let jornadaElegida = this.jornadasGuardadasEnPinia.find(
        (jornada) =>
          moment(new Date(jornada.fecha)).dayOfYear() ===
          moment(this.fechaDelDiaSeleccionado).dayOfYear()
      );

      this.arrayStringHorariosTag1 = this.empleados
        .filter((emp) => emp.tag === 1)
        .filter((emp) =>
          funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(
            emp,
            jornadaElegida
          )
        )
        .map(
          (emp) =>
            `${
              emp.nombreCompleto
            } - (${funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(
              emp,
              jornadaElegida
            )})`
        );

      this.arrayStringHorariosTag3 = this.empleados
        .filter((emp) => emp.tag === 3)
        .filter((emp) =>
          funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(
            emp,
            jornadaElegida
          )
        )
        .map(
          (emp) =>
            `${
              emp.nombreCompleto
            } - (${funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(
              emp,
              jornadaElegida
            )})`
        );

      myModalAlternative.show();
    },
  },
};
</script>

<template>
  <div class="container">
    <FullCalendar :options="calendarOptions" />
  </div>

  <!-- Modal -->
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
            {{ fechaDelDiaSeleccionado.toLocaleString("es-ES", dateOptions) }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h2>Turnos del día</h2>
          <div>
            <h5>TAG 1</h5>
            <p v-for="stringEmpleadoYHorario in arrayStringHorariosTag1">
              {{ stringEmpleadoYHorario }}
            </p>
            <h5>TAG 3</h5>
            <p
              class=""
              v-for="stringEmpleadoYHorario in arrayStringHorariosTag3"
            >
              {{ stringEmpleadoYHorario }}
            </p>
          </div>
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
</template>
