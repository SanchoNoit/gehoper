<script>
import NavBar from "@/components/navegacion/navbar.vue";
import Footer from "@/components/navegacion/footer.vue";

export default {
  async mounted() {
    // TODO: Crear la lógica al montar el componente principal
  },

  components: { NavBar, Footer },
};
</script>

<template>
  <NavBar></NavBar>

  <router-view></router-view>

  <Footer></Footer>
</template>
