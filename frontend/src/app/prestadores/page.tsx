"use client";

import { useEffect, useState } from "react";
import { Message } from "@/components/Message";
import { PrestadorCard } from "@/components/PrestadorCard";
import { api, Prestador } from "@/services/api";

export default function PrestadoresPage() {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.listarPrestadores()
      .then(setPrestadores)
      .catch(() => setErro("Não foi possível carregar prestadores aprovados."));
  }, []);

  return (
    <section className="space-y-5">
      <div>
        <p className="eyebrow">Marketplace</p>
        <h1 className="mt-2 text-3xl font-black text-white">Prestadores aprovados</h1>
      </div>
      {erro && <Message type="error">{erro}</Message>}
      {prestadores.length === 0 && !erro ? (
        <Message>Nenhum prestador aprovado encontrado.</Message>
      ) : (
        <div className="grid gap-4">
          {prestadores.map((prestador) => (
            <PrestadorCard key={prestador.id} prestador={prestador} />
          ))}
        </div>
      )}
    </section>
  );
}
