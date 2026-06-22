"use client";

import { FormEvent, useEffect, useState } from "react";
import { InternalHeader } from "@/components/InternalHeader";
import { Message } from "@/components/Message";
import { api, TipoUsuario, Usuario } from "@/services/api";

const vazio = { nome: "", email: "", senha: "", tipoUsuario: "CLIENTE" as TipoUsuario };

export default function CadastroUsuarioPage() {
  const [form, setForm] = useState(vazio);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editandoId, setEditandoId] = useState<string>("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregar() {
    setUsuarios(await api.listarUsuarios());
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();
    setMensagem("");
    setErro("");
    try {
      if (editandoId) {
        await api.atualizarUsuario(editandoId, form);
        setMensagem("Usuário atualizado.");
      } else {
        await api.criarUsuario(form);
        setMensagem("Usuário cadastrado.");
      }
      setForm(vazio);
      setEditandoId("");
      await carregar();
    } catch {
      setErro("Não foi possível salvar o usuário.");
    }
  }

  async function excluir(id: number) {
    setMensagem("");
    setErro("");
    try {
      await api.deletarUsuario(String(id));
      setMensagem("Usuário removido.");
      await carregar();
    } catch {
      setErro("Não foi possível remover o usuário.");
    }
  }

  useEffect(() => {
    carregar().catch(() => setErro("Não foi possível carregar usuários."));
  }, []);

  return (
    <div className="space-y-6">
      <InternalHeader title="Cadastro de Usuário" subtitle="Rota administrativa legada para manutenção de usuários." allowed="ADMIN" />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="surface p-5">
          <form onSubmit={salvar} className="grid gap-3">
            <label className="grid gap-1">
              <span className="label">Nome</span>
              <input className="field" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required />
            </label>
            <label className="grid gap-1">
              <span className="label">Email</span>
              <input className="field" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </label>
            <label className="grid gap-1">
              <span className="label">Senha</span>
              <input className="field" type="password" value={form.senha} onChange={(event) => setForm({ ...form, senha: event.target.value })} required />
            </label>
            <label className="grid gap-1">
              <span className="label">Tipo</span>
              <select className="field" value={form.tipoUsuario} onChange={(event) => setForm({ ...form, tipoUsuario: event.target.value as TipoUsuario })}>
                <option value="CLIENTE">CLIENTE</option>
                <option value="PRESTADOR">PRESTADOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
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
          <h2 className="text-2xl font-bold text-white">Usuários cadastrados</h2>
          <div className="grid gap-3">
            {usuarios.map((usuario) => (
              <article key={usuario.id} className="surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-white">{usuario.nome}</h3>
                    <p className="text-sm text-slate-400">{usuario.email} · {usuario.tipoUsuario}</p>
                    <p className="text-sm text-slate-500">ID: {usuario.id}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-ghost" onClick={() => { setEditandoId(String(usuario.id)); setForm({ nome: usuario.nome, email: usuario.email, senha: "", tipoUsuario: usuario.tipoUsuario }); }}>
                      Editar
                    </button>
                    <button className="btn-danger" onClick={() => excluir(usuario.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
