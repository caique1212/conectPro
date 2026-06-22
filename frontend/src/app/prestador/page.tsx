"use client";

import { FormEvent, useEffect, useState } from "react";
import { NivelBadge, StatusBadge } from "@/components/Badges";
import { InternalHeader } from "@/components/InternalHeader";
import { Message } from "@/components/Message";
import { api, Avaliacao, Prestador, Solicitacao, StatusSolicitacao } from "@/services/api";
import { AuthUser, getUser } from "@/utils/auth";

const cadastroVazio = { categoria: "", descricao: "", cidade: "", telefone: "", usuarioId: "" };

export default function PrestadorDashboardPage() {
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [prestadorId, setPrestadorId] = useState("");
  const [cadastro, setCadastro] = useState(cadastroVazio);
  const [perfil, setPerfil] = useState<Prestador | null>(null);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarPorId(id: string) {
    if (!id) return;
    setMensagem("");
    setErro("");
    try {
      const [dadosPerfil, dadosSolicitacoes, dadosAvaliacoes] = await Promise.all([
        api.buscarPrestador(id),
        api.listarSolicitacoesPrestador(id),
        api.listarAvaliacoesPrestador(id),
      ]);
      setPerfil(dadosPerfil);
      setSolicitacoes(dadosSolicitacoes);
      setAvaliacoes(dadosAvaliacoes);
    } catch {
      setErro("Não foi possível carregar os dados do prestador.");
    }
  }

  async function detectarPerfil(user: AuthUser) {
    setCadastro((atual) => ({ ...atual, usuarioId: String(user.id) }));
    try {
      const prestadores = await api.listarTodosPrestadores();
      const encontrado = prestadores.find((prestador) => prestador.usuarioId === user.id);
      if (encontrado) {
        const id = String(encontrado.id);
        setPrestadorId(id);
        await carregarPorId(id);
      }
    } catch {
      setErro("Não foi possível verificar seu perfil profissional.");
    }
  }

  useEffect(() => {
    const user = getUser();
    if (user?.tipoUsuario === "PRESTADOR") {
      setUsuario(user);
      detectarPerfil(user);
    }
  }, []);

  async function cadastrar(event: FormEvent) {
    event.preventDefault();
    setMensagem("");
    setErro("");
    try {
      const criado = await api.criarPrestador({ ...cadastro, usuarioId: Number(cadastro.usuarioId) });
      const id = String(criado.id);
      setPrestadorId(id);
      setCadastro(cadastroVazio);
      setMensagem(`Perfil profissional criado. ID: ${criado.id}. Aguarde aprovação administrativa.`);
      await carregarPorId(id);
    } catch {
      setErro("Não foi possível cadastrar o perfil profissional.");
    }
  }

  async function alterarStatus(id: number, status: StatusSolicitacao) {
    setMensagem("");
    setErro("");
    try {
      await api.alterarStatus(id, status);
      setMensagem(`Solicitação marcada como ${status}.`);
      await carregarPorId(prestadorId);
    } catch {
      setErro("Não foi possível alterar a solicitação.");
    }
  }

  return (
    <div className="space-y-6">
      <InternalHeader title="Dashboard Prestador" subtitle="Gerencie seu perfil profissional, solicitações recebidas e avaliações." allowed="PRESTADOR" />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <article className="surface p-5">
          <h2 className="text-xl font-bold text-white">Minha conta</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>
              <span className="font-semibold text-slate-100">Nome:</span> {usuario?.nome ?? "Prestador"}
            </p>
            <p>
              <span className="font-semibold text-slate-100">Email:</span> {usuario?.email ?? "-"}
            </p>
            <p>
              <span className="font-semibold text-slate-100">ID do perfil:</span> {prestadorId || "Ainda não criado"}
            </p>
          </div>
          {prestadorId && (
            <button className="btn-ghost mt-5 w-full" onClick={() => carregarPorId(prestadorId)}>
              Atualizar painel
            </button>
          )}
        </article>

        <article className="surface p-5">
          <h2 className="text-xl font-bold text-white">{perfil ? "Meu Perfil Profissional" : "Completar perfil profissional"}</h2>
          {perfil ? (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${perfil.aprovado ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-200"}`}>
                  {perfil.aprovado ? "Aprovado" : "Pendente"}
                </span>
                <NivelBadge nivel={perfil.nivel} />
              </div>
              <h3 className="text-lg font-bold text-white">{perfil.usuarioNome}</h3>
              <p className="text-slate-300">
                {perfil.categoria} em {perfil.cidade}
              </p>
              <p className="text-sm text-slate-400">{perfil.descricao}</p>
              <p className="text-sm text-slate-300">
                Média {(perfil.mediaAvaliacoes ?? 0).toFixed(1)} · {perfil.quantidadeAvaliacoes ?? 0} avaliações
              </p>
            </div>
          ) : (
            <form onSubmit={cadastrar} className="mt-4 grid gap-3">
              <input className="field" value={cadastro.categoria} onChange={(event) => setCadastro({ ...cadastro, categoria: event.target.value })} placeholder="Categoria" required />
              <textarea className="field min-h-24" value={cadastro.descricao} onChange={(event) => setCadastro({ ...cadastro, descricao: event.target.value })} placeholder="Descrição" required />
              <input className="field" value={cadastro.cidade} onChange={(event) => setCadastro({ ...cadastro, cidade: event.target.value })} placeholder="Cidade" required />
              <input className="field" value={cadastro.telefone} onChange={(event) => setCadastro({ ...cadastro, telefone: event.target.value })} placeholder="Telefone" required />
              <button className="btn-secondary">Enviar para aprovação</button>
            </form>
          )}
        </article>
      </section>

      {mensagem && <Message type="success">{mensagem}</Message>}
      {erro && <Message type="error">{erro}</Message>}

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Solicitações Recebidas</h2>
        {solicitacoes.length === 0 ? (
          <Message>Nenhuma solicitação recebida.</Message>
        ) : (
          solicitacoes.map((solicitacao) => (
            <article key={solicitacao.id} className="surface p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-white">
                    #{solicitacao.id} · {solicitacao.clienteNome}
                  </h3>
                  <p className="text-sm text-slate-300">{solicitacao.descricaoServico}</p>
                </div>
                <StatusBadge status={solicitacao.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-primary" onClick={() => alterarStatus(solicitacao.id, "ACEITO")}>
                  Aceitar
                </button>
                <button className="btn-danger" onClick={() => alterarStatus(solicitacao.id, "RECUSADO")}>
                  Recusar
                </button>
                <button className="btn-secondary" onClick={() => alterarStatus(solicitacao.id, "FINALIZADO")}>
                  Finalizar
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Avaliações Recebidas</h2>
        {avaliacoes.length === 0 ? (
          <Message>Nenhuma avaliação recebida.</Message>
        ) : (
          avaliacoes.map((avaliacao) => (
            <article key={avaliacao.id} className="surface p-4">
              <p className="font-bold text-white">Nota {avaliacao.nota}/5</p>
              <p className="mt-1 text-sm text-slate-300">{avaliacao.comentario}</p>
              <p className="mt-2 text-xs text-slate-500">Cliente: {avaliacao.clienteNome}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
