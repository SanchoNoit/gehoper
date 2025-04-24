<script>
import NavBar from "@/components/navegacion/navbar.vue";
import Footer from "@/components/navegacion/footer.vue";
import { useEmpleadosStore } from "@/stores/empleados";

export default {
  async mounted() {
    const empleadosStore = useEmpleadosStore();

    empleadosStore.cargarEmpleados();

    // TODO: Asegurar que se guarda la lista de empleados en el store cada vez que se modifica.
  },

  components: { NavBar, Footer },
};
</script>

<template>
  <NavBar></NavBar>

  <router-view></router-view>

  <Footer></Footer>
</template>
