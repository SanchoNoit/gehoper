package es.mde.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import es.mde.entidades.EmpleadoPracticasConId;

@RepositoryRestResource(path = "empleados-practicas", itemResourceRel = "empleado-practicas", collectionResourceRel = "empleados-practicas")
public interface EmpleadoPracticasDAO extends JpaRepository<EmpleadoPracticasConId, Long>{
	
	 List<EmpleadoPracticasConId> findEmpleadoById(Long id);
	
}
