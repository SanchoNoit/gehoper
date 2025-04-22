<script>
import { mapActions, mapState } from "pinia";
import { useJornadasStore } from "../stores/jornadas";
import moment from "moment";

export default {
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
  <div v-for="semana of this.jornadasAgrupadasEnSemanasLaborales" class="border">
    <div v-for="jornadas in semana">
      <p>{{ jornadas.fecha }}</p>
    </div>
  </div>

</template>
