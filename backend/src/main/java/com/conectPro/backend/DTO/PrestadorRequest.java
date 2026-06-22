package com.conectPro.backend.DTO;

import com.conectPro.backend.Enums.NivelPrestador;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrestadorRequest {
    private String categoria;
    private String descricao;
    private String cidade;
    private String telefone;
    private Boolean aprovado;
    private NivelPrestador nivel;
    private Long usuarioId;
}
