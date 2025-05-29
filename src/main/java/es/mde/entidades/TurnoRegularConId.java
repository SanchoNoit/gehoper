package es.mde.entidades;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

import es.mde.libreriaexterna.TipoEspecial;
import es.mde.libreriaexterna.TurnoEspecial;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@DiscriminatorValue("Turno_Regular")
public class TurnoRegularConId extends TurnoBaseConId implements TurnoEspecial {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true)
	private Long id;

	private TipoEspecial tipoEspecial;
	private Set<DayOfWeek> diasNoPermitidos;
	private boolean asociadoPracticas;
	private LocalDate fechaInicio;
	private LocalDate fechaFinal;

	public TurnoRegularConId() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public TipoEspecial getTipoEspecial() {
		return tipoEspecial;
	}

	public void setTipoEspecial(TipoEspecial tipoEspecial) {
		this.tipoEspecial = tipoEspecial;
	}

	public Set<DayOfWeek> getDiasNoPermitidos() {
		return diasNoPermitidos;
	}

	public void setDiasNoPermitidos(Set<DayOfWeek> diasNoPermitidos) {
		this.diasNoPermitidos = diasNoPermitidos;
	}

	public boolean isAsociadoPracticas() {
		return asociadoPracticas;
	}

	public void setAsociadoPracticas(boolean asociadoPracticas) {
		this.asociadoPracticas = asociadoPracticas;
	}

	public LocalDate getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(LocalDate fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public LocalDate getFechaFinal() {
		return fechaFinal;
	}

	public void setFechaFinal(LocalDate fechaFinal) {
		this.fechaFinal = fechaFinal;
	}

}
