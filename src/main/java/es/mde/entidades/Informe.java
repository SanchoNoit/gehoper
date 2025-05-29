package es.mde.entidades;

import org.springframework.stereotype.Component;

@Component
public class Informe {
	
	private String textoInforme;
	
	public Informe() {}

	public String getTextoInforme() {
		return textoInforme;
	}

	public void setTextoInforme(String textoInforme) {
		this.textoInforme = textoInforme;
	}
	
}
