package com.conectPro.backend.Controller;

import com.conectPro.backend.DTO.SolicitacaoServicoRequest;
import com.conectPro.backend.DTO.SolicitacaoServicoResponse;
import com.conectPro.backend.Enums.StatusSolicitacao;
import com.conectPro.backend.Model.SolicitacaoServico;
import com.conectPro.backend.Service.SolicitacaoServicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoServicoController {
    private final SolicitacaoServicoService solicitacaoServicoService;

    @PostMapping
    public SolicitacaoServicoResponse criar(@RequestParam Long clienteId,
                                            @RequestParam Long prestadorId,
                                            @RequestBody SolicitacaoServicoRequest request) {
        return SolicitacaoServicoResponse.fromEntity(solicitacaoServicoService.criar(clienteId, prestadorId, toEntity(request)));
    }

    @GetMapping
    public List<SolicitacaoServicoResponse> listar() {
        return solicitacaoServicoService.listar().stream()
                .map(SolicitacaoServicoResponse::fromEntity)
                .toList();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<SolicitacaoServicoResponse> listarPorCliente(@PathVariable Long clienteId) {
        return solicitacaoServicoService.listarPorCliente(clienteId).stream()
                .map(SolicitacaoServicoResponse::fromEntity)
                .toList();
    }

    @GetMapping("/prestador/{prestadorId}")
    public List<SolicitacaoServicoResponse> listarPorPrestador(@PathVariable Long prestadorId) {
        return solicitacaoServicoService.listarPorPrestador(prestadorId).stream()
                .map(SolicitacaoServicoResponse::fromEntity)
                .toList();
    }

    @PutMapping("/{id}/status")
    public SolicitacaoServicoResponse alterarStatus(@PathVariable Long id, @RequestParam StatusSolicitacao status) {
        return SolicitacaoServicoResponse.fromEntity(solicitacaoServicoService.alterarStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        solicitacaoServicoService.excluir(id);
    }

    private SolicitacaoServico toEntity(SolicitacaoServicoRequest request) {
        return SolicitacaoServico.builder()
                .descricaoServico(request.getDescricaoServico())
                .build();
    }
}
