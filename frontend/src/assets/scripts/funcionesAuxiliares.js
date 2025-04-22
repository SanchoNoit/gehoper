export default {
    compartenElementoDosArray(array1, array2) {
        let hayAlgunElementoCompartido = false;

        for (let i = 0; i < array1.length && !hayAlgunElementoCompartido; i++) {
            for (let j = 0; j < array2.length && !hayAlgunElementoCompartido; j++) {
                if (array1[i] === array2[j]) {
                    hayAlgunElementoCompartido = true;
                }
            }
        }
        
        return hayAlgunElementoCompartido;
    },

    obtenerStringHorarioDeEmpleadoDeDiaParticular(empleado, jornada) {
        let arrayTurnosDelTag = (empleado.tag === 1) ? jornada.asignacionesPorHoraTag1 : jornada.asignacionesPorHoraTag3;
        let indiceHoraInicial = 0;
        let indiceHoraFinal = 0;
        let stringConHorario = "";

        if(arrayTurnosDelTag[indiceHoraInicial].some((emp) => emp.id === empleado.id)) {
            do {
                indiceHoraFinal++
                if (indiceHoraFinal > 8) {
                    debugger
                }
            } while (arrayTurnosDelTag[indiceHoraFinal].some((emp) => emp.id === empleado.id));

            stringConHorario = "10:00 - " + (10 + indiceHoraFinal) + ":00"
        }

        indiceHoraFinal = 10
        indiceHoraInicial = 10

        if(arrayTurnosDelTag[indiceHoraFinal].some((emp) => emp.id === empleado.id)) {
            do {
                indiceHoraInicial--
            } while (arrayTurnosDelTag[indiceHoraInicial].some((emp) => emp.id === empleado.id));
            stringConHorario += stringConHorario === "" ? "" : " y "
            stringConHorario += (11 + indiceHoraInicial) + ":00 - " + "21:00"
        }
        
        return stringConHorario;
    }
}