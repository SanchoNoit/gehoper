import axios from "axios"

const host = "https://gehoper-940d92e7e388.herokuapp.com/api/"
const API_EMPLEADOS_BASE = host + "empleados-Base"
const API_EMPLEADOS_LABORALES = host + "empleados-laborales"
const API_EMPLEADOS_PRACTICAS = host + "empleados-practicas"
const API_ASIGNACIONES = host + "asignaciones"

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
  return enlace.replace('http', 'https').replace('httpss', 'https')
}

export function getEmpleados() {
  return llamadaAPI("get", null, API_EMPLEADOS_BASE)
}

export function getAsignaciones() {
  return llamadaAPI("get", null, API_ASIGNACIONES)
}

export function postEmpleadoLaboral(data) {
  return llamadaAPI("post", data, API_EMPLEADOS_LABORALES)
}

export function postEmpleadoPracticas(data) {
  return llamadaAPI("post", data, API_EMPLEADOS_PRACTICAS)
}

export function deleteEntidad(entidad) {
  return llamadaAPI("delete", null, cambiarHttpPorHttps(entidad))
}

export function putEntidad(entidad, data) {
  return llamadaAPI("put", data, cambiarHttpPorHttps(entidad))
}