package es.mde.repositorios;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import es.mde.entidades.AsignacionConId;

@RepositoryRestResource(path = "asignaciones", itemResourceRel = "asignacion", collectionResourceRel = "asignaciones")
public interface AsignacionDAO extends JpaRepository<AsignacionConId, Long>, AsignacionDAOCustom {

	@RestResource(path ="por-fecha")
	List<AsignacionConId> findByFechaEquals(@Param("fecha") LocalDate fecha);
	
}
	
