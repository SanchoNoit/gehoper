package es.mde.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import es.mde.entidades.EmpleadoBaseConId;

@RepositoryRestResource(path = "empleados-Base", itemResourceRel = "empleado-Base", collectionResourceRel = "empleados-Base")
public interface EmpleadoBaseDAO extends JpaRepository<EmpleadoBaseConId, Long>, EmpleadoBaseDAOCustom {
	
	@RestResource(path ="por-nombre")
	List<EmpleadoBaseConId> findByNombreContaining(@Param("nombre") String txt);
	
}
