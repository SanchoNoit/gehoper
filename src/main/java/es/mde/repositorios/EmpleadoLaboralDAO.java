package es.mde.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import es.mde.entidades.EmpleadoLaboralConId;

@RepositoryRestResource(path = "empleados-laborales", itemResourceRel = "empleado-laboral", collectionResourceRel = "empleados-laborales")
public interface EmpleadoLaboralDAO extends JpaRepository<EmpleadoLaboralConId, Long>{
	
}
