package es.mde.gehoper;

import java.util.AbstractMap;
import java.util.Arrays;
import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

/**
 * ConfiguracionPorJava establece los parametros configurables en los distintos properties, referenciándolos.
 * 
 * @author Daniel Sánchez López
 *
 */
@Configuration
@EnableTransactionManagement
@PropertySource({ "classpath:config/rest.properties", "classpath:config/jackson.properties", "classpath:config/gestionBBDD.properties"
//	, "classpath:config/passwordsBD.properties" // se comenta esta linea para que no busque el archivo al compilarse en heroku, ya que no lo hemos subido porque las contraseñas se las proporcionaremos por variables 
	})
@EnableJpaRepositories({"${misRepositorios}"}) // Leemos el valor de propiedades pero solo para las entidades anotadas
@ComponentScan({"${misRepositorios}", "es.mde.rest"}) // para que escanee los Listener, los Controller y los servicios...
public class ConfiguracionPorJava {

	/**
	 * Para usar la ruta a escanear entidades desde el application.properties
	 */
	@Value("${misEntidades}")
	String entidades;

	/**
	 * Entity manager que sustituye al jpa-config.xml
	 *
	 * @param dataSource Parametro del tipo DataSource
	 * @param env Parametro del tipo Environment
	 * @param vendorAdapter Parametro del tipo JpaVendorAdapter
	 * 
	 * @return Devuelve un "@Bean" de LocalContainerEntityManagerFactory
	 */
	@Bean
	public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource, Environment env,
			JpaVendorAdapter vendorAdapter) {

		LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
		em.setDataSource(dataSource);
		em.setJpaVendorAdapter(vendorAdapter);

		em.setPackagesToScan(entidades); // leer valor de propiedades? pero solo para las entidades anotadas
		em.setMappingResources("jpa/EmpleadoBase.orm.xml", "jpa/Asignacion.orm.xml", "jpa/EmpleadoLaboral.orm.xml", "jpa/EmpleadoPracticas.orm.xml"); // para escanear archivos xml

		Properties jpaProperties = new Properties();
		Arrays.asList("dialect", "show_sql", "hbm2ddl.auto", "enable_lazy_load_no_trans") // leer valor de para las
																							// entidades anotadas
				.stream().map(s -> "hibernate." + s)
				.map(p -> new AbstractMap.SimpleEntry<String, String>(p, env.getProperty(p)))
				.filter(e -> e.getValue() != null).forEach(e -> jpaProperties.put(e.getKey(), e.getValue()));
		em.setJpaProperties(jpaProperties);

		return em;
	}

	/**
	 * Devuelve un EntityManager
	 * @param emf Parametro del tipo EntityManagerFactory
	 * @return Devuelve un EntityManager
	 */
	@Bean
	public EntityManager entityManager(EntityManagerFactory emf) {
		System.err.println("--- LAS ENTIDADES MAPEADAS SON ---");
		emf.getMetamodel().getEntities().forEach(System.err::println);
		System.err.println("----------------------------------");

		return emf.createEntityManager();
	}

	/**
	 * Devuelve un ObjectMapper
	 * 
	 * @return Devuelve un ObjectMapper
	 */
	@Bean
	public ObjectMapper getObjectMapper() {
		// TODO: ¿Limpiar si no usamos?
		ObjectMapper mapper = new ObjectMapper();
//		mapper.addMixIn(Cliente.class, MixIns.Clientes.class);

		return mapper;
	}

}