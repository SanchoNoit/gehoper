import { defineStore } from "pinia";
import { getFestivosLocales, getFestivosRegionales } from "@/stores/api-service-festivos";

export const useFestivosAPIStore = defineStore("festivosAPI", {
  state: () => {
    return {
      festivos: [],
      festivosCargados: false
    };
  },

  getters: {
  },

  actions: {
    async cargarFestivos() {
      await getFestivosLocales().then((response) => {
        if (response.data) {
          const arrayFestivosParseadosJSON = response.data.data
          const festivosMadrid = arrayFestivosParseadosJSON.filter((m) => m.municipio_nombre === 'Madrid').map((m) => m.fecha_festivo)
          this.festivos = festivosMadrid
        }
        this.festivosCargados = true

      }).catch((error) => {
        console.warn(`No se ha podido acceder a la API de festivos locales : ${error}`)
      })

      await getFestivosRegionales().then((response) => {
        if (response.data) {
          const arrayFestivosParseadosJSON = response.data.data
          const festivosRegionales = arrayFestivosParseadosJSON.map((f) => f.fecha_festivo)
          this.festivos = this.festivos.concat(festivosRegionales)
        }
        this.festivosCargados = true

      }).catch((error) => {
        console.warn(`No se ha podido acceder a la API de festivos regionales : ${error}`)
      })
    },
  },
});
