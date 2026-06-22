package com.conectPro.backend.DTO;

import com.conectPro.backend.Enums.TipoUsuario;
import com.conectPro.backend.Model.Usuario;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private TipoUsuario tipoUsuario;

    public static UsuarioResponse fromEntity(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .tipoUsuario(usuario.getTipoUsuario())
                .build();
    }
}
