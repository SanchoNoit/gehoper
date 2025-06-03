package es.mde.repositorios;

import java.time.LocalDate;
import java.util.List;

import es.mde.entidades.AsignacionConId;

public interface AsignacionDAOCustom {

	List<AsignacionConId> getAsignacionesDeEmpleadoEntreFechas(Long idEmpleado, LocalDate fechaInicio, LocalDate fechaFinal);
	
}
