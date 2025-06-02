<script>
import { mapState, mapActions } from "pinia";
import { useEmpleadosStore } from "@/stores/empleados";
import { Modal } from "bootstrap";
import moment from "moment";

export default {
  data() {
    return {
      editando: false,
      claseEmpleado: "laboral",
      nombre: "",
      activo: true,
      tag: 1,
      tipoEmpleado: "STAFF",
      contratoNumHoras: "",
      tipoConciliacion: "ninguno",
      fechaInicioPracticas: new Date(),
      fechaFinalPracticas: new Date(),
      links: null
    };
  },

  computed: {
    ...mapState(useEmpleadosStore, ["empleados"]),
  },

  methods: {
    ...mapActions(useEmpleadosStore, [
      "eliminarEmpleadoEnStore",
      "anadirEmpleadoEnAPI",
      "modificarEmpleadoAPI",
    ]),

    eliminarEmpleado(empleadoHref) {
      this.eliminarEmpleadoEnStore(empleadoHref);
    },

    enviarFormularioDeNuevoEmpleado() {
      let nuevoEmpleado;

      if (this.claseEmpleado === "laboral") {
        nuevoEmpleado = {
          nombre: this.nombre,
          activo: this.activo,
          tag: parseInt(this.tag),
          tipoEmpleado: this.tipoEmpleado,
          contratoNumHoras: parseInt(this.contratoNumHoras),
          contratoEsReductor:
            this.tipoConciliacion === "reductor" ? true : false,
          contratoEsConciliador:
            this.tipoConciliacion === "conciliador" ? true : false,
        };
      } else if (this.claseEmpleado === "practicas") {
        nuevoEmpleado = {
          nombre: this.nombre,
          activo: this.activo,
          fechaInicioPracticas: this.fechaInicioPracticas,
          fechaFinalPracticas: this.fechaFinalPracticas,
        };
      }

      this.anadirEmpleadoEnAPI(nuevoEmpleado);
      this.limpiarFormulario();
    },

    enviarFormularioEmpleadoModificado() {
      let empleadoPorEditar;

      if (this.claseEmpleado === "laboral") {
        empleadoPorEditar = {
          nombre: this.nombre,
          activo: this.activo,
          tag: parseInt(this.tag),
          tipoEmpleado: this.tipoEmpleado,
          contratoNumHoras: parseInt(this.contratoNumHoras),
          contratoEsReductor:
            this.tipoConciliacion === "reductor" ? true : false,
          contratoEsConciliador:
            this.tipoConciliacion === "conciliador" ? true : false,
          _links: this.links
        };
      } else if (this.claseEmpleado === "practicas") {
        empleadoPorEditar = {
          nombre: this.nombre,
          activo: this.activo,
          fechaInicioPracticas: this.fechaInicioPracticas,
          fechaFinalPracticas: this.fechaFinalPracticas,
          _links: this.links
        };
      }

      this.modificarEmpleadoAPI(empleadoPorEditar);
      this.limpiarFormulario();
    },

    abrirModalNuevoEmpleado() {
      this.empleadoAEditar = {
        nombre: "",
        activo: "",
      };
      let modalElement = this.$refs.formularioModal;
      let bsModal = new Modal(modalElement);
      bsModal.show();
    },

    editarEmpleado(empleadoEditado) {
      this.editando = true;
      console.log("Editando el empleado", empleadoEditado);
      this.nombre = empleadoEditado.nombre;
      this.activo = empleadoEditado.activo;
      this._linksSelfHrefDeEmpleadoEditado = empleadoEditado._links.self.href;
      this.links = JSON.parse(JSON.stringify(empleadoEditado._links));

      if (empleadoEditado.tipoEmpleado) {
        this.claseEmpleado = "laboral";
        this.tag = empleadoEditado.tag;
        this.tipoEmpleado = empleadoEditado.tipoEmpleado;
        this.contratoNumHoras = empleadoEditado.contratoNumHoras;
        this.contratoEsReductor = empleadoEditado.contratoEsReductor;
        this.contratoEsConciliador = empleadoEditado.contratoEsConciliador;
      } else {
        this.claseEmpleado = "practicas";
        this.fechaInicioPracticas = empleadoEditado.fechaInicioPracticas;
        this.fechaFinalPracticas = empleadoEditado.fechaFinalPracticas;
      }

      this.abrirModalNuevoEmpleado();
    },

    limpiarFormulario() {
      this.editando = false
      this.claseEmpleado = "laboral",
      this.nombre = "",
      this.activo = true,
      this.tag = 1,
      this.tipoEmpleado = "STAFF",
      this.contratoNumHoras = "",
      this.tipoConciliacion = "ninguno",
      this.fechaInicioPracticas = new Date(),
      this.fechaFinalPracticas = new Date(),
      this.links = null
    }
  },
};
</script>

