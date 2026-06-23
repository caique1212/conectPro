package com.conectPro.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CadastroPrestadorRequest {
    private String nome;
    private String email;
    private String senha;
    private String categoria;
    private String descricao;
    private String qualificacao;
    private String cidade;
    private String telefone;
}
