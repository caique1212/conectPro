package com.conectPro.backend.DTO;

import com.conectPro.backend.Model.Avaliacao;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AvaliacaoResponse {
    private Long id;
    private Integer nota;
    private String comentario;
    private LocalDateTime dataAvaliacao;
    private Long clienteId;
    private String clienteNome;
    private Long prestadorId;
    private String prestadorNome;

    public static AvaliacaoResponse fromEntity(Avaliacao avaliacao) {
        return AvaliacaoResponse.builder()
                .id(avaliacao.getId())
                .nota(avaliacao.getNota())
                .comentario(avaliacao.getComentario())
                .dataAvaliacao(avaliacao.getDataAvaliacao())
                .clienteId(avaliacao.getCliente() != null ? avaliacao.getCliente().getId() : null)
                .clienteNome(avaliacao.getCliente() != null ? avaliacao.getCliente().getNome() : null)
                .prestadorId(avaliacao.getPrestador() != null ? avaliacao.getPrestador().getId() : null)
                .prestadorNome(avaliacao.getPrestador() != null && avaliacao.getPrestador().getUsuario() != null
                        ? avaliacao.getPrestador().getUsuario().getNome()
                        : null)
                .build();
    }
}
