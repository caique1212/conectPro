package com.conectPro.backend.DTO;

import com.conectPro.backend.Enums.TipoUsuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequest {
    private String nome;
    private String email;
    private String senha;
    private TipoUsuario tipoUsuario;
}
