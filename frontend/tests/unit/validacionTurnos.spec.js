import { describe, it, expect, toBe } from "vitest";
// import { setActivePinia, createPinia } from "pinia"; // Cuando empleemos Pinia en el Test
import validacionTurnos from "@/assets/scripts/validacionTurnos";
import empleadoJSON from "@/assets/json/empleados.json";

const empleados = empleadoJSON._embedded.empleados;
// Turno del 27, completo
const turnos1 = [
  {
    fecha: new Date("2025-04-27"),
    empleado: empleados[0],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-04-27"),
    empleado: empleados[1],
    codigoTurno: "T8",
  },
  {
    fecha: new Date("2025-04-27"),
    empleado: empleados[2],
    codigoTurno: "M8",
  },
  {
    fecha: new Date("2025-04-27"),
    empleado: empleados[3],
    codigoTurno: "T6",
  },
];

// Turno del 28, incompleto porque falta en algun momento un empleado TAG3
const turnos2 = [
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[0],
    codigoTurno: "M6",
  },
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[5],
    codigoTurno: "T8",
  },
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[6],
    codigoTurno: "M8",
  },
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[7],
    codigoTurno: "T6",
  },
];

// Turno del 29, incompleto porque no hay 2 empleados en todo momento
const turnos3 = [
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[0],
    codigoTurno: "M8",
  },
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[1],
    codigoTurno: "T8",
  },
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[2],
    codigoTurno: "M6",
  },
];

// Turno del 30, incompleto porque no hay turnos asignados
const turnos4 = [];

// Turno del 31, completo con turnos partidos
const turnos5 = [
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[0],
    codigoTurno: "P8",
  },
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[1],
    codigoTurno: "T8",
  },
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[2],
    codigoTurno: "M8",
  },
];

// Turno del 31, incompleto con turnos partidos
const turnos6 = [
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[0],
    codigoTurno: "P8",
  },
  {
    fecha: new Date("2025-04-31"),
    empleado: empleados[1],
    codigoTurno: "M8",
  },
];

describe("validacionTurnos", () => {
  // it("Comprueba que hay al menos un empleado en todo momento", () => {
  //   expect(validacionTurnos.hay_Un_EmpleadoEnTodoMomento(turnos1.filter((t) => t.empleado.tag === 3))).toBe(true);
  //   expect(validacionTurnos.hay_Un_EmpleadoEnTodoMomento(turnos2.filter((t) => t.empleado.tag === 3))).toBe(false);
  //   expect(validacionTurnos.hay_Un_EmpleadoEnTodoMomento(turnos4)).toBe(false);

  // });

  // it("Comprueba que hay al menos dos empleados en todo momento", () => {
  //   expect(validacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos1)).toBe(true);
  //   expect(validacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos2)).toBe(true);
  //   expect(validacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos3)).toBe(false);
  //   expect(validacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos4)).toBe(false);
  //   expect(validacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos5)).toBe(true);
  //   expect(validacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos6)).toBe(false);

  // });

  it("Identifica jornada como valida", () => {
    expect(validacionTurnos.esJornadaValida(turnos1)).toBe(0);
    expect(validacionTurnos.esJornadaValida(turnos2)).toBe(-1);
    expect(validacionTurnos.esJornadaValida(turnos3)).toBe(-2);
    expect(validacionTurnos.esJornadaValida(turnos4)).toBe(-1);
  });
});
