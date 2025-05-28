package es.mde.entidades;

import java.time.LocalTime;

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
	
	private LocalTime horaInicioTurno;
	private LocalTime horaFinalTurno;
	private String codigoTurno;
	
	public AsignacionConId() {}
	
	public AsignacionConId(String codigoTurno) {
		char codigoFranja = codigoTurno.charAt(0);
		int codigoHoras = Integer.parseInt(String.valueOf(codigoTurno.charAt(1)));
		
		if (codigoFranja == 'M') {
			horaInicioTurno = LocalTime.of(10, 00);
			horaFinalTurno = LocalTime.of((10 + codigoHoras), 00);
		} else if (codigoFranja == 'T') {
			horaFinalTurno = LocalTime.of(21, 00);
			horaInicioTurno = LocalTime.of((21 - codigoHoras), 00);
		} else {
			horaInicioTurno = LocalTime.of(10, 00);
			horaFinalTurno = LocalTime.of(21, 00);
		}
	}

	public LocalTime getHoraInicioTurno() {
		return horaInicioTurno;
	}

	public void setHoraInicioTurno(LocalTime horaInicioTurno) {
		this.horaInicioTurno = horaInicioTurno;
	}

	public LocalTime getHoraFinalTurno() {
		return horaFinalTurno;
	}

	public void setHoraFinalTurno(LocalTime horaFinalTurno) {
		this.horaFinalTurno = horaFinalTurno;
	}

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

	public String getCodigoTurno() {
		return codigoTurno;
	}

	public void setCodigoTurno(String codigoTurno) {
		this.codigoTurno = codigoTurno;
	}
		
}
