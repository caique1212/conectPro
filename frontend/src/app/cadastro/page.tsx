"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/components/Message";
import { UserTypePicker } from "@/components/UserTypePicker";
import { api, TipoUsuario } from "@/services/api";
import { dashboardPath, saveUser } from "@/utils/auth";

type PublicCadastroTipo = Exclude<TipoUsuario, "ADMIN">;

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", tipoUsuario: "CLIENTE" as PublicCadastroTipo });
  const [erro, setErro] = useState("");

  async function cadastrar(event: FormEvent) {
    event.preventDefault();
    setErro("");
    try {
      const usuario = await api.criarUsuario(form);
      saveUser(usuario);
      router.push(dashboardPath(usuario.tipoUsuario));
    } catch {
      setErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
    }
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_440px]">
      <div>
        <p className="eyebrow text-fuchsia-300">Criar conta</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Comece agora no ConectaPro</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Cadastre-se como cliente para contratar ou como prestador para divulgar seus serviços após aprovação
          administrativa. O acesso administrativo não é criado pela tela pública.
        </p>
      </div>
      <form onSubmit={cadastrar} className="surface grid gap-4 p-6">
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
        <div className="grid gap-2">
          <span className="label">Tipo de usuário</span>
          <UserTypePicker
            value={form.tipoUsuario}
            onChange={(tipoUsuario) => {
              if (tipoUsuario !== "ADMIN") setForm({ ...form, tipoUsuario });
            }}
            options={["CLIENTE", "PRESTADOR"]}
          />
        </div>
        <button className="btn-primary">Cadastrar</button>
        {erro && <Message type="error">{erro}</Message>}
      </form>
    </section>
  );
}
