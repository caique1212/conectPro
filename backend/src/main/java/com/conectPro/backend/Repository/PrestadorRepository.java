package com.conectPro.backend.Repository;
import com.conectPro.backend.Model.Prestador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PrestadorRepository extends JpaRepository<Prestador, Long> {

    List<Prestador> findByAprovadoTrue();
    List<Prestador> findByAprovadoTrueAndCategoriaContainingIgnoreCase(String categoria);
    List<Prestador> findByAprovadoTrueAndCidadeContainingIgnoreCase(String cidade);
    List<Prestador> findByAprovadoTrueAndCategoriaContainingIgnoreCaseAndCidadeContainingIgnoreCase(String categoria, String cidade);
    List<Prestador> findByAprovadoFalse();
}
