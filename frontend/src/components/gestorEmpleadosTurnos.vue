<script>
import { mapState } from "pinia";
import { useEmpleadosStore } from "@/stores/empleados";
import moment from "moment";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapState(useEmpleadosStore, ["empleados"]),
  },
};
</script>

<template>
  <h1 class="text-center p-4"><u>Empleados</u></h1>
  <div class="container border p-2 m-2" v-for="empleado in this.empleados">
    <div class="row">
      <div class="col">
        <h3>{{ empleado.nombreCompleto }}</h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h5>
          <span v-if="empleado.tag === 3" class="badge text-bg-danger">TAG: {{ empleado.tag }}</span>
          <span v-else-if="empleado.tag === 1" class="badge text-bg-primary">TAG: {{ empleado.tag }}</span>
        </h5>
      </div>
      <div class="col">
        <p>ID: {{ empleado.id }}</p>
      </div>
      <div class="col">
        <p>Contrato de {{ empleado.contrato.numeroHorasSemanales }} horas</p>
      </div>
      <div class="col">
        <p>Reductor: {{ empleado.contrato.esReductor ? "✅ Sí" : "No" }}</p>
      </div>
      <div class="col">
        <p>Conciliador: {{ empleado.contrato.esConciliador ? "✅ Sí" : "No" }}</p>
      </div>
    </div>
  </div>

</template>
