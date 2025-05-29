package es.mde.repositorios;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import es.mde.entidades.EmpleadoBaseConId;
import es.mde.entidades.Informe;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Transactional(readOnly = true)
public class EmpleadoBaseDAOImpl implements EmpleadoBaseDAOCustom {
	
	@Autowired
	EmpleadoBaseDAO empleadoBaseDAO;

	@PersistenceContext
	EntityManager entityManager;

	@Override
	public Informe getInformeHorasTrabajadas(Long id, LocalDate fechaInicioConsulta, LocalDate fechaFinalConsulta) {
		
		EmpleadoBaseConId empleadoBuscado = empleadoBaseDAO.getReferenceById(id);
		
		return empleadoBuscado.generarInforme(fechaInicioConsulta, fechaFinalConsulta);
	}

}
