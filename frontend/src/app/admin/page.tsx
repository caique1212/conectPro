"use client";

import { useEffect, useState } from "react";
import { NivelBadge, StatusBadge } from "@/components/Badges";
import { InternalHeader } from "@/components/InternalHeader";
import { Message } from "@/components/Message";
import { api, Avaliacao, Prestador, Solicitacao, Usuario } from "@/services/api";
import { getUser } from "@/utils/auth";

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregar() {
    const [dadosUsuarios, dadosPrestadores, dadosSolicitacoes, dadosAvaliacoes] = await Promise.all([
      api.listarUsuarios(),
      api.listarTodosPrestadores(),
      api.listarSolicitacoes(),
      api.listarAvaliacoes(),
    ]);
    setUsuarios(dadosUsuarios);
    setPrestadores(dadosPrestadores);
    setSolicitacoes(dadosSolicitacoes);
    setAvaliacoes(dadosAvaliacoes);
  }

  async function executar(acao: () => Promise<unknown>, sucesso: string) {
    setMensagem("");
    setErro("");
    try {
      await acao();
      setMensagem(sucesso);
      await carregar();
    } catch {
      setErro("Nao foi possivel executar a acao administrativa.");
    }
  }

  useEffect(() => {
    const user = getUser();
    if (user?.tipoUsuario !== "ADMIN") return;
    carregar().catch(() => setErro("Nao foi possivel carregar o painel administrativo."));
  }, []);

  return (
    <div className="space-y-6">
      <InternalHeader title="Painel Administrativo" subtitle="Acompanhe usuários, prestadores, solicitações e avaliações da plataforma." allowed="ADMIN" />

      <section className="surface p-5">
        <button className="btn-primary" onClick={() => carregar().catch(() => setErro("Nao foi possivel atualizar."))}>Atualizar dados</button>
      </section>

      {mensagem && <Message type="success">{mensagem}</Message>}
      {erro && <Message type="error">{erro}</Message>}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Metric title="Usuários" value={usuarios.length} />
        <Metric title="Prestadores" value={prestadores.length} />
        <Metric title="Pendentes" value={prestadores.filter((prestador) => !prestador.aprovado).length} />
        <Metric title="Solicitações" value={solicitacoes.length} />
        <Metric title="Avaliações" value={avaliacoes.length} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Usuários</h2>
        {usuarios.length === 0 ? (
          <Message>Nenhum usuário cadastrado.</Message>
        ) : (
          <div className="grid gap-3">
            {usuarios.map((usuario) => (
              <article key={usuario.id} className="surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-white">{usuario.nome}</h3>
                    <p className="text-sm text-slate-400">ID {usuario.id} · {usuario.email} · {usuario.tipoUsuario}</p>
                  </div>
                  <button className="btn-danger" onClick={() => executar(() => api.deletarUsuario(String(usuario.id)), "Usuário excluído.")}>Excluir</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Prestadores</h2>
        {prestadores.length === 0 ? (
          <Message>Nenhum prestador cadastrado.</Message>
        ) : (
          <div className="grid gap-3">
            {prestadores.map((prestador) => (
              <article key={prestador.id} className="surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-white">{prestador.usuarioNome ?? "Prestador"}</h3>
                    <p className="text-sm text-slate-400">ID {prestador.id} · {prestador.categoria} · {prestador.cidade}</p>
                    <p className="mt-1 text-sm text-slate-300">Média {(prestador.mediaAvaliacoes ?? 0).toFixed(1)} · {prestador.quantidadeAvaliacoes ?? 0} avaliações</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${prestador.aprovado ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-200"}`}>
                      {prestador.aprovado ? "Aprovado" : "Pendente/Reprovado"}
                    </span>
                    <NivelBadge nivel={prestador.nivel} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-primary" onClick={() => executar(() => api.aprovarPrestador(prestador.id), "Prestador aprovado.")}>Aprovar</button>
                  <button className="btn-ghost" onClick={() => executar(() => api.reprovarPrestador(prestador.id), "Prestador reprovado.")}>Reprovar</button>
                  <button className="btn-danger" onClick={() => executar(() => api.deletarPrestador(String(prestador.id)), "Prestador excluído.")}>Excluir</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Solicitações</h2>
        {solicitacoes.length === 0 ? (
          <Message>Nenhuma solicitação criada.</Message>
        ) : (
          solicitacoes.map((solicitacao) => (
            <article key={solicitacao.id} className="surface p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-white">#{solicitacao.id} · {solicitacao.clienteNome} → {solicitacao.prestadorNome}</h3>
                  <p className="text-sm text-slate-300">{solicitacao.descricaoServico}</p>
                </div>
                <StatusBadge status={solicitacao.status} />
              </div>
            </article>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Avaliações</h2>
        {avaliacoes.length === 0 ? (
          <Message>Nenhuma avaliação registrada.</Message>
        ) : (
          avaliacoes.map((avaliacao) => (
            <article key={avaliacao.id} className="surface p-4">
              <h3 className="font-bold text-white">Nota {avaliacao.nota}/5 · {avaliacao.prestadorNome}</h3>
              <p className="mt-1 text-sm text-slate-300">{avaliacao.comentario}</p>
              <p className="mt-2 text-xs text-slate-500">Cliente: {avaliacao.clienteNome}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <article className="surface p-4">
      <p className="text-sm font-semibold text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </article>
  );
}
