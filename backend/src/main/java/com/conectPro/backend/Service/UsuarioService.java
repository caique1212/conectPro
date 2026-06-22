package com.conectPro.backend.Service;

import com.conectPro.backend.Model.Usuario;
import com.conectPro.backend.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public Usuario criar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
    }

    public Usuario editar(Long id, Usuario usuarioAtualizado) {
        Usuario usuario = buscarPorId(id);
        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        usuario.setSenha(usuarioAtualizado.getSenha());
        usuario.setTipoUsuario(usuarioAtualizado.getTipoUsuario());
        return usuarioRepository.save(usuario);
    }

    public void excluir(Long id) {
        buscarPorId(id);
        usuarioRepository.deleteById(id);
    }

    public Usuario login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
        if (usuario.getSenha() == null || !usuario.getSenha().equals(senha)) {
            throw new RuntimeException("Senha invalida");
        }
        return usuario;
    }
}
