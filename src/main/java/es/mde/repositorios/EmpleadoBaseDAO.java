package es.mde.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import es.mde.entidades.EmpleadoBaseConId;

@RepositoryRestResource(path = "empleados-Base", itemResourceRel = "empleado-Base", collectionResourceRel = "empleados-Base")
public interface EmpleadoBaseDAO extends JpaRepository<EmpleadoBaseConId, Long>{
	
}
