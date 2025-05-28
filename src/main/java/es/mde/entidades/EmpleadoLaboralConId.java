package es.mde.entidades;

import es.mde.libreriaexterna.EmpleadoLaboral;
import es.mde.libreriaexterna.TipoEmpleado;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@DiscriminatorValue("empleado_laboral")
public class EmpleadoLaboralConId extends EmpleadoBaseConId implements EmpleadoLaboral {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true)
	private Long id;
	
	private int tag;

	private TipoEmpleado tipoEmpleado;
	
	public EmpleadoLaboralConId() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public int getTag() {
		return this.tag;
	}

	@Override
	public TipoEmpleado getTipoEmpleado() {
		return this.tipoEmpleado;
	}

	@Override
	public void setTag(int tag) {
		this.tag = tag;		
	}

	@Override
	public void setTipoEmpleado(TipoEmpleado tipoEmpleado) {
		this.tipoEmpleado = tipoEmpleado;
		
	}
	
}
