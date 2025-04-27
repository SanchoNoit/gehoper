import { describe, it, expect, toBe } from "vitest";
// import { setActivePinia, createPinia } from "pinia"; // Cuando empleemos Pinia en el Test
import evaluacionTurnos from "@/assets/scripts/evaluacionTurnos";
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
    empleado: empleados[5],
    codigoTurno: "M8",
  },
];

// Turno del 20, incompleto con turnos partidos
const turnos7 = [
  {
    fecha: new Date("2025-04-20"),
    empleado: empleados[0],
    codigoTurno: "P8",
  },
];

describe("evaluacionTurnos", () => {
  it("Comprueba que hay al menos un empleado en todo momento", () => {
    expect(evaluacionTurnos.hay_Un_EmpleadoEnTodoMomento(turnos1.filter((t) => t.empleado.tag === 3))).toBe(true);
    expect(evaluacionTurnos.hay_Un_EmpleadoEnTodoMomento(turnos2.filter((t) => t.empleado.tag === 3))).toBe(false);
    expect(evaluacionTurnos.hay_Un_EmpleadoEnTodoMomento(turnos4)).toBe(false);

  });

  it("Comprueba que hay al menos dos empleados en todo momento", () => {
    expect(evaluacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos1)).toBe(true);
    expect(evaluacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos2)).toBe(true);
    expect(evaluacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos3)).toBe(false);
    expect(evaluacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos4)).toBe(false);
    expect(evaluacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos5)).toBe(true);
    expect(evaluacionTurnos.hay_DosOMas_EmpleadosEnTodoMomento(turnos6)).toBe(false);

  });

  it("Identifica jornada como valida", () => {
    expect(evaluacionTurnos.esJornadaValida(turnos1)).toBe(0);
    expect(evaluacionTurnos.esJornadaValida(turnos2)).toBe(-1);
    expect(evaluacionTurnos.esJornadaValida(turnos3)).toBe(-2);
    expect(evaluacionTurnos.esJornadaValida(turnos4)).toBe(-1);
  });

  it("Obtiene un array de códigos de turno para tag 3", () => {
    // Turnos2 tiene 1 empleado que cubre M6. Por lo tanto, para cubrir el TAG3, deberiamos obtener al menos T8 y T6.
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos2)).toContain('T8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos2)).toContain('T6');

    // Turnos4 no tiene turnos asignados. Deberiamos obtener todos los turnos posibles
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos4)).toContain('P8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos4)).toContain('M8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos4)).toContain('M6');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos4)).toContain('T8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos4)).toContain('T8');
    
    // Turnos5 tiene todos los turnos de TAG3 cubierto, deberiamos obtener []
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos5)).toHaveLength(0);

    // Turnos 6 solo tiene un turno tag3 P8 cubierto. Deberiamos obtener 'M8', 'M6', 'T8' y 'T6'
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos6)).toContain('M8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos6)).toContain('M6');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos6)).toContain('T8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuestoParaTag3(turnos6)).toContain('T8');
  });

  it("Obtiene un array de códigos de turno para zonas con menos de 2 empleados", () => {

    // Turnos2 esta completo en lo relativo a numero de empleados por hora
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos2)).toHaveLength(0);

    // Turnos4 no tiene turnos asignados. Deberiamos obtener todos los turnos posibles
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos4)).toContain('P8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos4)).toContain('M8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos4)).toContain('M6');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos4)).toContain('T8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos4)).toContain('T8');
    
    // Turnos5 tiene todos los turnos cubiertos por al menos 2 empleados, deberiamos obtener []
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos5)).toHaveLength(0);

    // Turnos 6 solo tiene dos empleados solo las primeras 8 horas. Deberiamos obtener todos los turnos de tarde.
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos6)).not.toContain('P8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos6)).toContain('T8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos6)).toContain('T6');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos6)).toContain('T5');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos6)).toContain('T4');

    // Turnos 7 no tiene empleados doblados. Deberiamos obtener todos los turnos de tarde.
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos7)).not.toContain('P8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos7)).toContain('T8');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos7)).toContain('T6');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos7)).toContain('T5');
    expect(evaluacionTurnos.obtenerArrayCodigosDeTurnoPropuesto(turnos7)).toContain('T4');
  });


});
