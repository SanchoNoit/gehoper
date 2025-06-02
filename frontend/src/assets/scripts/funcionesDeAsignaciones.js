export default {
    obtenerEmpleadoAlQuePerteneceAsignacion(asignacionPasada, empleados) {
        let empleadoBuscado = null;
        for (let empleado of empleados) {
            for (let asignacion of empleado.asignaciones)
            if (asignacionPasada._links.empleado.href === asignacion._links.empleado.href) {
                empleadoBuscado = empleado;
            }
        }

        return empleadoBuscado;
    }
}