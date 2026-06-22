"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Message } from "@/components/Message";
import { NivelBadge } from "@/components/Badges";
import { api, Avaliacao, Prestador } from "@/services/api";

export default function PerfilPrestadorPage() {
  const params = useParams<{ id: string }>();
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [descricaoServico, setDescricaoServico] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregar() {
    const [dados, listaAvaliacoes] = await Promise.all([
      api.buscarPrestador(params.id),
      api.listarAvaliacoesPrestador(params.id),
    ]);
    setPrestador(dados);
    setAvaliacoes(listaAvaliacoes);
  }

  async function solicitar(event: FormEvent) {
    event.preventDefault();
    setMensagem("");
    setErro("");
    try {
      await api.criarSolicitacao(clienteId, params.id, descricaoServico);
      setMensagem("Solicitação enviada.");
      setClienteId("");
      setDescricaoServico("");
    } catch {
      setErro("Não foi possível enviar a solicitação.");
    }
  }

  useEffect(() => {
    carregar().catch(() => setErro("Não foi possível carregar o perfil."));
  }, [params.id]);

  if (!prestador) {
    return <Message>Carregando perfil...</Message>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <article className="surface p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Prestador verificado</p>
              <h1 className="mt-2 text-3xl font-black text-white">{prestador.usuarioNome}</h1>
              <p className="mt-1 text-slate-300">
                {prestador.categoria} em {prestador.cidade}
              </p>
            </div>
            <NivelBadge nivel={prestador.nivel} />
          </div>
          <p className="mt-5 leading-7 text-slate-300">{prestador.descricao}</p>
          <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <span>Telefone: {prestador.telefone}</span>
            <span>Média: {(prestador.mediaAvaliacoes ?? 0).toFixed(1)}</span>
            <span>Avaliações: {prestador.quantidadeAvaliacoes ?? 0}</span>
          </div>
        </article>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Avaliações</h2>
          {avaliacoes.length === 0 ? (
            <Message>Nenhuma avaliação cadastrada.</Message>
          ) : (
            avaliacoes.map((avaliacao) => (
              <article key={avaliacao.id} className="surface p-4">
                <p className="font-semibold text-white">Nota {avaliacao.nota}/5</p>
                <p className="mt-1 text-sm text-slate-300">{avaliacao.comentario}</p>
                <p className="mt-2 text-xs text-slate-500">Cliente: {avaliacao.clienteNome}</p>
              </article>
            ))
          )}
        </section>
      </section>

      <section className="surface p-5">
        <h2 className="text-xl font-bold text-white">Solicitar serviço</h2>
        <form onSubmit={solicitar} className="mt-4 grid gap-3">
          <label className="grid gap-1">
            <span className="label">ID do cliente</span>
            <input className="field" type="number" min="1" value={clienteId} onChange={(event) => setClienteId(event.target.value)} required />
          </label>
          <label className="grid gap-1">
            <span className="label">Descrição</span>
            <textarea className="field min-h-28" value={descricaoServico} onChange={(event) => setDescricaoServico(event.target.value)} required />
          </label>
          <button className="btn-primary">Enviar solicitação</button>
        </form>
        <div className="mt-4 grid gap-2">
          {mensagem && <Message type="success">{mensagem}</Message>}
          {erro && <Message type="error">{erro}</Message>}
        </div>
      </section>
    </div>
  );
}
