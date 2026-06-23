"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/components/Message";
import { UserTypePicker } from "@/components/UserTypePicker";
import { api, TipoUsuario } from "@/services/api";
import { dashboardPath, saveUser } from "@/utils/auth";

type PublicCadastroTipo = Exclude<TipoUsuario, "ADMIN">;

const initialForm = {
  nome: "",
  email: "",
  senha: "",
  tipoUsuario: "CLIENTE" as PublicCadastroTipo,
  categoria: "",
  descricao: "",
  qualificacao: "",
  cidade: "",
  telefone: "",
};

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function cadastrar(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      if (form.tipoUsuario === "PRESTADOR") {
        const prestador = await api.cadastrarPrestadorCompleto({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          categoria: form.categoria,
          descricao: form.descricao,
          qualificacao: form.qualificacao,
          cidade: form.cidade,
          telefone: form.telefone,
        });

        saveUser({
          id: prestador.usuarioId,
          nome: prestador.usuarioNome,
          email: prestador.usuarioEmail,
          tipoUsuario: "PRESTADOR",
        });
        router.push("/prestador");
        return;
      }

      const usuario = await api.criarUsuario({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipoUsuario: "CLIENTE",
      });
      saveUser(usuario);
      router.push(dashboardPath(usuario.tipoUsuario));
    } catch {
      setErro("Não foi possível concluir o cadastro. Verifique o backend e se o email já está em uso.");
    } finally {
      setEnviando(false);
    }
  }

  const isPrestador = form.tipoUsuario === "PRESTADOR";

  return (
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_520px]">
      <div>
        <p className="eyebrow text-fuchsia-300">Criar conta</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Comece agora no ConectaPro</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Clientes podem contratar profissionais aprovados. Prestadores já cadastram seu perfil profissional completo e ficam
          pendentes de aprovação administrativa.
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

        {isPrestador && (
          <div className="grid gap-4 border-t border-white/10 pt-4">
            <p className="text-sm font-semibold text-violet-200">Dados profissionais</p>
            <label className="grid gap-1">
              <span className="label">Tipo de serviço</span>
              <input
                className="field"
                value={form.categoria}
                onChange={(event) => setForm({ ...form, categoria: event.target.value })}
                placeholder="Ex.: Eletricista, encanador, climatização"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="label">Qualificação</span>
              <input
                className="field"
                value={form.qualificacao}
                onChange={(event) => setForm({ ...form, qualificacao: event.target.value })}
                placeholder="Ex.: Técnico certificado, 5 anos de experiência"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="label">Apresentação profissional</span>
              <textarea
                className="field min-h-24"
                value={form.descricao}
                onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                placeholder="Descreva sua experiência e os serviços oferecidos"
                required
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="label">Cidade</span>
                <input className="field" value={form.cidade} onChange={(event) => setForm({ ...form, cidade: event.target.value })} required />
              </label>
              <label className="grid gap-1">
                <span className="label">Telefone</span>
                <input className="field" value={form.telefone} onChange={(event) => setForm({ ...form, telefone: event.target.value })} required />
              </label>
            </div>
          </div>
        )}

        <button className="btn-primary" disabled={enviando}>
          {enviando ? "Cadastrando..." : isPrestador ? "Cadastrar e enviar para aprovação" : "Cadastrar como cliente"}
        </button>
        {erro && <Message type="error">{erro}</Message>}
      </form>
    </section>
  );
}
