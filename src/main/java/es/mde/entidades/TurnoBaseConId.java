package es.mde.entidades;

import java.util.ArrayList;
import java.util.Collection;

import es.mde.libreriaexterna.TurnoBaseImpl;
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
@Table(name = "Turnos")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TIPO_DE_TURNO")
@DiscriminatorValue("Turno_Base")
public class TurnoBaseConId extends TurnoBaseImpl {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true)
	private Long id;
	
	@OneToMany(cascade = CascadeType.ALL, targetEntity = AsignacionConId.class, mappedBy = "turno")
	private Collection<AsignacionConId> asignaciones = new ArrayList<>();
	
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
		asignacionConId.setTurno(this);
	}
	
}
