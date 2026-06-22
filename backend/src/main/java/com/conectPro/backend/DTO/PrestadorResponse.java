package com.conectPro.backend.DTO;

import com.conectPro.backend.Enums.NivelPrestador;
import com.conectPro.backend.Model.Prestador;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PrestadorResponse {
    private Long id;
    private String categoria;
    private String descricao;
    private String cidade;
    private String telefone;
    private Boolean aprovado;
    private NivelPrestador nivel;
    private Long usuarioId;
    private String usuarioNome;
    private String usuarioEmail;
    private Double mediaAvaliacoes;
    private Long quantidadeAvaliacoes;

    public static PrestadorResponse fromEntity(Prestador prestador) {
        return PrestadorResponse.builder()
                .id(prestador.getId())
                .categoria(prestador.getCategoria())
                .descricao(prestador.getDescricao())
                .cidade(prestador.getCidade())
                .telefone(prestador.getTelefone())
                .aprovado(prestador.getAprovado())
                .nivel(prestador.getNivel())
                .usuarioId(prestador.getUsuario() != null ? prestador.getUsuario().getId() : null)
                .usuarioNome(prestador.getUsuario() != null ? prestador.getUsuario().getNome() : null)
                .usuarioEmail(prestador.getUsuario() != null ? prestador.getUsuario().getEmail() : null)
                .mediaAvaliacoes(prestador.getMediaAvaliacoes())
                .quantidadeAvaliacoes(prestador.getQuantidadeAvaliacoes())
                .build();
    }
}
