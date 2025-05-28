package es.mde.rest;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import es.mde.repositorios.EmpleadoBaseDAO;

@RepositoryRestController
@Configuration
public class EmpleadoBaseController {

	private EmpleadoBaseDAO empleadoBaseDAO;

	public EmpleadoBaseController(EmpleadoBaseDAO empleadoBaseDAO) {

		this.empleadoBaseDAO = empleadoBaseDAO;
	}

//	@GetMapping("/empleados/{id}/informe-horas-trabajadas")
//	@ResponseBody
//	public CollectionModel<PersistentEntityResource> getInformeHorasTrabajadas(@PathVariable Long id,
//			PersistentEntityResourceAssembler assembler) {
//		System.err.println("prueba");
//		List<Producto> productos = clienteDAO.getProductosPagadosDeCliente(id);
//
//		return assembler.toCollectionModel(productos);
//	}

}