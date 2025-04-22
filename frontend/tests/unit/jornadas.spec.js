import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useJornadasStore } from "@/stores/jornadas";
import funcionesAuxiliares from "@/assets/scripts/funcionesAuxiliares";

describe("Jornadas Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("recomienda un turno", () => {
    const store = useJornadasStore();
    const jornadasDePrueba = [
      // Primero, una jornada que no tiene empleados en ninguna franja
      {
        fecha: "2025-12-21T23:00:00.000Z",
        asignacionesPorHoraTag1: [[], [], [], [], [], [], [], [], [], [], []],
        asignacionesPorHoraTag3: [[], [], [], [], [], [], [], [], [], [], []],
      },

      // Segundo, una jornada que tiene empleados por la tarde, pero no por la mañana
      {
        fecha: "2025-12-22T23:00:00.000Z",
        asignacionesPorHoraTag1: [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          ["Empleado1"],
          ["Empleado1"],
          ["Empleado1"],
          ["Empleado1"],
        ],
        asignacionesPorHoraTag3: [[], [], [], [], [], [], [], [], [], [], []],
      },

      // Tercero, una jornada que tiene empleados por la manhana, pero no por la tarde
      {
        fecha: "2025-12-23T23:00:00.000Z",
        asignacionesPorHoraTag1: [
          ["Empleado1"],
          ["Empleado1"],
          ["Empleado1"],
          ["Empleado1"],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
        ],
        asignacionesPorHoraTag3: [[], [], [], [], [], [], [], [], [], [], []],
      },

      // Cuarto, una jornada que tiene empleados por la manhana y por la tarde, pero ninguno en turno partido
      {
        fecha: "2025-12-24T23:00:00.000Z",
        asignacionesPorHoraTag1: [
          ["Empleado1"],
          ["Empleado1"],
          ["Empleado1"],
          ["Empleado1"],
          [],
          [],
          [],
          ["Empleado2"],
          ["Empleado2"],
          ["Empleado2"],
          ["Empleado2"],
        ],
        asignacionesPorHoraTag3: [[], [], [], [], [], [], [], [], [], [], []],
      },

      // Quinto, una jornada que tiene empleados por la manhana y por la tarde, y uno en turno partido. Hay mas empleados por la tarde.
      {
        fecha: "2025-12-25T23:00:00.000Z",
        asignacionesPorHoraTag1: [
          ["Empleado3"],
          ["Empleado3"],
          ["Empleado3"],
          ["Empleado3"],
          [],
          [],
          [],
          ["Empleado2", "Empleado3"],
          ["Empleado2", "Empleado3"],
          ["Empleado2", "Empleado3"],
          ["Empleado2", "Empleado3"],
        ],
        asignacionesPorHoraTag3: [[], [], [], [], [], [], [], [], [], [], []],
      },

      // Sexto, una jornada que tiene empleados por la manhana y por la tarde, y uno en turno partido. Hay mas empleados por la manhana.
      {
        fecha: "2025-12-25T23:00:00.000Z",
        asignacionesPorHoraTag1: [
          ["Empleado1", "Empleado3"],
          ["Empleado1", "Empleado3"],
          ["Empleado1", "Empleado3"],
          ["Empleado1", "Empleado3"],
          [],
          [],
          [],
          ["Empleado3"],
          ["Empleado3"],
          ["Empleado3"],
          ["Empleado3"],
        ],
        asignacionesPorHoraTag3: [[], [], [], [], [], [], [], [], [], [], []],
      },

      // Septimo y ultimo, una jornada que tiene empleados por la manhana y por la tarde, y uno en turno partido. Hay el mismo numero de empleados en ambas franjas.
      {
        fecha: "2025-12-25T23:00:00.000Z",
        asignacionesPorHoraTag1: [
          ["Empleado1", "Empleado3"],
          ["Empleado1", "Empleado3"],
          ["Empleado1", "Empleado3"],
          ["Empleado1", "Empleado3"],
          [],
          [],
          [],
          ["Empleado2", "Empleado3"],
          ["Empleado2", "Empleado3"],
          ["Empleado2", "Empleado3"],
          ["Empleado2", "Empleado3"],
        ],
        asignacionesPorHoraTag3: [[], [], [], [], [], [], [], [], [], [], []],
      },
    ];

    expect(store.recomendarTurno(jornadasDePrueba[0], 1)).toBe("manhana");
    expect(store.recomendarTurno(jornadasDePrueba[1], 1)).toBe("manhana");
    expect(store.recomendarTurno(jornadasDePrueba[2], 1)).toBe("tarde");
    expect(store.recomendarTurno(jornadasDePrueba[3], 1)).toBe("partido");
    expect(store.recomendarTurno(jornadasDePrueba[4], 1)).toBe("manhana");
    expect(store.recomendarTurno(jornadasDePrueba[5], 1)).toBe("tarde");
    expect(store.recomendarTurno(jornadasDePrueba[6], 1)).toBe("tarde");
  });

  it("Evalua si un empleado esta asignado a un dia", () => {
    const store = useJornadasStore();

    const empleado1 = {
      nombreCompleto: "Juan José Aguilar López",
      id: "001JJALTAG3",
      tag: 3,
      contrato: {
        numeroHorasSemanales: 40,
        esReductor: false,
        esConciliador: true,
      },
      _links: {
        self: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
        empleado: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
      },
    };

    const empleado2 = {
      nombreCompleto: "Ramon Ayala Bayona",
      id: "002JRAYBA3",
      tag: 3,
      contrato: {
        numeroHorasSemanales: 40,
        esReductor: false,
        esConciliador: true,
      },
      _links: {
        self: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
        empleado: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
      },
    };

    const empleado3 = {
      nombreCompleto: "Maria Celas López",
      id: "003MCELO3",
      tag: 3,
      contrato: {
        numeroHorasSemanales: 40,
        esReductor: false,
        esConciliador: true,
      },
      _links: {
        self: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
        empleado: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
      },
    };

    const jornada1 = {
      fecha: "2025-12-25T23:00:00.000Z",
      asignacionesPorHoraTag3: [
        [empleado1, empleado3],
        [empleado1, empleado3],
        [empleado1, empleado3],
        [empleado1, empleado3],
        [],
        [],
        [],
        [empleado2, empleado3],
        [empleado2, empleado3],
        [empleado2, empleado3],
        [empleado2, empleado3],
      ],
      asignacionesPorHoraTag1: [[], [], [], [], [], [], [], [], [], [], []],
    };

    const jornada2 = {
      fecha: "2025-12-25T23:00:00.000Z",
      asignacionesPorHoraTag3: [
        [empleado3],
        [empleado3],
        [empleado3],
        [empleado3],
        [],
        [],
        [],
        [empleado3],
        [empleado3],
        [empleado3],
        [empleado3],
      ],
      asignacionesPorHoraTag1: [[], [], [], [], [], [], [], [], [], [], []],
    };

    const jornada3 = {
      fecha: "2025-12-25T23:00:00.000Z",
      asignacionesPorHoraTag3: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [empleado2],
        [empleado2],
        [empleado2],
        [empleado2],
      ],
      asignacionesPorHoraTag1: [[], [], [], [], [], [], [], [], [], [], []],
    };

    const jornada4 = {
      fecha: "2025-12-25T23:00:00.000Z",
      asignacionesPorHoraTag3: [[], [], [], [], [], [], [], [], [], [], []],
      asignacionesPorHoraTag1: [[], [], [], [], [], [], [], [], [], [], []],
    };

    // Tests de la jornada 1
    expect(store.estaEmpleadoPresenteEnJornada(empleado1, jornada1)).toBe(true);
    expect(store.estaEmpleadoPresenteEnJornada(empleado2, jornada1)).toBe(true);
    expect(store.estaEmpleadoPresenteEnJornada(empleado3, jornada1)).toBe(true);

    // Tests de la jornada 2
    expect(store.estaEmpleadoPresenteEnJornada(empleado1, jornada2)).toBe(
      false
    );
    expect(store.estaEmpleadoPresenteEnJornada(empleado2, jornada2)).toBe(
      false
    );
    expect(store.estaEmpleadoPresenteEnJornada(empleado3, jornada2)).toBe(true);

    // Tests de la jornada 3
    expect(store.estaEmpleadoPresenteEnJornada(empleado1, jornada3)).toBe(
      false
    );
    expect(store.estaEmpleadoPresenteEnJornada(empleado2, jornada3)).toBe(true);
    expect(store.estaEmpleadoPresenteEnJornada(empleado3, jornada3)).toBe(
      false
    );

    // Tests de la jornada 4
    expect(store.estaEmpleadoPresenteEnJornada(empleado1, jornada4)).toBe(
      false
    );
    expect(store.estaEmpleadoPresenteEnJornada(empleado2, jornada4)).toBe(false);
    expect(store.estaEmpleadoPresenteEnJornada(empleado3, jornada4)).toBe(
      false
    );
  });

  it("Devuelve un string con el turno de un empleado", () => {
    const empleado1 = {
      nombreCompleto: "Juan José Aguilar López",
      id: "001JJALTAG3",
      tag: 3,
      contrato: {
        numeroHorasSemanales: 40,
        esReductor: false,
        esConciliador: true,
      },
      _links: {
        self: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
        empleado: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
      },
    };

    const empleado2 = {
      nombreCompleto: "Ramon Ayala Bayona",
      id: "002JRAYBA3",
      tag: 3,
      contrato: {
        numeroHorasSemanales: 40,
        esReductor: false,
        esConciliador: true,
      },
      _links: {
        self: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
        empleado: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
      },
    };

    const empleado3 = {
      nombreCompleto: "Maria Celas López",
      id: "003MCELO3",
      tag: 3,
      contrato: {
        numeroHorasSemanales: 40,
        esReductor: false,
        esConciliador: true,
      },
      _links: {
        self: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
        empleado: {
          href: "http://gehoper-api.b4a.run/api/empleados/001JJALTAG3",
        },
      },
    };

    const jornada1 = {
      fecha: "2025-12-25T23:00:00.000Z",
      asignacionesPorHoraTag3: [
        [empleado1, empleado3],
        [empleado1, empleado3],
        [empleado1, empleado3],
        [empleado1, empleado3],
        [],
        [],
        [],
        [empleado2, empleado3],
        [empleado2, empleado3],
        [empleado2, empleado3],
        [empleado2, empleado3],
      ],
      asignacionesPorHoraTag1: [[], [], [], [], [], [], [], [], [], [], []],
    };

    const jornada2 = {
      fecha: "2025-12-25T23:00:00.000Z",
      asignacionesPorHoraTag3: [
        [empleado3],
        [empleado3],
        [empleado3],
        [empleado3],
        [],
        [],
        [],
        [empleado3],
        [empleado3],
        [empleado3],
        [empleado3],
      ],
      asignacionesPorHoraTag1: [[], [], [], [], [], [], [], [], [], [], []],
    };

    let respuesta = "10:00 - 14:00"
    expect(funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(empleado1, jornada1)).toBe(respuesta)

    respuesta = ""
    expect(funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(empleado1, jornada2)).toBe(respuesta)

    respuesta = "17:00 - 21:00"
    expect(funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(empleado2, jornada1)).toBe(respuesta)

    respuesta = "10:00 - 14:00 y 17:00 - 21:00"
    expect(funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(empleado3, jornada1)).toBe(respuesta)

    respuesta = "10:00 - 14:00 y 17:00 - 21:00"
    expect(funcionesAuxiliares.obtenerStringHorarioDeEmpleadoDeDiaParticular(empleado3, jornada2)).toBe(respuesta)

  });
});
