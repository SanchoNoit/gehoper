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

	@Column(name = "Horas_Contratadas")
	private int contratoNumHoras;
	@Column(name = "¿Es_reductor?")
	private boolean contratoEsReductor;
	@Column(name = "¿Es_conciliador?")
	private boolean contratoEsConciliador;

	public EmpleadoLaboralConId() {
		contratoEsReductor = false;
		contratoEsConciliador = false;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getContratoNumHoras() {
		return contratoNumHoras;
	}

	public void setContratoNumHoras(int contratoNumHoras) {
		this.contratoNumHoras = contratoNumHoras;
	}

	public boolean isContratoEsReductor() {
		return contratoEsReductor;
	}

	public void setContratoEsReductor(boolean contratoEsReductor) {
		this.contratoEsReductor = contratoEsReductor;
	}

	public boolean isContratoEsConciliador() {
		return contratoEsConciliador;
	}

	public void setContratoEsConciliador(boolean contratoEsConciliador) {
		this.contratoEsConciliador = contratoEsConciliador;
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
