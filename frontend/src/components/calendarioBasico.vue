<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import * as bootstrap from "bootstrap";
import FormularioGenerarCalendario from "@/components/formularioGenerarCalendario.vue";
import { useEmpleadosStore } from "@/stores/empleados";
import { mapState } from "pinia";
import evaluacionTurnos from "@/assets/scripts/evaluacionTurnos";
import moment from "moment";

export default {
  mounted() {
    this.refrescarCalendario();
  },

  components: {
    FullCalendar,
    FormularioGenerarCalendario,
  },

  data: function () {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayTwoWeeksGrid",
        contentHeight: 600,
        locale: "es",
        firstDay: 1,
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
          dayTwoWeeksGrid: "Bi - Semanal",
          dayMonthGrid: "Mensual",
        },
        dateClick: this.handleDateClick,
        events: [],
        headerToolbar: {
          start: "dayTwoWeeksGrid,dayMonthGrid",
          center: "title",
          end: "prev,next",
        },
        datesSet: this.handleDatesSet,
      },

      dateOptions: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },

      colors: ["darkblue", "darkred"],
      fechaSeleccionada: "",
      turnosAsignadosDelDia: [],
      fechaInicialMostrada: "",
      fechaFinalMostrada: "",
      semanasDelAnhoMostradas: new Set(),
      diasMostrados: new Set()
    };
  },

  computed: {
    ...mapState(useEmpleadosStore, ["empleados"]),
  },

  methods: {
    handleDateClick: function (arg) {
      let options = {
        keyboard: true,
      };
      this.fechaSeleccionada = new Date(arg.dateStr).toLocaleDateString(
        "es-ES"
      );
      this.turnosAsignadosDelDia = this.empleados
        .flatMap((e) => e.turnos)
        .filter((t) => moment(t.fecha).isSame(new Date(arg.dateStr), "days"));

      const myModal = new bootstrap.Modal("#modalInformacionJornada", options);

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

      const myModal = new bootstrap.Modal("#modalLeyenda", options);

      myModal.show();
    },

    abrirOffcanvasHorariosEmpleado() {
      let options = {
        keyboard: true,
      };

      this.fechaInicialMostrada = moment(
        new Date(this.$refs.fullCalendar.getApi().view.activeStart)
      );
      this.fechaFinalMostrada = moment(
        this.$refs.fullCalendar.getApi().view.activeEnd
      );

      this.semanasDelAnhoMostradas.clear()

      for (
        let dia = moment(this.fechaInicialMostrada);
        dia.isBefore(this.fechaFinalMostrada);
        dia.add(1, "days")
      ) {
        if (dia.day() === 1) {
          this.semanasDelAnhoMostradas.add(moment(dia));
        }
      }

      const myOffcanvas = new bootstrap.Offcanvas(
        "#offcanvasInformacionHorarios",
        options
      );

      myOffcanvas.show();
    },

    abrirOffcanvasValidacionJornadas() {
      let options = {
        keyboard: true,
      };

      this.fechaInicialMostrada = moment(
        new Date(this.$refs.fullCalendar.getApi().view.activeStart)
      );
      this.fechaFinalMostrada = moment(
        this.$refs.fullCalendar.getApi().view.activeEnd
      );

      this.diasMostrados.clear()

      for (
        let dia = moment(this.fechaInicialMostrada);
        dia.isBefore(this.fechaFinalMostrada);
        dia.add(1, "days")
      ) {
        if (dia.day() === 1) {
          this.semanasDelAnhoMostradas.add(moment(dia));
        }

        if (dia.day() !== 0) {
          this.diasMostrados.add(moment(dia))
        }
        
      }

      const myOffcanvas = new bootstrap.Offcanvas(
        "#offcanvasValidacionJornadas",
        options
      );

      myOffcanvas.show();
    },

    refrescarCalendario() {
      const turnosDeCadaEmpleado = this.empleados.map((e) => ({
        turnos: e.turnos.map((t) => ({
          fecha: t.fecha,
          codigoTurno: t.codigoTurno,
          empleadoID: e.id,
          empleadoTAG: e.tag,
          empleadoIniciales: e.nombreCompleto
            .split(" ")
            .map((palabra) => palabra[0].toUpperCase())
            .join(""),
        })),
      }));

      this.calendarOptions.events = turnosDeCadaEmpleado
        .flatMap((t) => t.turnos)
        .map((t) => ({
          title: `${t.empleadoIniciales} - ${t.codigoTurno}`,
          date: new Date(t.fecha),
          display: "block",
          backgroundColor:
            t.empleadoTAG === 1 ? this.colors[0] : this.colors[1],
          allDay: true,
        }));
    },

    mostrarToastTurnosGenerados() {
      const toastLiveExample = document.getElementById('toastTurnosGenerados')
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
      toastBootstrap.show()
    },

    devolverHorario(codigoTurno) {
      let stringDeHorarioADevolver = "";

      if (codigoTurno === "P8") {
        stringDeHorarioADevolver = "(10:00-14:00 y 17:00-21:00)";
      } else if (codigoTurno[0] === "M") {
        stringDeHorarioADevolver = "(10:00-1" + codigoTurno[1] + ":00)";
      } else if (codigoTurno[0] === "T") {
        stringDeHorarioADevolver =
          "(" + (21 - parseInt(codigoTurno[1])) + ":00-21:00)";
      }

      return stringDeHorarioADevolver;
    },

    numeroHorasTrabajadasPorEmpleadoEnSemana(empleado, fechaDelLunes) {
      let numeroHorasTrabajadas = 0;
      let lunesDeSemana = moment(fechaDelLunes);

      for (let i = 0; i < 7; i++) {
      let jornadaEstudiada = moment(lunesDeSemana).add(i, "days");

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

    validarJornada(dia) {
      const arrayDeTurnosDeJornada = this.empleados.flatMap(e => e.turnos).filter(t => moment(t.fecha).isSame(dia, 'days'))
      const codigoValidacion = evaluacionTurnos.esJornadaValida(arrayDeTurnosDeJornada)
      let stringADevolver;

      if(codigoValidacion === 0) {
        stringADevolver = "✅"
      } else if (codigoValidacion === -1) {
        stringADevolver = "⚠️ : Faltan tag 3."
      } else if (codigoValidacion === -2) {
        stringADevolver = "⚠️ : No se completa la exigencia de 2 empleados."
      } else {
        stringADevolver = "ERROR"
      }

      return stringADevolver;
    }
  },


};
</script>

<template>
  <div class="d-flex justify-content-center m-4 p-3">
    <div class="d-flex align-items-center">
      <button class="btn btn-moderno btn-lg me-2" @click="generarTurnos">
        <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
        Generar turnos &nbsp;&nbsp;
      </button>
      <button
        class="btn btn-moderno btn-lg ms-2 me-2"
        @click="abrirModalLeyenda"
      >
        <font-awesome-icon :icon="['fas', 'circle-question']" />
        Mostrar Leyenda &nbsp;&nbsp;
      </button>
      <button
        class="btn btn-moderno btn-lg ms-2 me-2"
        @click="abrirOffcanvasHorariosEmpleado"
      >
        <font-awesome-icon :icon="['fas', 'clock']" />
        Horas de empleados
      </button>
      <button
        class="btn btn-moderno btn-lg ms-2"
        @click="abrirOffcanvasValidacionJornadas"
      >
        <font-awesome-icon :icon="['fas', 'check']" />
        Validación de jornadas
      </button>
    </div>
  </div>
  <div class="container-flex border">
    <div class="container shadow-lg p-3 mb-5 bg-body-tertiary rounded">
      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    </div>
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
            {{ this.fechaSeleccionada }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p
            v-for="turno of this.turnosAsignadosDelDia"
            v-if="this.turnosAsignadosDelDia"
          >
            {{
              `ID:${turno.empleado.id} - ${
                turno.empleado.nombreCompleto
              } - ${this.devolverHorario(turno.codigoTurno)}`
            }}
          </p>
          <h2 v-if="this.turnosAsignadosDelDia.length === 0">
            Lo siento, no hay turnos asignados a este día 🤔
          </h2>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cerrar
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
            aria-label="close"
          ></button>
        </div>
        <div class="modal-body">
          <FormularioGenerarCalendario
            @formulario-actualizado="refrescarCalendario"
            @informar-turnos-generados="mostrarToastTurnosGenerados"
          ></FormularioGenerarCalendario>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de informacion de un dia particular-->
  <div
    class="modal fade"
    id="modalLeyenda"
    tabindex="-1"
    aria-labelledby="modalInformacionJornadaLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalInformacionJornadaLabel">
            Leyenda
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>
            Turno de tag 3 <span class="badge text-bg-danger">&nbsp;</span>
          </h5>
          <h5>
            Turno de tag 1 <span class="badge text-bg-primary">&nbsp;</span>
          </h5>
          <hr class="section-title-hr" />
          <p>P: Partido</p>
          <p>M: Mañana</p>
          <p>T: Tarde</p>
          &nbsp;
          <p>El número a continuación del código de turno</p>
          <p>indica el número de horas del turno.</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Offcanvas de información de horarios de empleados -->
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasInformacionHorarios"
    aria-labelledby="offcanvasInformacionHorariosLabel"
  >
    <div class="offcanvas-header">
      <h3 class="offcanvas-title" id="offcanvasInformacionHorariosLabel">
        <u> Horas cumplimentadas por empleados </u>
      </h3>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <div v-for="lunesDeSemanaMostrada in this.semanasDelAnhoMostradas">
        <h4>
          <u>Semana {{ lunesDeSemanaMostrada.format("DD MMM") }}</u>
        </h4>
        <p v-for="empleado in this.empleados">
          {{ empleado.nombreCompleto }} -
          {{
            this.numeroHorasTrabajadasPorEmpleadoEnSemana(
              empleado,
              lunesDeSemanaMostrada
            )
          }} de {{ empleado.contrato.numeroHorasSemanales }}
        </p>
      </div>
    </div>
  </div>

  <!-- Offcanvas de información de validación de jornadas -->
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasValidacionJornadas"
    aria-labelledby="offcanvasValidacionJornadasLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasValidacionJornadasLabel">
        Estado de las jornadas:
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <p v-for="dia in this.diasMostrados">{{ dia.format("DD MMM") }}: {{ this.validarJornada(dia) }}</p>
    </div>
  </div>

  <!-- Toast de generación de turnos -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="toastTurnosGenerados" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">✅ Turnos creados y cargados</strong>
        <small>11 mins ago</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        Los turnos seleccionados se cargaron correctamente
      </div>
    </div>
  </div>

</template>

<style scoped>
.btn-moderno {
  background: rgba(15, 105, 37, 0.4);
  border: none;
  backdrop-filter: blur(6px);
  color: #202924;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-moderno:hover {
  background: rgba(3, 48, 5, 0.829); 
  color: white;
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(0, 123, 255, 0.5);
}

.btn-moderno:active {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.6);
}
</style>
