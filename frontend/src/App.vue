<script>
import NavBar from "@/components/navegacion/navbar.vue";
import Footer from "@/components/navegacion/footer.vue";
import { useEmpleadosStore } from "@/stores/empleados";

export default {
  async mounted() {
    const empleadosStore = useEmpleadosStore();
    empleadosStore.cargarEmpleados();

  },

  components: { NavBar, Footer },
};
</script>

<template>
  <div class="d-flex flex-column">
    <NavBar />

    <main>
      <router-view />
    </main>

    <Footer></Footer>
  </div>
</template>
