// TODO: Conseguir que el script funcione nativamente en el entorno de desarrollo de VUE.

// Variable que guarda un conjunto de objetos tipo "jornada"
let jornadas = [];
let anhoAGenerar = 2025;

// Bucle que recorre todos los dias de anhoAGenerar, iterando mediante una variable tipo Date
for (let dia = new Date(anhoAGenerar, 0, 1); dia < new Date(++anhoAGenerar, 0, 1); dia.setDate(dia.getDate() + 1)) {
    jornadas.push({
        fecha: new Date(dia),
        // La asignacion es un array que guarda de 0 a 10 cada una de las horas de la jornada laboral
        asignacionesPorHoraTag1: Array(11).fill().map(() => []),
        asignacionesPorHoraTag3: Array(11).fill().map(() => []),
    })
}

// Guardamos la información y la deserializamos
let jornadasParaDeserializar = {
    _embedded: {
        jornadasDelAnho: jornadas
    }
}

// Guardamos la información en un archivo json
const fs = require('fs');
fs.writeFileSync('@/assets/json/jornadasDelAnho.json', JSON.stringify(jornadasParaDeserializar));

