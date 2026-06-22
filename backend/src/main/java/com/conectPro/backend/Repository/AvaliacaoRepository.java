package com.conectPro.backend.Repository;

import com.conectPro.backend.Model.Avaliacao;
import com.conectPro.backend.Model.Prestador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByPrestador(Prestador prestador);

}
