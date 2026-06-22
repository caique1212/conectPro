package com.conectPro.backend.Repository;

import com.conectPro.backend.Model.Prestador;
import com.conectPro.backend.Model.SolicitacaoServico;
import com.conectPro.backend.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List; 

public interface SolicitacaoServicoRepository extends JpaRepository<SolicitacaoServico, Long> {
    List<SolicitacaoServico> findByCliente(Usuario cliente);
    List<SolicitacaoServico> findByPrestador(Prestador prestador);

}
