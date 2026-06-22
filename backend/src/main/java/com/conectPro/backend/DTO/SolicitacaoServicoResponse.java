package com.conectPro.backend.DTO;

import com.conectPro.backend.Enums.StatusSolicitacao;
import com.conectPro.backend.Model.SolicitacaoServico;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SolicitacaoServicoResponse {
    private Long id;
    private String descricaoServico;
    private LocalDateTime dataSolicitacao;
    private StatusSolicitacao status;
    private Long clienteId;
    private String clienteNome;
    private Long prestadorId;
    private String prestadorNome;
    private String prestadorCategoria;

    public static SolicitacaoServicoResponse fromEntity(SolicitacaoServico solicitacao) {
        return SolicitacaoServicoResponse.builder()
                .id(solicitacao.getId())
                .descricaoServico(solicitacao.getDescricaoServico())
                .dataSolicitacao(solicitacao.getDataSolicitacao())
                .status(solicitacao.getStatus())
                .clienteId(solicitacao.getCliente() != null ? solicitacao.getCliente().getId() : null)
                .clienteNome(solicitacao.getCliente() != null ? solicitacao.getCliente().getNome() : null)
                .prestadorId(solicitacao.getPrestador() != null ? solicitacao.getPrestador().getId() : null)
                .prestadorNome(solicitacao.getPrestador() != null && solicitacao.getPrestador().getUsuario() != null
                        ? solicitacao.getPrestador().getUsuario().getNome()
                        : null)
                .prestadorCategoria(solicitacao.getPrestador() != null ? solicitacao.getPrestador().getCategoria() : null)
                .build();
    }
}
