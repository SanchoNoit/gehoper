package es.mde.entidades;

import java.time.LocalDate;

import es.mde.libreriaexterna.EmpleadoPracticas;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@DiscriminatorValue("empleado_practicas")
public class EmpleadoPracticasConId extends EmpleadoBaseConId implements EmpleadoPracticas {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true)
	private Long id;
	private LocalDate fechaFinalPracticas;
	private LocalDate fechaInicioPracticas;

	public EmpleadoPracticasConId() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public LocalDate getFechaFinalPracticas() {
		return fechaFinalPracticas;
	}

	@Override
	public LocalDate getFechaInicioPracticas() {
		return fechaInicioPracticas;
	}

	@Override
	public void setFechaFinalPracticas(LocalDate fechaFinalPracticas) {
		this.fechaFinalPracticas = fechaFinalPracticas;
	}

	@Override
	public void setFechaInicioPracticas(LocalDate fechaInicioPracticas) {
		this.fechaInicioPracticas = fechaInicioPracticas;
	}

}
