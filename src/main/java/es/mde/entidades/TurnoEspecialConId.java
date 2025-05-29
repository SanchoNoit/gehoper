package es.mde.entidades;

import es.mde.libreriaexterna.TipoRegular;
import es.mde.libreriaexterna.TurnoRegular;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@DiscriminatorValue("Turno_Especial")
public class TurnoEspecialConId extends TurnoBaseConId implements TurnoRegular {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true)
	private Long id;

	private TipoRegular tipoRegular;

	public TurnoEspecialConId() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public TipoRegular getTipoRegular() {
		return tipoRegular;
	}

	public void setTipoRegular(TipoRegular tipoRegular) {
		this.tipoRegular = tipoRegular;
	}

}
