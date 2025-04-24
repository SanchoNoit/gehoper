<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import * as bootstrap from "bootstrap";
import { mapActions, mapState } from "pinia";
import moment from "moment";

export default {
  mounted() {
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
        events: [],
      },

      dateOptions: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    };
  },

  computed: {},

  methods: {
    handleDateClick: function (arg) {
      let options = {
        keyboard: true,
      };

      const myModalAlternative = new bootstrap.Modal(
        "#modalInformacionJornada",
        options
      );
      const myModalEl = document.getElementById("modalInformacionJornada");

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
          <h2>Aquí va el BODY</h2>
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
