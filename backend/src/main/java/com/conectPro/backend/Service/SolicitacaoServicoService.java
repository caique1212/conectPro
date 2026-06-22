package com.conectPro.backend.Service;

import com.conectPro.backend.Enums.StatusSolicitacao;
import com.conectPro.backend.Model.Prestador;
import com.conectPro.backend.Model.SolicitacaoServico;
import com.conectPro.backend.Model.Usuario;
import com.conectPro.backend.Repository.SolicitacaoServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoServicoService {
    private final SolicitacaoServicoRepository solicitacaoServicoRepository;
    private final UsuarioService usuarioService;
    private final PrestadorService prestadorService;

    public SolicitacaoServico criar(Long clienteId, Long prestadorId, SolicitacaoServico solicitacao) {
        Usuario cliente = usuarioService.buscarPorId(clienteId);
        Prestador prestador = prestadorService.buscarPorId(prestadorId);
        solicitacao.setCliente(cliente);
        solicitacao.setPrestador(prestador);
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);
        solicitacao.setDataSolicitacao(LocalDateTime.now());
        return solicitacaoServicoRepository.save(solicitacao);
    }

    public List<SolicitacaoServico> listar() {
        return solicitacaoServicoRepository.findAll();
    }

    public List<SolicitacaoServico> listarPorCliente(Long clienteId) {
        Usuario cliente = usuarioService.buscarPorId(clienteId);
        return solicitacaoServicoRepository.findByCliente(cliente);
    }

    public List<SolicitacaoServico> listarPorPrestador(Long prestadorId) {
        Prestador prestador = prestadorService.buscarPorId(prestadorId);
        return solicitacaoServicoRepository.findByPrestador(prestador);
    }

    public SolicitacaoServico alterarStatus(Long id, StatusSolicitacao status) {
        SolicitacaoServico solicitacao = buscarPorId(id);
        solicitacao.setStatus(status);
        return solicitacaoServicoRepository.save(solicitacao);
    }

    public SolicitacaoServico buscarPorId(Long id) {
        return solicitacaoServicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitacao nao encontrada"));
    }

    public void excluir(Long id) {
        SolicitacaoServico solicitacao = buscarPorId(id);
        solicitacaoServicoRepository.delete(solicitacao);
    }
}
