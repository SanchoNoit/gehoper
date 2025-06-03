package es.mde.rest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import es.mde.entidades.AsignacionConId;
import es.mde.entidades.Informe;
import es.mde.repositorios.AsignacionDAO;
import es.mde.repositorios.EmpleadoBaseDAO;

@RepositoryRestController
@Configuration
public class AsignacionController {

	private AsignacionDAO asignacionDAO;

	public AsignacionController(AsignacionDAO asignacionDAO) {

		this.asignacionDAO = asignacionDAO;
	}

	@GetMapping("/asignaciones/search/por-empleado-y-rango-fechas")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getAsignacionesPorEmpleadoYRangoFechas(@RequestParam("idEmpleado") Long idEmpleado,
																		@RequestParam("fechaInicio") LocalDate fechaInicio, 
																		@RequestParam("fechaFin") LocalDate fechaFin, 
																		PersistentEntityResourceAssembler assembler) {
		
		List<AsignacionConId> asignaciones = asignacionDAO.getAsignacionesDeEmpleadoEntreFechas(idEmpleado, fechaInicio, fechaFin);

		return assembler.toCollectionModel(asignaciones);
	}
	
}