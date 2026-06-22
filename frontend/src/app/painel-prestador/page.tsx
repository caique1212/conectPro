"use client";

import { FormEvent, useState } from "react";
import { StatusBadge } from "@/components/Badges";
import { InternalHeader } from "@/components/InternalHeader";
import { Message } from "@/components/Message";
import { api, Solicitacao, StatusSolicitacao } from "@/services/api";

export default function PainelPrestadorPage() {
  const [prestadorId, setPrestadorId] = useState("");
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregar(event?: FormEvent) {
    event?.preventDefault();
    setMensagem("");
    setErro("");
    try {
      setSolicitacoes(await api.listarSolicitacoesPrestador(prestadorId));
    } catch {
      setErro("Não foi possível carregar solicitações.");
    }
  }

  async function alterarStatus(id: number, status: StatusSolicitacao) {
    setMensagem("");
    setErro("");
    try {
      await api.alterarStatus(id, status);
      setMensagem(`Solicitação marcada como ${status}.`);
      await carregar();
    } catch {
      setErro("Não foi possível alterar o status.");
    }
  }

  return (
    <div className="space-y-6">
      <InternalHeader title="Painel do Prestador" subtitle="Atalho legado para gerenciar solicitações recebidas." allowed="PRESTADOR" />

      <section className="surface p-5">
        <form onSubmit={carregar} className="flex flex-col gap-3 sm:flex-row">
          <input className="field sm:max-w-xs" type="number" min="1" value={prestadorId} onChange={(event) => setPrestadorId(event.target.value)} placeholder="ID do prestador" required />
          <button className="btn-primary">Carregar solicitações</button>
        </form>
      </section>

      {mensagem && <Message type="success">{mensagem}</Message>}
      {erro && <Message type="error">{erro}</Message>}

      <section className="grid gap-3">
        {solicitacoes.length === 0 ? (
          <Message>Nenhuma solicitação carregada.</Message>
        ) : (
          solicitacoes.map((solicitacao) => (
            <article key={solicitacao.id} className="surface p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-bold text-white">Solicitação #{solicitacao.id}</h2>
                  <p className="text-sm text-slate-400">Cliente: {solicitacao.clienteNome}</p>
                  <p className="mt-2 text-sm text-slate-300">{solicitacao.descricaoServico}</p>
                </div>
                <StatusBadge status={solicitacao.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-primary" onClick={() => alterarStatus(solicitacao.id, "ACEITO")}>Aceitar</button>
                <button className="btn-danger" onClick={() => alterarStatus(solicitacao.id, "RECUSADO")}>Recusar</button>
                <button className="btn-secondary" onClick={() => alterarStatus(solicitacao.id, "FINALIZADO")}>Finalizar</button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
