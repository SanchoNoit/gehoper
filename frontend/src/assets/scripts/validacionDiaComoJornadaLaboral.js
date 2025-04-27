// Un dia puede es valido como jornada laboral si no es festivo: domingo, o festivo nacional, autonómico o local.
import { useFestivosAPIStore } from "@/stores/festivosAPI";
import moment from "moment";

export default {
    async esDiaLaborable(fecha) {
      console.log(`El dia ${moment(fecha).toLocaleString('es-ES')}`)
      console.log(`¿Es domingo? ${this.esDomingo(fecha)}`)
      console.log(`¿Es festivo local o autonomico? ${await this.esFestivoLocalOAutonomico(fecha)}`)
      return !this.esDomingo(fecha) && !(await (this.esFestivoLocalOAutonomico(fecha)))
    },

    esDomingo(fecha) {
      return (new Date(fecha)).getDay() === 0
    },

    async esFestivoLocalOAutonomico(fecha) {
      const festivosStore = useFestivosAPIStore();

      if (!festivosStore.festivosCargados) {
        await festivosStore.cargarFestivos();
      }

      const arrayDatesFestivosAPI = Array.from(festivosStore.festivos, f => moment(f))
      const fechaIncluidaEnFestivos = arrayDatesFestivosAPI.some(f => moment(f).isSame(moment(fecha), 'day'))

      return fechaIncluidaEnFestivos;
    }
  };