package com.conectPro.backend.Config;

import com.conectPro.backend.Enums.NivelPrestador;
import com.conectPro.backend.Enums.StatusSolicitacao;
import com.conectPro.backend.Enums.TipoUsuario;
import com.conectPro.backend.Model.Avaliacao;
import com.conectPro.backend.Model.Prestador;
import com.conectPro.backend.Model.SolicitacaoServico;
import com.conectPro.backend.Model.Usuario;
import com.conectPro.backend.Repository.AvaliacaoRepository;
import com.conectPro.backend.Repository.PrestadorRepository;
import com.conectPro.backend.Repository.SolicitacaoServicoRepository;
import com.conectPro.backend.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "demo.data.enabled", havingValue = "true")
public class DemoDataConfig implements ApplicationRunner {

    private static final String ADMIN_EMAIL = "admin@conectapro.com";
    private static final String DEMO_PASSWORD = "Demo@123";

    private final UsuarioRepository usuarioRepository;
    private final PrestadorRepository prestadorRepository;
    private final SolicitacaoServicoRepository solicitacaoRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (usuarioRepository.findByEmail("cliente1@conectapro.com").isPresent()) {
            return;
        }

        if (usuarioRepository.findByEmail(ADMIN_EMAIL).isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .nome("Administrador ConectaPro")
                    .email(ADMIN_EMAIL)
                    .senha("Admin@123")
                    .tipoUsuario(TipoUsuario.ADMIN)
                    .build());
        }

        List<Usuario> clientes = criarClientes();
        List<Prestador> prestadores = criarPrestadores();
        criarHistorico(clientes, prestadores);
    }

    private List<Usuario> criarClientes() {
        String[] nomes = {
                "Ana Souza", "Bruno Lima", "Carla Mendes", "Diego Alves", "Eduarda Rocha",
                "Felipe Santos", "Gabriela Costa", "Henrique Oliveira", "Isabela Martins", "Joao Ribeiro"
        };

        List<Usuario> clientes = new ArrayList<>();
        for (int i = 0; i < nomes.length; i++) {
            clientes.add(usuarioRepository.save(Usuario.builder()
                    .nome(nomes[i])
                    .email("cliente" + (i + 1) + "@conectapro.com")
                    .senha(DEMO_PASSWORD)
                    .tipoUsuario(TipoUsuario.CLIENTE)
                    .build()));
        }
        return clientes;
    }

    private List<Prestador> criarPrestadores() {
        String[][] dados = {
                {"Carlos Eletrica", "Eletricista", "Tecnico em eletrotecnica, NR10 e 12 anos de experiencia", "Instalacoes, reparos e manutencao eletrica residencial.", "Sao Paulo", "11990000001"},
                {"Marcos Hidraulica", "Encanador", "Encanador profissional com 9 anos de experiencia", "Vazamentos, instalacoes hidraulicas e desentupimentos.", "Sao Paulo", "11990000002"},
                {"Luciana Clima", "Climatizacao", "Tecnica em refrigeracao certificada", "Instalacao e manutencao de ar-condicionado.", "Campinas", "19990000003"},
                {"Rafael Pinturas", "Pintor", "Especialista em pintura residencial e acabamento fino", "Pintura interna, externa e pequenos reparos.", "Santos", "13990000004"},
                {"Paulo Manutencao", "Manutencao", "Tecnico de manutencao predial com 15 anos de experiencia", "Manutencao preventiva e corretiva residencial.", "Osasco", "11990000005"},
                {"Fernanda Reformas", "Reformas", "Arquiteta e coordenadora de pequenas reformas", "Reformas de cozinhas, banheiros e ambientes residenciais.", "Guarulhos", "11990000006"},
                {"Roberto Gas", "Gasista", "Instalador de gas credenciado", "Instalacao, teste de estanqueidade e manutencao.", "Sao Bernardo do Campo", "11990000007"},
                {"Patricia Limpeza", "Limpeza Tecnica", "Especialista em limpeza pos-obra", "Limpeza tecnica, pos-obra e higienizacao profunda.", "Santo Andre", "11990000008"},
                {"Leandro Solar", "Energia Solar", "Tecnico em sistemas fotovoltaicos", "Projetos e manutencao de sistemas de energia solar.", "Sorocaba", "15990000009"},
                {"Renata Seguranca", "Seguranca Eletronica", "Tecnica em CFTV e alarmes", "Instalacao de cameras, alarmes e controle de acesso.", "Jundiai", "11990000010"}
        };

        List<Prestador> prestadores = new ArrayList<>();
        for (int i = 0; i < dados.length; i++) {
            Usuario usuario = usuarioRepository.save(Usuario.builder()
                    .nome(dados[i][0])
                    .email("prestador" + (i + 1) + "@conectapro.com")
                    .senha(DEMO_PASSWORD)
                    .tipoUsuario(TipoUsuario.PRESTADOR)
                    .build());

            prestadores.add(prestadorRepository.save(Prestador.builder()
                    .categoria(dados[i][1])
                    .qualificacao(dados[i][2])
                    .descricao(dados[i][3])
                    .cidade(dados[i][4])
                    .telefone(dados[i][5])
                    .aprovado(i < 8)
                    .nivel(i < 2 ? NivelPrestador.OURO : i < 5 ? NivelPrestador.PRATA : NivelPrestador.BRONZE)
                    .usuario(usuario)
                    .build()));
        }
        return prestadores;
    }

    private void criarHistorico(List<Usuario> clientes, List<Prestador> prestadores) {
        LocalDateTime agora = LocalDateTime.now();
        SolicitacaoServico[] solicitacoes = {
                solicitacao(clientes.get(0), prestadores.get(0), "Troca do quadro eletrico do apartamento", StatusSolicitacao.FINALIZADO, agora.minusDays(35)),
                solicitacao(clientes.get(1), prestadores.get(1), "Conserto de vazamento na cozinha", StatusSolicitacao.FINALIZADO, agora.minusDays(28)),
                solicitacao(clientes.get(2), prestadores.get(2), "Limpeza e manutencao de dois aparelhos", StatusSolicitacao.FINALIZADO, agora.minusDays(20)),
                solicitacao(clientes.get(3), prestadores.get(3), "Pintura completa de um quarto", StatusSolicitacao.FINALIZADO, agora.minusDays(15)),
                solicitacao(clientes.get(4), prestadores.get(4), "Revisao preventiva da residencia", StatusSolicitacao.FINALIZADO, agora.minusDays(10)),
                solicitacao(clientes.get(5), prestadores.get(5), "Orcamento para reforma do banheiro", StatusSolicitacao.ACEITO, agora.minusDays(4)),
                solicitacao(clientes.get(6), prestadores.get(6), "Verificacao de possivel vazamento de gas", StatusSolicitacao.ACEITO, agora.minusDays(2)),
                solicitacao(clientes.get(7), prestadores.get(7), "Limpeza pos-obra de apartamento", StatusSolicitacao.PENDENTE, agora.minusDays(1)),
                solicitacao(clientes.get(8), prestadores.get(0), "Instalacao de novas tomadas", StatusSolicitacao.PENDENTE, agora.minusHours(10)),
                solicitacao(clientes.get(9), prestadores.get(1), "Desentupimento emergencial", StatusSolicitacao.RECUSADO, agora.minusDays(3)),
                solicitacao(clientes.get(0), prestadores.get(2), "Instalacao de ar-condicionado", StatusSolicitacao.FINALIZADO, agora.minusDays(8)),
                solicitacao(clientes.get(1), prestadores.get(0), "Troca de disjuntor", StatusSolicitacao.FINALIZADO, agora.minusDays(6))
        };

        solicitacaoRepository.saveAll(List.of(solicitacoes));

        avaliacaoRepository.saveAll(List.of(
                avaliacao(solicitacoes[0], 5, "Servico excelente, muito organizado e pontual.", agora.minusDays(33)),
                avaliacao(solicitacoes[1], 4, "Resolveu o vazamento rapidamente.", agora.minusDays(27)),
                avaliacao(solicitacoes[2], 5, "Atendimento profissional e aparelhos funcionando perfeitamente.", agora.minusDays(19)),
                avaliacao(solicitacoes[3], 4, "Otimo acabamento e ambiente limpo ao final.", agora.minusDays(14)),
                avaliacao(solicitacoes[4], 5, "Revisao completa e explicacoes muito claras.", agora.minusDays(9)),
                avaliacao(solicitacoes[10], 5, "Instalacao muito bem feita.", agora.minusDays(7)),
                avaliacao(solicitacoes[11], 5, "Rapido, educado e eficiente.", agora.minusDays(5))
        ));
    }

    private SolicitacaoServico solicitacao(Usuario cliente, Prestador prestador, String descricao,
                                           StatusSolicitacao status, LocalDateTime data) {
        return SolicitacaoServico.builder()
                .cliente(cliente)
                .prestador(prestador)
                .descricaoServico(descricao)
                .status(status)
                .dataSolicitacao(data)
                .build();
    }

    private Avaliacao avaliacao(SolicitacaoServico solicitacao, int nota, String comentario, LocalDateTime data) {
        return Avaliacao.builder()
                .cliente(solicitacao.getCliente())
                .prestador(solicitacao.getPrestador())
                .nota(nota)
                .comentario(comentario)
                .dataAvaliacao(data)
                .build();
    }
}
