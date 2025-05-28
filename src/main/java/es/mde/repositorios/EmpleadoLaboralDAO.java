package es.mde.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import es.mde.entidades.EmpleadoLaboralConId;

@RepositoryRestResource(path = "empleados-laborales", itemResourceRel = "empleado-laboral", collectionResourceRel = "empleados-laborales")
public interface EmpleadoLaboralDAO extends JpaRepository<EmpleadoLaboralConId, Long>{
	
	@RestResource(path ="por-tag")
	List<EmpleadoLaboralConId> findByTagEquals(@Param("tag") Integer tag);
	
}
