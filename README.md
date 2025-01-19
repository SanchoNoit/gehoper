# GEHOPER: Gestion de Horarios de Personal
## Descripción
La aplicación permitirá la gestión de los turnos de trabajo de los empleados de una tienda.
Los turnos se reflejarán en un calendario mensual, de manera que se muestren los turnos correspondiente a cada empleado, según el horario de apertura de la tienda y una serie de restricciones sobre coberturas mínimas y horas semanales trabajadas por empleado, según su puesto de trabajo.

La aplicación podrá:
1. Ofrecer de una propuesta de calendario de turnos, según los criterios establecidos y restricciones establecidas.
2. Una gestion de turnos, de manera que se puedan modificar los existentes o agregar nuevos según sea necesario.
3. Permitir establecer los empleados que cumpliran los turnos, así como añadir estudiantes de practicas que reciben anualmente.
4. Configuración manual de los turnos, para una posterior validación. En caso de no cumplir con las restricciones, se mostrarán mensajes de advertencia sobre los aspectos que no cumplen los criterios preestablecidos.
5. La exportación de reportes sobre los turnos y horas trabajadas por cada empleado. 
### Validaciones Automáticas
1. Cobertura Mínima:
   * Un Tag 3 (Manager o Supervisor) debe estar asignado para apertura y cierre.
   * Mínimo dos empleados en cada turno (uno debe ser Tag 3).
2. Horas Semanales:
   * Valida que cada empleado cumpla con sus horas semanales:
     * (3) Staff: 20, 30 o 40 horas
       * 1 Staff a 20 horas
       * 1 Reductor de jornada (30 horas)
       * 1 Staff a 40 horas 
     * (1) Manager: 40 horas.
     * (2) Supervisores: 
       * 1 Reductor de jornada (30 horas)
       * 1 Conciliador (40 horas)
   * Reductores de jornada (Supervisor y Staff con 30 horas semanales):
     * Trabajan siempre de 10:00 a 16:00 h.
     * No pueden trabajar sábados, domingos ni festivos.
     * La suma de sus horas debe ser exactamente 30 horas semanales.
   * Conciliador Supervisor:
     * Trabaja 40 horas semanales.
     * Trabaja todos los días de partido (10:00 a 14:00 h y 17:00 a 21:00 h).
     * Los sábados, trabaja en el turno de apertura (10:00 a 18:00 h), no en el de cierre.
3. Cumplimiento de Días Laborales:
   * Cada empleado debe trabajar un máximo de 5 días por semana y descansar al menos 2.
4. Días y Horarios Permitidos:
   * La tienda abre de lunes a sábado, y ciertos domingos o festivos autorizados.

## Diagrama de Clases de diseño
![Diagrama de Clases](https://git.institutomilitar.com/A50tc0/gehoper/-/wikis/Diagramas/GEHOPER_DiagramaClases_3.jpg)

## Cumplimiento de requisitos
1. **Herencia:** existe herencia entre `EmpleadoBase` y sus subtipos.

2. **Relaciones One-To-Many:** un `EmpleadoBase` tiene multiples `Asignaciones`. Se mostrarán en el calendario mensual, los turnos correspondiente a cada empleado.*(Figura 1)*

3. **Método personalizado:** el método `generarReporte` de la interfaz Reportable, generará un informe con la información de las horas y turnos trabajados por cada empleado, durante un periodo de tiempo determinado.

4. **Listado de entidades en la aplicación web:** se implementará una vista que muestre el listado de `Turnos` de un `Empleado`, utilizando la relación *Uno a Muchos* definida en el punto 2.

5. **CRUD** contará con una interfaz para administrar las entidades `EmpleadoBase`, permitiendo crear, editar y eliminar estas entidades, demostrando la herencia implementada en el punto 1. *(Figuras 2 y 3)*

6. **URLs del proyectos:**
   * **Repositorio del proyecto:**  https://git.institutomilitar.com/A50tc0/gehoper.git

7. **Despliegue en Internet:**
   * **API:** *TBD*
   * **Web:** *TBD*

## Interfaz de Usuario
### Figura 1: Interfaz de la aplicación
![Figura1](https://git.institutomilitar.com/A50tc0/gehoper/-/wikis/Interfaz/GEHOPER_Interfaz_01.jpg)
### Figura 2: Interfaz de Empleados Laborales
![Figura2](https://git.institutomilitar.com/A50tc0/gehoper/-/wikis/Interfaz/GEHOPER_Empleado_Laboral_01.jpg)
### Figura 3: Interfaz de Empleados de Prácticas
![Figura3](https://git.institutomilitar.com/A50tc0/gehoper/-/wikis/Interfaz/GEHOPER_Empleado_Prácticas_01.jpg)