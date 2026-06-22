"use client";

import { FormEvent, useEffect, useState } from "react";
import { NivelBadge, StatusBadge } from "@/components/Badges";
import { InternalHeader } from "@/components/InternalHeader";
import { Message } from "@/components/Message";
import { api, Prestador, Solicitacao } from "@/services/api";
import { AuthUser, getUser } from "@/utils/auth";

export default function ClientePage() {
  const [cliente, setCliente] = useState<AuthUser | null>(null);
  const [clienteId, setClienteId] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cidade, setCidade] = useState("");
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [descricaoPorPrestador, setDescricaoPorPrestador] = useState<Record<number, string>>({});
  const [avaliacao, setAvaliacao] = useState<Record<number, { nota: string; comentario: string }>>({});
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarSolicitacoes(id = clienteId) {
    if (!id) return;
    setErro("");
    try {
      setSolicitacoes(await api.listarSolicitacoesCliente(id));
    } catch {
      setErro("Não foi possível carregar as solicitações do cliente.");
    }
  }

  useEffect(() => {
    const user = getUser();
    if (user?.tipoUsuario === "CLIENTE") {
      const id = String(user.id);
      setCliente(user);
      setClienteId(id);
      carregarSolicitacoes(id);
    }
  }, []);

  async function buscar(event?: FormEvent) {
    event?.preventDefault();
    setErro("");
    try {
      setPrestadores(await api.buscarPrestadores(categoria, cidade));
    } catch {
      setErro("Não foi possível buscar prestadores.");
    }
  }

  async function solicitar(prestadorId: number) {
    const descricao = descricaoPorPrestador[prestadorId] ?? "";
    setMensagem("");
    setErro("");
    try {
      await api.criarSolicitacao(clienteId, String(prestadorId), descricao);
      setDescricaoPorPrestador({ ...descricaoPorPrestador, [prestadorId]: "" });
      setMensagem("Solicitação enviada ao prestador.");
      await carregarSolicitacoes();
    } catch {
      setErro("Informe uma descrição para solicitar o serviço.");
    }
  }

  async function avaliar(solicitacao: Solicitacao) {
    const dados = avaliacao[solicitacao.id] ?? { nota: "5", comentario: "" };
    setMensagem("");
    setErro("");
    try {
      await api.criarAvaliacaoPorSolicitacao(solicitacao.id, Number(dados.nota), dados.comentario);
      setMensagem("Avaliação registrada.");
      setAvaliacao({ ...avaliacao, [solicitacao.id]: { nota: "5", comentario: "" } });
      await carregarSolicitacoes();
    } catch {
      setErro("A avaliação só pode ser enviada para solicitações finalizadas.");
    }
  }

  const finalizadas = solicitacoes.filter((solicitacao) => solicitacao.status === "FINALIZADO");

  return (
    <div className="space-y-6">
      <InternalHeader title="Dashboard Cliente" subtitle="Busque prestadores aprovados, solicite serviços e avalie apenas solicitações finalizadas." allowed="CLIENTE" />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <article className="surface p-5">
          <h2 className="text-xl font-bold text-white">Minha conta</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>
              <span className="font-semibold text-slate-100">Nome:</span> {cliente?.nome ?? "Cliente"}
            </p>
            <p>
              <span className="font-semibold text-slate-100">Email:</span> {cliente?.email ?? "-"}
            </p>
            <p>
              <span className="font-semibold text-slate-100">ID:</span> {clienteId || "-"}
            </p>
          </div>
          <button className="btn-ghost mt-5 w-full" onClick={() => carregarSolicitacoes()}>
            Atualizar minhas solicitações
          </button>
        </article>

        <article className="surface p-5">
          <h2 className="text-xl font-bold text-white">Buscar Prestadores</h2>
          <form onSubmit={buscar} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <input className="field" value={categoria} onChange={(event) => setCategoria(event.target.value)} placeholder="Categoria" />
            <input className="field" value={cidade} onChange={(event) => setCidade(event.target.value)} placeholder="Cidade" />
            <button className="btn-primary">Buscar</button>
          </form>
        </article>
      </section>

      {mensagem && <Message type="success">{mensagem}</Message>}
      {erro && <Message type="error">{erro}</Message>}

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Prestadores encontrados</h2>
        {prestadores.length === 0 ? (
          <Message>Use a busca para encontrar prestadores aprovados.</Message>
        ) : (
          <div className="grid gap-4">
            {prestadores.map((prestador) => (
              <article key={prestador.id} className="surface p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-white">{prestador.usuarioNome}</h3>
                    <p className="text-sm text-slate-300">
                      {prestador.categoria} em {prestador.cidade}
                    </p>
                  </div>
                  <NivelBadge nivel={prestador.nivel} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{prestador.descricao}</p>
                <p className="mt-2 text-sm text-slate-400">
                  Média {(prestador.mediaAvaliacoes ?? 0).toFixed(1)} · {prestador.quantidadeAvaliacoes ?? 0} avaliações
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input className="field" value={descricaoPorPrestador[prestador.id] ?? ""} onChange={(event) => setDescricaoPorPrestador({ ...descricaoPorPrestador, [prestador.id]: event.target.value })} placeholder="Descreva o serviço" />
                  <button className="btn-primary" onClick={() => solicitar(prestador.id)}>
                    Solicitar serviço
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Minhas Solicitações</h2>
        {solicitacoes.length === 0 ? (
          <Message>Você ainda não possui solicitações.</Message>
        ) : (
          solicitacoes.map((solicitacao) => (
            <article key={solicitacao.id} className="surface p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-white">
                    #{solicitacao.id} · {solicitacao.prestadorNome}
                  </h3>
                  <p className="text-sm text-slate-300">{solicitacao.descricaoServico}</p>
                </div>
                <StatusBadge status={solicitacao.status} />
              </div>
            </article>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Serviços Finalizados e Avaliações</h2>
        {finalizadas.length === 0 ? (
          <Message>Quando um prestador finalizar um serviço, a avaliação aparecerá aqui.</Message>
        ) : (
          finalizadas.map((solicitacao) => {
            const dados = avaliacao[solicitacao.id] ?? { nota: "5", comentario: "" };
            return (
              <article key={solicitacao.id} className="surface p-4">
                <h3 className="font-bold text-white">Avaliar {solicitacao.prestadorNome}</h3>
                <p className="mt-1 text-sm text-slate-300">{solicitacao.descricaoServico}</p>
                <div className="mt-4 grid gap-2 md:grid-cols-[120px_1fr_auto]">
                  <select className="field" value={dados.nota} onChange={(event) => setAvaliacao({ ...avaliacao, [solicitacao.id]: { ...dados, nota: event.target.value } })}>
                    {[1, 2, 3, 4, 5].map((nota) => (
                      <option key={nota} value={nota}>
                        {nota}
                      </option>
                    ))}
                  </select>
                  <input className="field" value={dados.comentario} onChange={(event) => setAvaliacao({ ...avaliacao, [solicitacao.id]: { ...dados, comentario: event.target.value } })} placeholder="Comentário da avaliação" />
                  <button className="btn-primary" onClick={() => avaliar(solicitacao)}>
                    Enviar avaliação
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
