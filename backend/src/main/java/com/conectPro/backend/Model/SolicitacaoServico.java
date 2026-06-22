package com.conectPro.backend.Model;

import com.conectPro.backend.Enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitacaoServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricaoServico;

    private LocalDateTime dataSolicitacao;

    @Enumerated(EnumType.STRING)
    private StatusSolicitacao status;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "prestador_id")
    private Prestador prestador;

}