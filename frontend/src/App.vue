<script>
import NavBar from "@/components/navegacion/navbar.vue";
import Footer from "@/components/navegacion/footer.vue";
import { useEmpleadosStore } from "@/stores/empleados";
import { useAsignacionesStore } from "@/stores/asignaciones";

export default {
  mounted() {
    const empleadosStore = useEmpleadosStore();
    empleadosStore.cargarEmpleadosDesdeAPI();

    const asignacionesStore = useAsignacionesStore();
    asignacionesStore.cargarAsignacionesDesdeAPI();
  },

  components: { NavBar, Footer },
};
</script>

<template>
    <NavBar />

    <main class="flex-grow: 1">
      <router-view />
    </main>

    <Footer></Footer>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
}
</style>
