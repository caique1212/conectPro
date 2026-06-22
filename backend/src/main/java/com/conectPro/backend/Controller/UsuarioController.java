package com.conectPro.backend.Controller;

import com.conectPro.backend.DTO.LoginRequest;
import com.conectPro.backend.DTO.UsuarioRequest;
import com.conectPro.backend.DTO.UsuarioResponse;
import com.conectPro.backend.Model.Usuario;
import com.conectPro.backend.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @PostMapping
    public UsuarioResponse criar(@RequestBody UsuarioRequest request) {
        return UsuarioResponse.fromEntity(usuarioService.criar(toEntity(request)));
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarioService.listar().stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscarPorId(@PathVariable Long id) {
        return UsuarioResponse.fromEntity(usuarioService.buscarPorId(id));
    }

    @PostMapping("/login")
    public UsuarioResponse login(@RequestBody LoginRequest loginRequest) {
        return UsuarioResponse.fromEntity(usuarioService.login(loginRequest.getEmail(), loginRequest.getSenha()));
    }

    @PutMapping("/{id}")
    public UsuarioResponse editar(@PathVariable Long id, @RequestBody UsuarioRequest request) {
        return UsuarioResponse.fromEntity(usuarioService.editar(id, toEntity(request)));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        usuarioService.excluir(id);
    }

    private Usuario toEntity(UsuarioRequest request) {
        return Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(request.getSenha())
                .tipoUsuario(request.getTipoUsuario())
                .build();
    }
}
