package es.mde.entidades;

import es.mde.libreriaexterna.Asignacion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Asignaciones")
public class AsignacionConId extends Asignacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "Empleado")
	private EmpleadoBaseConId empleado;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public EmpleadoBaseConId getEmpleado() {
		return empleado;
	}

	public void setEmpleado(EmpleadoBaseConId empleado) {
		this.empleado = empleado;
	}
		
}
