"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/components/Message";
import { UserTypePicker } from "@/components/UserTypePicker";
import { api, TipoUsuario } from "@/services/api";
import { ADMIN_MASTER, dashboardPath, isAdminMasterLogin, saveUser } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("CLIENTE");
  const [erro, setErro] = useState("");

  async function entrar(event: FormEvent) {
    event.preventDefault();
    setErro("");

    if (tipoUsuario === "ADMIN") {
      if (!isAdminMasterLogin(email, senha)) {
        setErro("Credenciais administrativas inválidas.");
        return;
      }

      saveUser(ADMIN_MASTER);
      router.push("/admin");
      return;
    }

    try {
      const usuario = await api.login(email, senha);
      const usuarioLogado = { ...usuario, tipoUsuario };
      saveUser(usuarioLogado);
      router.push(dashboardPath(tipoUsuario));
    } catch {
      setErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
    }
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="eyebrow">Acesso seguro</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Entrar no ConectaPro</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Clientes e prestadores seguem o fluxo do backend. O acesso ADMIN usa uma credencial master temporária para
          apresentação do MVP.
        </p>
      </div>

      <form onSubmit={entrar} className="surface grid gap-4 p-6">
        <label className="grid gap-1">
          <span className="label">Email</span>
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="grid gap-1">
          <span className="label">Senha</span>
          <input className="field" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required />
        </label>
        <div className="grid gap-2">
          <span className="label">Tipo de usuário</span>
          <UserTypePicker value={tipoUsuario} onChange={setTipoUsuario} options={["CLIENTE", "PRESTADOR", "ADMIN"]} />
        </div>
        <button className="btn-primary">Entrar</button>
        {erro && <Message type="error">{erro}</Message>}
      </form>
    </section>
  );
}
