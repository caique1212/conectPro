package com.conectPro.backend.Service;

import com.conectPro.backend.Enums.StatusSolicitacao;
import com.conectPro.backend.Model.Avaliacao;
import com.conectPro.backend.Model.Prestador;
import com.conectPro.backend.Model.SolicitacaoServico;
import com.conectPro.backend.Model.Usuario;
import com.conectPro.backend.Repository.AvaliacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {
    private final AvaliacaoRepository avaliacaoRepository;
    private final UsuarioService usuarioService;
    private final PrestadorService prestadorService;
    private final SolicitacaoServicoService solicitacaoServicoService;

    public Avaliacao criar(Long clienteId, Long prestadorId, Avaliacao avaliacao) {
        validarNota(avaliacao.getNota());
        Usuario cliente = usuarioService.buscarPorId(clienteId);
        Prestador prestador = prestadorService.buscarPorId(prestadorId);
        avaliacao.setCliente(cliente);
        avaliacao.setPrestador(prestador);
        avaliacao.setDataAvaliacao(LocalDateTime.now());
        return avaliacaoRepository.save(avaliacao);
    }

    public Avaliacao criarPorSolicitacao(Long solicitacaoId, Avaliacao avaliacao) {
        validarNota(avaliacao.getNota());
        SolicitacaoServico solicitacao = solicitacaoServicoService.buscarPorId(solicitacaoId);
        if (solicitacao.getStatus() != StatusSolicitacao.FINALIZADO) {
            throw new RuntimeException("Avaliacao permitida apenas para solicitacao finalizada");
        }
        avaliacao.setCliente(solicitacao.getCliente());
        avaliacao.setPrestador(solicitacao.getPrestador());
        avaliacao.setDataAvaliacao(LocalDateTime.now());
        return avaliacaoRepository.save(avaliacao);
    }

    public List<Avaliacao> listar() {
        return avaliacaoRepository.findAll();
    }

    public List<Avaliacao> listarPorPrestador(Long prestadorId) {
        Prestador prestador = prestadorService.buscarPorId(prestadorId);
        return avaliacaoRepository.findByPrestador(prestador);
    }

    public Avaliacao editar(Long id, Avaliacao avaliacaoAtualizada) {
        validarNota(avaliacaoAtualizada.getNota());
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliacao nao encontrada"));
        avaliacao.setNota(avaliacaoAtualizada.getNota());
        avaliacao.setComentario(avaliacaoAtualizada.getComentario());
        return avaliacaoRepository.save(avaliacao);
    }

    public void excluir(Long id) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliacao nao encontrada"));
        avaliacaoRepository.delete(avaliacao);
    }

    private void validarNota(Integer nota) {
        if (nota == null || nota < 1 || nota > 5) {
            throw new RuntimeException("Nota deve estar entre 1 e 5");
        }
    }
}
