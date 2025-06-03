package es.mde.repositorios;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import es.mde.entidades.AsignacionConId;
import es.mde.entidades.EmpleadoBaseConId;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Transactional(readOnly = true)
public class AsignacionDAOImpl implements AsignacionDAOCustom {
	
	@Autowired
	AsignacionDAO asignacionDAO;
	
	@Autowired
	EmpleadoBaseDAO empleadoBaseDAO ;

	@PersistenceContext
	EntityManager entityManager;

	@Override
	public List<AsignacionConId> getAsignacionesDeEmpleadoEntreFechas(Long idEmpleado, LocalDate fechaInicio,
			LocalDate fechaFinal) {
		EmpleadoBaseConId empleadoBuscado = empleadoBaseDAO.findEmpleadoBaseConIdById(idEmpleado);
		List<AsignacionConId> asignacionesBuscadas = asignacionDAO.findAll()
																  .stream()
																  .filter(a -> a.getFecha().isAfter(fechaInicio) && a.getFecha().isBefore(fechaFinal))
																  .filter(a -> a.getEmpleado().equals(empleadoBuscado))
																  .toList();
		return asignacionesBuscadas;
	}

}
