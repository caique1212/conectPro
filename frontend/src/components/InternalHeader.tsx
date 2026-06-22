"use client";

import { useEffect, useState } from "react";
import type { TipoUsuario } from "@/services/api";
import { AuthUser, getUser, logout } from "@/utils/auth";

export function InternalHeader({ title, subtitle, allowed }: { title: string; subtitle: string; allowed: TipoUsuario }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }
    if (currentUser.tipoUsuario !== allowed) {
      window.location.href = "/";
      return;
    }
    setUser(currentUser);
  }, [allowed]);

  return (
    <section className="surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
            {user ? `${user.tipoUsuario} · ${user.nome}` : "Área interna"}
          </p>
          <h1 className="mt-2 text-2xl font-black text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
        </div>
        <button className="btn-ghost" onClick={logout}>
          Sair
        </button>
      </div>
    </section>
  );
}
