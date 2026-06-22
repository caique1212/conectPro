"use client";

import { FormEvent, useEffect, useState } from "react";
import { Message } from "@/components/Message";
import { PrestadorCard } from "@/components/PrestadorCard";
import { api, Prestador } from "@/services/api";

export default function BuscarPage() {
  const [categoria, setCategoria] = useState("");
  const [cidade, setCidade] = useState("");
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      setPrestadores(await api.listarPrestadores());
    } catch {
      setErro("Não foi possível carregar a busca. Confira se o backend está rodando.");
    } finally {
      setCarregando(false);
    }
  }

  async function buscar(event: FormEvent) {
    event.preventDefault();
    setCarregando(true);
    setErro("");
    try {
      setPrestadores(await api.buscarPrestadores(categoria, cidade));
    } catch {
      setErro("Não foi possível buscar prestadores com esses filtros.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">Busca pública</p>
        <h1 className="mt-2 text-3xl font-black text-white">Buscar prestadores aprovados</h1>
        <form onSubmit={buscar} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="grid gap-1">
            <span className="label">Categoria</span>
            <input className="field" value={categoria} onChange={(event) => setCategoria(event.target.value)} placeholder="Eletricista" />
          </label>
          <label className="grid gap-1">
            <span className="label">Cidade</span>
            <input className="field" value={cidade} onChange={(event) => setCidade(event.target.value)} placeholder="São Paulo" />
          </label>
          <button className="btn-primary" disabled={carregando}>
            Buscar
          </button>
        </form>
      </section>

      {erro && <Message type="error">{erro}</Message>}
      {carregando ? (
        <Message>Carregando prestadores aprovados...</Message>
      ) : prestadores.length === 0 ? (
        <Message>Nenhum prestador aprovado encontrado para sua busca.</Message>
      ) : (
        <div className="grid gap-4">
          {prestadores.map((prestador) => (
            <PrestadorCard key={prestador.id} prestador={prestador} />
          ))}
        </div>
      )}
    </div>
  );
}
