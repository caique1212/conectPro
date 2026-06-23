package com.conectPro.backend.Service;

import com.conectPro.backend.Enums.NivelPrestador;
import com.conectPro.backend.Enums.TipoUsuario;
import com.conectPro.backend.DTO.CadastroPrestadorRequest;
import com.conectPro.backend.Model.Avaliacao;
import com.conectPro.backend.Model.Prestador;
import com.conectPro.backend.Model.Usuario;
import com.conectPro.backend.Repository.AvaliacaoRepository;
import com.conectPro.backend.Repository.PrestadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrestadorService {

    private final PrestadorRepository prestadorRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final UsuarioService usuarioService;

    public Prestador criar(Prestador prestador) {
        if (prestador.getUsuario() != null && prestador.getUsuario().getId() != null) {
            Usuario usuario = usuarioService.buscarPorId(prestador.getUsuario().getId());
            prestador.setUsuario(usuario);
        }
        if (prestador.getAprovado() == null) {
            prestador.setAprovado(false);
        }
        if (prestador.getNivel() == null) {
            prestador.setNivel(NivelPrestador.BRONZE);
        }
        return completarAvaliacoes(prestadorRepository.save(prestador));
    }

    @Transactional
    public Prestador cadastrarCompleto(CadastroPrestadorRequest request) {
        Usuario usuario = usuarioService.criar(Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(request.getSenha())
                .tipoUsuario(TipoUsuario.PRESTADOR)
                .build());

        Prestador prestador = Prestador.builder()
                .categoria(request.getCategoria())
                .descricao(request.getDescricao())
                .qualificacao(request.getQualificacao())
                .cidade(request.getCidade())
                .telefone(request.getTelefone())
                .aprovado(false)
                .nivel(NivelPrestador.BRONZE)
                .usuario(usuario)
                .build();

        return completarAvaliacoes(prestadorRepository.save(prestador));
    }

    public List<Prestador> listarAprovados() {
        return completarAvaliacoes(prestadorRepository.findByAprovadoTrue());
    }

    public List<Prestador> listarTodos() {
        return completarAvaliacoes(prestadorRepository.findAll());
    }

    public List<Prestador> listarPendentes() {
        return completarAvaliacoes(prestadorRepository.findByAprovadoFalse());
    }

    public Prestador buscarPorId(Long id) {
        return completarAvaliacoes(prestadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador nao encontrado")));
    }

    public Prestador editar(Long id, Prestador prestadorAtualizado) {
        Prestador prestador = prestadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador nao encontrado"));
        prestador.setCategoria(prestadorAtualizado.getCategoria());
        prestador.setDescricao(prestadorAtualizado.getDescricao());
        prestador.setQualificacao(prestadorAtualizado.getQualificacao());
        prestador.setCidade(prestadorAtualizado.getCidade());
        prestador.setTelefone(prestadorAtualizado.getTelefone());
        if (prestadorAtualizado.getAprovado() != null) {
            prestador.setAprovado(prestadorAtualizado.getAprovado());
        }
        if (prestadorAtualizado.getNivel() != null) {
            prestador.setNivel(prestadorAtualizado.getNivel());
        }
        if (prestadorAtualizado.getUsuario() != null && prestadorAtualizado.getUsuario().getId() != null) {
            prestador.setUsuario(usuarioService.buscarPorId(prestadorAtualizado.getUsuario().getId()));
        }
        return completarAvaliacoes(prestadorRepository.save(prestador));
    }

    public Prestador aprovar(Long id) {
        Prestador prestador = prestadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador nao encontrado"));
        prestador.setAprovado(true);
        return completarAvaliacoes(prestadorRepository.save(prestador));
    }

    public Prestador reprovar(Long id) {
        Prestador prestador = prestadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador nao encontrado"));
        prestador.setAprovado(false);
        return completarAvaliacoes(prestadorRepository.save(prestador));
    }

    public void excluir(Long id) {
        buscarPorId(id);
        prestadorRepository.deleteById(id);
    }

    public List<Prestador> buscar(String categoria, String cidade) {
        boolean temCategoria = categoria != null && !categoria.isBlank();
        boolean temCidade = cidade != null && !cidade.isBlank();

        if (temCategoria && temCidade) {
            return completarAvaliacoes(prestadorRepository
                    .findByAprovadoTrueAndCategoriaContainingIgnoreCaseAndCidadeContainingIgnoreCase(categoria, cidade));
        }
        if (temCategoria) {
            return completarAvaliacoes(prestadorRepository.findByAprovadoTrueAndCategoriaContainingIgnoreCase(categoria));
        }
        if (temCidade) {
            return completarAvaliacoes(prestadorRepository.findByAprovadoTrueAndCidadeContainingIgnoreCase(cidade));
        }
        return listarAprovados();
    }

    private List<Prestador> completarAvaliacoes(List<Prestador> prestadores) {
        prestadores.forEach(this::completarAvaliacoes);
        return prestadores;
    }

    private Prestador completarAvaliacoes(Prestador prestador) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByPrestador(prestador);
        prestador.setQuantidadeAvaliacoes((long) avaliacoes.size());
        prestador.setMediaAvaliacoes(avaliacoes.stream()
                .map(Avaliacao::getNota)
                .filter(nota -> nota != null)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0));
        return prestador;
    }
}
