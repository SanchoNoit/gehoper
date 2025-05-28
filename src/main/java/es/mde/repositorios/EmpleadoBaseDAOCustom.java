package es.mde.repositorios;

import java.time.LocalDate;

public interface EmpleadoBaseDAOCustom {

	String getInformeHorasTrabajadas(Long id, LocalDate fechaInicioConsulta, LocalDate fechaFinalConsulta);
	
}
