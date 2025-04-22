<script>
import NavBar from "@/components/navegacion/navbar.vue";
import Footer from "@/components/navegacion/footer.vue";
import { useJornadasStore } from "@/stores/jornadas";

export default {
  async mounted() {
    const jornadasStore = useJornadasStore();

    await jornadasStore.inicializarJornadas();
    await jornadasStore.rellenarCalendario();
  },

  components: { NavBar, Footer },
};
</script>

<template>
  <NavBar></NavBar>

  <router-view></router-view>

  <Footer class="bg"></Footer>
</template>
