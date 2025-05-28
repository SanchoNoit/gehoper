package es.mde.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import es.mde.entidades.AsignacionConId;

@RepositoryRestResource(path = "asignaciones", itemResourceRel = "asignacion", collectionResourceRel = "asignaciones")
public interface AsignacionDAO extends JpaRepository<AsignacionConId, Long>{
	
}
