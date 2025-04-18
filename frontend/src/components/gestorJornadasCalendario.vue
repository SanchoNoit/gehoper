<script>
import { mapActions, mapState } from "pinia";
import { useJornadasStore } from "../stores/jornadas";
import moment from "moment";

export default {
  async mounted() {
    const jornadasStore = useJornadasStore();

    await jornadasStore.inicializarJornadas();
    await jornadasStore.rellenarCalendario();
  },

  data() {
    return {
      nombresDeDiasArray: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
      ],
    };
  },

  ...mapActions(useJornadasStore, ["inicializarJornadas"]),

  computed: {
    ...mapState(useJornadasStore, ["jornadasAgrupadasEnSemanasLaborales"]),
  },
};
</script>

<template>
  <h1 class="text-center">Gestión de turnos y empleados</h1>
  <div class="container-fluid border text-center p-2">
    <h3>Barra de estado de avisos de semanas del año</h3>
  </div>
  <!-- <div v-for="semana in this.jornadasAgrupadasEnSemanasLaborales" :key="index">
    <p>Semana {{ semana }}</p>
    </div> -->

    <div>
      <p> {{ jornadasAgrupadasEnSemanasLaborales }} </p>
    </div>
</template>
