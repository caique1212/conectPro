package com.conectPro.backend.Controller;

import com.conectPro.backend.DTO.CadastroPrestadorRequest;
import com.conectPro.backend.DTO.PrestadorRequest;
import com.conectPro.backend.DTO.PrestadorResponse;
import com.conectPro.backend.Model.Prestador;
import com.conectPro.backend.Model.Usuario;
import com.conectPro.backend.Service.PrestadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prestadores")
@RequiredArgsConstructor
public class PrestadorController {
    private final PrestadorService prestadorService;

    @PostMapping
    public PrestadorResponse criar(@RequestBody PrestadorRequest request) {
        return PrestadorResponse.fromEntity(prestadorService.criar(toEntity(request)));
    }

    @PostMapping("/cadastro")
    public PrestadorResponse cadastrarCompleto(@RequestBody CadastroPrestadorRequest request) {
        return PrestadorResponse.fromEntity(prestadorService.cadastrarCompleto(request));
    }

    @GetMapping
    public List<PrestadorResponse> listarAprovados() {
        return prestadorService.listarAprovados().stream()
                .map(PrestadorResponse::fromEntity)
                .toList();
    }

    @GetMapping("/todos")
    public List<PrestadorResponse> listarTodos() {
        return prestadorService.listarTodos().stream()
                .map(PrestadorResponse::fromEntity)
                .toList();
    }

    @GetMapping("/pendentes")
    public List<PrestadorResponse> listarPendentes() {
        return prestadorService.listarPendentes().stream()
                .map(PrestadorResponse::fromEntity)
                .toList();
    }

    @GetMapping("/buscar")
    public List<PrestadorResponse> buscar(@RequestParam(required = false) String categoria,
                                          @RequestParam(required = false) String cidade) {
        return prestadorService.buscar(categoria, cidade).stream()
                .map(PrestadorResponse::fromEntity)
                .toList();
    }

    @GetMapping("/{id}")
    public PrestadorResponse buscarPorId(@PathVariable Long id) {
        return PrestadorResponse.fromEntity(prestadorService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public PrestadorResponse editar(@PathVariable Long id, @RequestBody PrestadorRequest request) {
        return PrestadorResponse.fromEntity(prestadorService.editar(id, toEntity(request)));
    }

    @PutMapping("/{id}/aprovar")
    public PrestadorResponse aprovar(@PathVariable Long id) {
        return PrestadorResponse.fromEntity(prestadorService.aprovar(id));
    }

    @PutMapping("/{id}/reprovar")
    public PrestadorResponse reprovar(@PathVariable Long id) {
        return PrestadorResponse.fromEntity(prestadorService.reprovar(id));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        prestadorService.excluir(id);
    }

    private Prestador toEntity(PrestadorRequest request) {
        Usuario usuario = null;
        if (request.getUsuarioId() != null) {
            usuario = Usuario.builder().id(request.getUsuarioId()).build();
        }

        return Prestador.builder()
                .categoria(request.getCategoria())
                .descricao(request.getDescricao())
                .qualificacao(request.getQualificacao())
                .cidade(request.getCidade())
                .telefone(request.getTelefone())
                .aprovado(request.getAprovado())
                .nivel(request.getNivel())
                .usuario(usuario)
                .build();
    }
}
