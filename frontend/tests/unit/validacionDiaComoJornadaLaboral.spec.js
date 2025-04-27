import { describe, it, expect, toBe } from "vitest";
import { setActivePinia, createPinia } from "pinia"; // Cuando empleemos Pinia en el Test
import validacionDiaComoJornadaLaboral from "@/assets/scripts/validacionDiaComoJornadaLaboral";

// Domingos
const fecha1 = new Date("2025-04-30")
const fecha2 = new Date("2025-04-27")
const fecha3 = new Date("2025-04-26")

// Festivos locales
const fecha4 = new Date("2025-05-15")
const fecha5 = new Date("2025-11-10")

// Festivos regionales
const fecha6 = new Date("2025-01-06")
const fecha7 = new Date("2025-04-17")

// Laborable
const fecha8 = new Date("2025-04-28")

describe("validacionDiaComoJornadaLaboral", () => {

  it("Identifica jornada como domingo", () => {
    expect(validacionDiaComoJornadaLaboral.esDomingo(fecha1)).toBe(false);
    expect(validacionDiaComoJornadaLaboral.esDomingo(fecha2)).toBe(true);
    expect(validacionDiaComoJornadaLaboral.esDomingo(fecha3)).toBe(false);
  });

});

describe("validacionDiaComoFestivoLocalOAutonomico", () => {

  it("Identifica jornada como festivo local", async () => {
    setActivePinia(createPinia());

    let resultado = await validacionDiaComoJornadaLaboral.esFestivoLocalOAutonomico(fecha4)
    expect(resultado).toBe(true);

    resultado = await validacionDiaComoJornadaLaboral.esFestivoLocalOAutonomico(fecha5)
    expect(resultado).toBe(true);

    resultado = await validacionDiaComoJornadaLaboral.esFestivoLocalOAutonomico(fecha1)
    expect(resultado).toBe(false);
  });

  it("Identifica jornada como festivo regional", async () => {
    setActivePinia(createPinia());

    let resultado = await validacionDiaComoJornadaLaboral.esFestivoLocalOAutonomico(fecha6)
    expect(resultado).toBe(true);

    resultado = await validacionDiaComoJornadaLaboral.esFestivoLocalOAutonomico(fecha7)
    expect(resultado).toBe(true);

    resultado = await validacionDiaComoJornadaLaboral.esFestivoLocalOAutonomico(fecha1)
    expect(resultado).toBe(false);
  });
});

describe("esDiaLaborable", () => {

  it("Identifica jornada como festivo local", async () => {
    setActivePinia(createPinia());

    let resultado = await validacionDiaComoJornadaLaboral.esDiaLaborable(fecha2)
    expect(resultado).toBe(false);

    resultado = await validacionDiaComoJornadaLaboral.esDiaLaborable(fecha4)
    expect(resultado).toBe(false);

    resultado = await validacionDiaComoJornadaLaboral.esDiaLaborable(fecha6)
    expect(resultado).toBe(false);

    resultado = await validacionDiaComoJornadaLaboral.esDiaLaborable(fecha8)
    expect(resultado).toBe(true);

  });


});