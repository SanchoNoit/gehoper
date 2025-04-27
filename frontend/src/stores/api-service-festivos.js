import axios from "axios"

const API_FESTIVOS_LOCALES = 'https://datos.comunidad.madrid/dataset/f160eb6c-6715-471e-9bc0-38497aae950f/resource/db6a3cb0-5504-4db8-9fe7-e42af1ae329b/download/festivos_locales.json'
const API_FESTIVOS_REGIONALES = 'https://datos.comunidad.madrid/dataset/f160eb6c-6715-471e-9bc0-38497aae950f/resource/975f579d-92c2-42de-bfa9-aff5bd164586/download/festivos_regionales.json'

function llamadaAPI(method, body, path) {
  let config = {
    method: method ?? "get",
    maxBodyLength: Infinity,
    url: path,
    headers: {}
  }
  if (body) {
    (config.data = body), (config.headers["Content-Type"] = "application/json")
  }
  return axios.request(config)
}

export function cambiarHttpPorHttps(enlace) {
  return enlace.replace(/^http:/, 'https:')
}

export function getFestivosRegionales() {
  return llamadaAPI("get", null, API_FESTIVOS_REGIONALES)
}

export function getFestivosLocales() {
  return llamadaAPI("get", null, API_FESTIVOS_LOCALES)
}

// export function postPartidos(data) {
//   return llamadaAPI("post", data, API_PARTIDOS)
// }

// export function deleteEntidad(entidad) {
//   console.log("En apiservice, antes de delete: ", entidad)
//   return llamadaAPI("delete", null, cambiarHttpPorHttps(entidad))
// }

// export function putEntidad(entidad, data) {
//   return llamadaAPI("put", data, cambiarHttpPorHttps(entidad))
// }