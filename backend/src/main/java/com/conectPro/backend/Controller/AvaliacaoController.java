package com.conectPro.backend.Controller;

import com.conectPro.backend.DTO.AvaliacaoRequest;
import com.conectPro.backend.DTO.AvaliacaoResponse;
import com.conectPro.backend.Model.Avaliacao;
import com.conectPro.backend.Service.AvaliacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@RequiredArgsConstructor
public class AvaliacaoController {
    private final AvaliacaoService avaliacaoService;

    @PostMapping
    public AvaliacaoResponse criar(@RequestParam Long clienteId,
                                   @RequestParam Long prestadorId,
                                   @RequestBody AvaliacaoRequest request) {
        return AvaliacaoResponse.fromEntity(avaliacaoService.criar(clienteId, prestadorId, toEntity(request)));
    }

    @PostMapping("/solicitacao/{solicitacaoId}")
    public AvaliacaoResponse criarPorSolicitacao(@PathVariable Long solicitacaoId,
                                                 @RequestBody AvaliacaoRequest request) {
        return AvaliacaoResponse.fromEntity(avaliacaoService.criarPorSolicitacao(solicitacaoId, toEntity(request)));
    }

    @GetMapping
    public List<AvaliacaoResponse> listar() {
        return avaliacaoService.listar().stream()
                .map(AvaliacaoResponse::fromEntity)
                .toList();
    }

    @GetMapping("/prestador/{prestadorId}")
    public List<AvaliacaoResponse> listarPorPrestador(@PathVariable Long prestadorId) {
        return avaliacaoService.listarPorPrestador(prestadorId).stream()
                .map(AvaliacaoResponse::fromEntity)
                .toList();
    }

    @PutMapping("/{id}")
    public AvaliacaoResponse editar(@PathVariable Long id, @RequestBody AvaliacaoRequest request) {
        return AvaliacaoResponse.fromEntity(avaliacaoService.editar(id, toEntity(request)));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        avaliacaoService.excluir(id);
    }

    private Avaliacao toEntity(AvaliacaoRequest request) {
        return Avaliacao.builder()
                .nota(request.getNota())
                .comentario(request.getComentario())
                .build();
    }
}
