<template>
  <nav class="navbar navbar-expand-lg bg-dark-subtle border-bottom border-5" data-bs-theme="light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="calendarioBasico">
        <font-awesome-icon :icon="['fas', 'house']" />
        GEHOPER
      </router-link>

      <div class="navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" to="calendarioBasico">Calendario</router-link>
          <router-link class="nav-link" to="gestorEmpleadosTurnos">Empleados</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  transition: border-color 0.2s, background-color 0.2s;
}

.nav-link:hover {
  border-color: #4d4d4d;
  background-color: rgba(137, 138, 141, 0.87);
}

.router-link-active {
  color: #000;
}</style>