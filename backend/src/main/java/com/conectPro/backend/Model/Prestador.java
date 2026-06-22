package com.conectPro.backend.Model;

import com.conectPro.backend.Enums.NivelPrestador;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prestador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String categoria;

    private String descricao;

    private String cidade;

    private String telefone;

    @Builder.Default
    private Boolean aprovado = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private NivelPrestador nivel = NivelPrestador.BRONZE;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Transient
    private Double mediaAvaliacoes;

    @Transient
    private Long quantidadeAvaliacoes;

}
