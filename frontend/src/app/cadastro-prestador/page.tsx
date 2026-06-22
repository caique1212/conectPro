"use client";

import { FormEvent, useEffect, useState } from "react";
import { InternalHeader } from "@/components/InternalHeader";
import { Message } from "@/components/Message";
import { PrestadorCard } from "@/components/PrestadorCard";
import { api, Prestador } from "@/services/api";

const vazio = { categoria: "", descricao: "", cidade: "", telefone: "", usuarioId: "" };

export default function CadastroPrestadorPage() {
  const [form, setForm] = useState(vazio);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [editandoId, setEditandoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregar() {
    setPrestadores(await api.listarTodosPrestadores());
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();
    setMensagem("");
    setErro("");
    try {
      const payload = { ...form, usuarioId: Number(form.usuarioId) };
      if (editandoId) {
        await api.atualizarPrestador(editandoId, payload);
        setMensagem("Prestador atualizado.");
      } else {
        await api.criarPrestador(payload);
        setMensagem("Prestador cadastrado.");
      }
      setForm(vazio);
      setEditandoId("");
      await carregar();
    } catch {
      setErro("Não foi possível salvar o prestador.");
    }
  }

  async function excluir(id: number) {
    setMensagem("");
    setErro("");
    try {
      await api.deletarPrestador(String(id));
      setMensagem("Prestador removido.");
      await carregar();
    } catch {
      setErro("Não foi possível remover o prestador.");
    }
  }

  useEffect(() => {
    carregar().catch(() => setErro("Não foi possível carregar prestadores."));
  }, []);

  return (
    <div className="space-y-6">
      <InternalHeader title="Cadastro de Prestador" subtitle="Rota administrativa legada para manutenção de prestadores." allowed="ADMIN" />

      <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
        <section className="surface p-5">
          <form onSubmit={salvar} className="grid gap-3">
            <label className="grid gap-1">
              <span className="label">Categoria</span>
              <input className="field" value={form.categoria} onChange={(event) => setForm({ ...form, categoria: event.target.value })} required />
            </label>
            <label className="grid gap-1">
              <span className="label">Descrição</span>
              <textarea className="field min-h-24" value={form.descricao} onChange={(event) => setForm({ ...form, descricao: event.target.value })} required />
            </label>
            <label className="grid gap-1">
              <span className="label">Cidade</span>
              <input className="field" value={form.cidade} onChange={(event) => setForm({ ...form, cidade: event.target.value })} required />
            </label>
            <label className="grid gap-1">
              <span className="label">Telefone</span>
              <input className="field" value={form.telefone} onChange={(event) => setForm({ ...form, telefone: event.target.value })} required />
            </label>
            <label className="grid gap-1">
              <span className="label">ID do usuário</span>
              <input className="field" type="number" min="1" value={form.usuarioId} onChange={(event) => setForm({ ...form, usuarioId: event.target.value })} required />
            </label>
            <button className="btn-primary">{editandoId ? "Atualizar" : "Cadastrar"}</button>
            {editandoId && (
              <button type="button" className="btn-ghost" onClick={() => { setEditandoId(""); setForm(vazio); }}>
                Cancelar edição
              </button>
            )}
          </form>
          <div className="mt-4 grid gap-2">
            {mensagem && <Message type="success">{mensagem}</Message>}
            {erro && <Message type="error">{erro}</Message>}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Prestadores cadastrados</h2>
          <div className="grid gap-3">
            {prestadores.map((prestador) => (
              <div key={prestador.id} className="space-y-2">
                <PrestadorCard prestador={prestador} showAdminStatus />
                <div className="flex flex-wrap gap-2">
                  <button className="btn-ghost" onClick={() => { setEditandoId(String(prestador.id)); setForm({ categoria: prestador.categoria, descricao: prestador.descricao, cidade: prestador.cidade, telefone: prestador.telefone, usuarioId: String(prestador.usuarioId) }); }}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => excluir(prestador.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
