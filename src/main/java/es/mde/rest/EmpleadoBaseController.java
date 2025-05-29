package es.mde.rest;

import java.time.LocalDate;
import java.util.ArrayList;
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

import es.mde.entidades.Informe;
import es.mde.repositorios.EmpleadoBaseDAO;

@RepositoryRestController
@Configuration
public class EmpleadoBaseController {

	private EmpleadoBaseDAO empleadoBaseDAO;

	public EmpleadoBaseController(EmpleadoBaseDAO empleadoBaseDAO) {

		this.empleadoBaseDAO = empleadoBaseDAO;
	}

	@GetMapping("/empleados-Base/{id}/search/informe-horas-trabajadas")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getInformeHorasTrabajadas(@PathVariable Long id, @RequestParam("fechaInicioInforme") LocalDate fechaInicioInforme, 
			@RequestParam("fechaFinInforme") LocalDate fechaFinInforme, PersistentEntityResourceAssembler assembler) {
		List<Informe> informe = new ArrayList<Informe>();
		informe.add(empleadoBaseDAO.getInformeHorasTrabajadas(id, fechaInicioInforme, fechaFinInforme));

		return assembler.toCollectionModel(informe);
	}

}