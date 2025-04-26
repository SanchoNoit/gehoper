<script>
export default {
  emits: [],
  props: [],

  data() {
    return {
      fechaInicialGeneracionTurnos: new Date().toISOString().slice(0, 10),
      numeroSemanasAGenerar: 2,
    };
  },

  methods: {
    rellenarFormulario() {
      // this.$emit("formulario-actualizado", nuevoObjetoPartido);
      console.log("Estamos rellenando el calendario.")
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
      <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Generar turnos</button>
      <button type="button" class="btn btn-secondary ms-3" data-bs-dismiss="modal">
        Cerrar
      </button>
    </div>
  </form>
</template>
