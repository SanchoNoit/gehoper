import { describe, it, expect, toBe } from "vitest";
// import { setActivePinia, createPinia } from "pinia"; // Cuando empleemos Pinia en el Test
import evaluacionEmpleados from "@/assets/scripts/evaluacionEmpleados";
import empleadoJSON from "@/assets/json/empleados.json";

const empleados = empleadoJSON._embedded.empleados;
const fechaEvaluada = "2025-03-14"

// El primer empleado será conciliador, y tendrá 4 días asignados.
const empleado1 = empleados[0];
empleado1.turnos.push(
  {
    fecha: new Date("2025-03-10"),
    empleado: empleados[0],
    codigoTurno: "P8",
  },
  {
    fecha: new Date("2025-03-11"),
    empleado: empleados[0],
    codigoTurno: "P8",
  },
  {
    fecha: new Date("2025-03-12"),
    empleado: empleados[0],
    codigoTurno: "P8",
  },
  {
    fecha: new Date("2025-03-13"),
    empleado: empleados[0],
    codigoTurno: "P8",
  }
);

// El segundo empleado será normal, y tendrá 4 días asignados, uno de los cuales es el estudiado.
const empleado2 = empleados[1];
empleado2.turnos.push(
  {
    fecha: new Date("2025-03-10"),
    empleado: empleados[2],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-11"),
    empleado: empleados[2],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-12"),
    empleado: empleados[2],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-14"),
    empleado: empleados[2],
    codigoTurno: "M6",
  }
);

// El tercer empleado será normal, y tendrá 5 días ya asignados
const empleado3 = empleados[2];
empleado3.turnos.push(
  {
    fecha: new Date("2025-03-09"),
    empleado: empleados[3],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-10"),
    empleado: empleados[3],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-11"),
    empleado: empleados[3],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-12"),
    empleado: empleados[3],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-13"),
    empleado: empleados[3],
    codigoTurno: "M6",
  }
);

// El cuarto empleado será reductor, y tendrá un turno asignado el día estudiado
const empleado4 = empleados[3];
empleado4.turnos.push(
  {
    fecha: new Date("2025-03-12"),
    empleado: empleados[3],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-14"),
    empleado: empleados[3],
    codigoTurno: "M6",
  }
);

// El quinto empleado será normal, y tendrá 2 días asignados
const empleado5 = empleados[4];
empleado5.turnos.push(
  {
    fecha: new Date("2025-03-09"),
    empleado: empleados[4],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-12"),
    empleado: empleados[4],
    codigoTurno: "M6",
  },

);

// El sexto empleado será normal, y tendrá 2 días asignados
const empleado6 = empleados[5];
empleado6.turnos.push(
  {
    fecha: new Date("2025-03-09"),
    empleado: empleados[5],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-03-12"),
    empleado: empleados[5],
    codigoTurno: "M6",
  },

);

// El séptimo empleado será normal, y tendrá 3 días asignados
const empleado7 = empleados[6];
empleado7.turnos.push(
  {
    fecha: new Date("2025-03-09"),
    empleado: empleados[6],
    codigoTurno: "M4",
  },
  {
    fecha: new Date("2025-03-10"),
    empleado: empleados[6],
    codigoTurno: "M4",
  },
  {
    fecha: new Date("2025-03-12"),
    empleado: empleados[6],
    codigoTurno: "M4",
  },

);

describe("evaluacionEmpleados", () => {
  it("Obtiene la puntuacion de cada empleado", () => {
    expect(evaluacionEmpleados.obtenerPuntuacionEmpleado(empleado1,fechaEvaluada)).toBe(1.25);
    expect(evaluacionEmpleados.obtenerPuntuacionEmpleado(empleado2,fechaEvaluada)).toBe(40/24);
    expect(evaluacionEmpleados.obtenerPuntuacionEmpleado(empleado3,fechaEvaluada)).toBe(40/30);
    expect(evaluacionEmpleados.obtenerPuntuacionEmpleado(empleado4,fechaEvaluada)).toBe(2.5);
    expect(evaluacionEmpleados.obtenerPuntuacionEmpleado(empleado5,fechaEvaluada)).toBe(40/12);
    expect(evaluacionEmpleados.obtenerPuntuacionEmpleado(empleado6,fechaEvaluada)).toBe(20/12);
    expect(evaluacionEmpleados.obtenerPuntuacionEmpleado(empleado7,fechaEvaluada)).toBe(20/12);
  });

  it("Determina si un empleado está ya asignado a una jornada", () => {
    expect(evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(empleado4,fechaEvaluada)).toBe(true);
    expect(evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(empleado1,new Date("2025-03-10"))).toBe(true);
    expect(evaluacionEmpleados.estaEmpleadoAsignadoAEstaJornada(empleado2,new Date("2025-03-24"))).toBe(false);
  });

  it("Determina si un empleado ya ha trabajado cinco jornadas esta semana", () => {
    expect(evaluacionEmpleados.trabajaMenosDeCincoJornadas(empleado1,fechaEvaluada)).toBe(true);
    expect(evaluacionEmpleados.trabajaMenosDeCincoJornadas(empleado3,fechaEvaluada)).toBe(false);
    expect(evaluacionEmpleados.trabajaMenosDeCincoJornadas(empleado5,fechaEvaluada)).toBe(true);
  });

});
