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
    }
}