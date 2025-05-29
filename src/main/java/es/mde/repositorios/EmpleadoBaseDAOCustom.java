package es.mde.repositorios;

import java.time.LocalDate;

import es.mde.entidades.Informe;

public interface EmpleadoBaseDAOCustom {

	Informe getInformeHorasTrabajadas(Long id, LocalDate fechaInicioConsulta, LocalDate fechaFinalConsulta);
	
}
