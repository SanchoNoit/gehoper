<script></script>

<template>
  <nav
    class="navbar navbar-expand-lg bg-primary border-bottom border-5"
    data-bs-theme="dark"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="calendarioBasico">
        <font-awesome-icon :icon="['fas', 'house']" />
        GEHOPER
      </router-link>

      <div class="navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" to="calendarioBasico">Calendario</router-link>
          <router-link class="nav-link" to="gestorJornadasCalendario">Gestor de turnos y empleados</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
