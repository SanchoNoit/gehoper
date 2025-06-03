package es.mde.entidades;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import es.mde.libreriaexterna.EmpleadoBaseImpl;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Empleados")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TIPO")
@DiscriminatorValue("Base")
public abstract class EmpleadoBaseConId extends EmpleadoBaseImpl {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true)
	private Long id;
	
	@OneToMany(cascade = CascadeType.ALL, targetEntity = AsignacionConId.class, mappedBy = "empleado")
	private Collection<AsignacionConId> asignaciones = new ArrayList<>();
	
	public EmpleadoBaseConId() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
		
	public Collection<AsignacionConId> getAsignaciones() {
		return asignaciones;
	}

	public void setAsignaciones(Collection<AsignacionConId> asignaciones) {
		this.asignaciones = asignaciones;
	}

	public void addAsignacion(AsignacionConId asignacionConId) {
		getAsignaciones().add(asignacionConId);
		asignacionConId.setEmpleado(this);
	}
	
	public Informe generarInforme(LocalDate fechaInicioReporte, LocalDate fechaFinalReporte) {
		Informe nuevoInforme = new Informe();
		nuevoInforme.setTextoInforme(generarReporte(fechaInicioReporte, fechaFinalReporte));
		
		return nuevoInforme;
	}
	
	public String generarReporte(LocalDate fechaInicioReporte, LocalDate fechaFinalReporte) {		
		List<AsignacionConId> asignacionesDelPeriodoSolicitado = getAsignaciones().stream()
																			 	  .filter(a -> (a.getFecha().isAfter(fechaInicioReporte)
																							&& a.getFecha().isBefore(fechaFinalReporte))
																						|| (a.getFecha().equals(fechaInicioReporte)
																							 || a.getFecha().isEqual(fechaFinalReporte))).toList();
		
		int horasTrabajadas = extraerHorasTrabajadasDeAsignaciones(asignacionesDelPeriodoSolicitado);
				
		return String.format("En el periodo solicitado se han trabajado %d horas", horasTrabajadas);
	}

	private int extraerHorasTrabajadasDeAsignaciones(List<AsignacionConId> asignacionesDelPeriodoSolicitado) {
		int resultado = 0;
		
		for(AsignacionConId asignacion : asignacionesDelPeriodoSolicitado) {
//			resultado += Duration.between(asignacion.getTurno().getHoraInicio(), asignacion.getTurno().getHoraFin()).toHours();
			resultado += Integer.parseInt(String.valueOf(asignacion.getCodigoTurno().charAt(1)));
		}

		return resultado;
	}
	
}