<template>
  <div class="row text-center p-3">
    <div class="col-3">
      <h1 class="text-center"><u>Empleados</u></h1>
    </div>
    <div class="col-3">
      <button class="btn btn-moderno btn-lg" @click="abrirModalNuevoEmpleado">
        <font-awesome-icon :icon="['fas', 'user-plus']" />
        &nbsp; Crear nuevo empleado &nbsp;
      </button>
    </div>
  </div>
  <div class="container-flex border p-1 m-1" v-for="empleado in this.empleados">
    <div class="row">
      <div class="col-2">
        <button
          class="btn btn-moderno-opciones-empleado btn-moderno-opciones-empleado-mod m-1"
          @click="editarEmpleado(empleado)"
        >
          <font-awesome-icon :icon="['fas', 'wrench']" />
          &nbsp; Modificar &nbsp;
        </button>
        <button
          class="btn btn-moderno-opciones-empleado btn-moderno-opciones-empleado-delete m-1"
          @click="eliminarEmpleado(empleado._links.self.href)"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
          Eliminar &nbsp;&nbsp;
        </button>
      </div>
      <div class="col">
        <div class="row">
          <div class="col">
            <h3>{{ empleado.nombre }}</h3>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h5>
              <span v-if="empleado.tag === 3" class="badge text-bg-danger"
                >TAG: {{ empleado.tag }} - {{ empleado.tipoEmpleado }}</span
              >
              <span v-else-if="empleado.tag === 1" class="badge text-bg-primary"
                >TAG: {{ empleado.tag }} - {{ empleado.tipoEmpleado }}</span
              >
              <span v-else-if="!empleado.tag" class="badge text-bg-warning">
                Practicas
              </span>
            </h5>
          </div>
          <div v-if="empleado.tipoEmpleado" class="row">
            <div class="col">
              <p>Contrato de {{ empleado.contratoNumHoras }} horas</p>
            </div>
            <div class="col">
              <p>
                Reductor: {{ empleado.contratoEsReductor ? "✅ Sí" : "No" }}
              </p>
            </div>
            <div class="col">
              <p>
                Conciliador:
                {{ empleado.contratoEsConciliador ? "✅ Sí" : "No" }}
              </p>
            </div>
          </div>
          <div v-else-if="empleado.fechaInicioPracticas" class="row">
            <div class="col">
              <p>
                Fecha de inicio de prácticas:
                {{ empleado.fechaInicioPracticas }}
              </p>
            </div>
            <div class="col">
              <p>
                Fecha de fin de prácticas: {{ empleado.fechaFinalPracticas }}
              </p>
            </div>
            <div class="col">
              <p>Activo: {{ empleado.activo ? "✅ Sí" : "❌ No" }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal creación o modificación de empleados -->
  <div
    class="modal fade"
    id="staticBackdrop"
    ref="formularioModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            Crear nuevo empleado
          </h1>
        </div>
        <div class="modal-body">
          <form novalidate>
            <div v-if="this.editando === false">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="radioDefault"
                  id="empleadoLaboral"
                  value="laboral"
                  v-model="claseEmpleado"
                  checked
                />
                <label class="form-check-label" for="empleadoLaboral">
                  Empleado laboral
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="radioDefault"
                  id="empleadoPracticas"
                  value="practicas"
                  v-model="claseEmpleado"
                />
                <label class="form-check-label" for="empleadoPracticas">
                  Alumnos de prácticas
                </label>
              </div>
            </div>

            <!-- Sección de datos comunes -->
            <div class="container-fluid pt-2">
              <h5>Datos básicos</h5>
              <label for="inputNombre" class="pt-2">Nombre completo</label>
              <input
                type="text"
                placeholder="Nombre"
                class="form-control p-2"
                id="inputNombre"
                required
                v-model="nombre"
              />
              <div class="form-check form-switch pt-2 m-1">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="switchCheckDefault"
                  v-model="activo"
                />
                <label class="form-check-label" for="switchCheckDefault"
                  >Activo</label
                >
              </div>
            </div>

            <!-- Sección para empleado laboral -->
            <div v-if="claseEmpleado === 'laboral'" class="mt-3 p-3">
              <h5>Formulario Empleado Laboral</h5>
              <label for="selectorTagEmpleado" class="pt-2">Tag</label>
              <select
                class="form-select m-1 p-3"
                id="selectorTagEmpleado"
                aria-label="TAG"
                v-model="tag"
              >
                <option selected disabled>
                  Seleccione el TAG del empleado
                </option>
                <option value="1">1 - Tag 1</option>
                <option value="3">3 - Tag 3</option>
              </select>

              <label for="selectorTagEmpleado" class="pt-2"
                >Tipo de empleado</label
              >
              <select
                class="form-select m-1 p-3"
                id="selectorTipoEmpleado"
                aria-label="Tipo de empleado"
                v-model="tipoEmpleado"
                required
              >
                <option selected disabled>
                  Seleccione el tipo del empleado
                </option>
                <option value="STAFF" v-if="tag == 1">STAFF</option>
                <option value="MANAGER" v-if="tag == 3">MANAGER</option>
                <option value="SUPERVISOR" v-if="tag == 3">SUPERVISOR</option>
              </select>

              <h5 class="pt-4">Contrato laboral</h5>
              <input
                type="number"
                placeholder="Numero de horas de contrato"
                class="form-control p-3"
                v-model="contratoNumHoras"
                required
              />

              <div class="p-3">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="radioContratoRegular"
                    id="radioContratoRegular"
                    v-model="tipoConciliacion"
                    value="ninguno"
                  />
                  <label class="form-check-label" for="radioContratoRegular"
                    >Sin flexibilidad</label
                  >
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="radioReductorJornada"
                    id="radioReductorJornada"
                    v-model="tipoConciliacion"
                    value="reductor"
                  />
                  <label class="form-check-label" for="radioReductorJornada"
                    >Reductor</label
                  >
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="radioConciliador"
                    id="radioConciliador"
                    v-model="tipoConciliacion"
                    value="conciliador"
                  />
                  <label class="form-check-label" for="radioConciliador"
                    >Conciliador</label
                  >
                </div>
              </div>
            </div>

            <!-- Sección para alumnos de prácticas -->
            <div v-else-if="claseEmpleado === 'practicas'" class="mt-3 p-3">
              <h5>Formulario Alumno de Prácticas</h5>
              <label for="selectorFechaInicioPracticas" class="pt-2"
                >Fecha de inicio de prácticas</label
              >
              <input
                type="date"
                placeholder="Fecha de inicio de prácticas"
                class="form-control mb-2 p-3"
                id="selectorFechaInicioPracticas"
                required
                v-model="fechaInicioPracticas"
              />
              <label for="selectorFechaFinoPracticas" class="pt-2"
                >Fecha de final de prácticas</label
              >
              <input
                type="date"
                placeholder="Fecha de final de prácticas"
                class="form-control p-3"
                id="selectorFechaFinoPracticas"
                v-model="fechaFinalPracticas"
                required
              />
            </div>

            <!-- Botones -->
            <div class="d-flex justify-content-end gap-2 mt-3">
              <button
                class="btn btn-moderno"
                type="button"
                data-bs-dismiss="modal"
                v-if="!editando"
                @click="enviarFormularioDeNuevoEmpleado"
              >
                Crear empleado
              </button>
              <button
                class="btn btn-moderno"
                type="button"
                data-bs-dismiss="modal"
                v-if="editando"
                @click="enviarFormularioEmpleadoModificado"
              >
                Modificar empleado
              </button>
              <button
                type="button"
                class="btn btn-moderno"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-moderno {
  background: rgba(15, 105, 37, 0.4);
  border: none;
  backdrop-filter: blur(6px);
  color: #202924;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-moderno:hover {
  background: rgba(3, 48, 5, 0.829);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(0, 123, 255, 0.5);
}

.btn-moderno:active {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.6);
}

.btn-moderno-opciones-empleado {
  background: rgba(138, 138, 138, 0.4);
  border: none;
  backdrop-filter: blur(6px);
  color: #202924;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 1.5rem;
  box-shadow: 0 4px 4px rgba(105, 106, 108, 0.3);
  transition: all 0.3s ease;
}

.btn-moderno-opciones-empleado-mod:hover {
  background: rgba(3, 48, 5, 0.829);
  color: white;
  transform: scale(1.05);
}

.btn-moderno-opciones-empleado-delete:hover {
  background: rgba(223, 11, 11, 0.829);
  color: white;
  transform: scale(1.05);
}
</style>
