"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { AuthUser } from "@/utils/auth";
import { getUser, logout } from "@/utils/auth";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/politicas", label: "Políticas e Privacidade" },
  { href: "/contato", label: "Contato" },
];

const linksByType = {
  CLIENTE: [
    { href: "/", label: "Home" },
    { href: "/buscar", label: "Buscar" },
    { href: "/cliente", label: "Dashboard Cliente" },
  ],
  PRESTADOR: [
    { href: "/", label: "Home" },
    { href: "/prestador", label: "Dashboard Prestador" },
  ],
  ADMIN: [
    { href: "/", label: "Home" },
    { href: "/admin", label: "Painel Admin" },
  ],
} as const;

export function PublicNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const links = user ? linksByType[user.tipoUsuario] : publicLinks;

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.07] hover:text-white"
        >
          {link.label}
        </Link>
      ))}
      {user ? (
        <button className="btn-ghost" onClick={logout}>
          Sair
        </button>
      ) : (
        <>
          <Link href="/login" className="btn-ghost">
            Entrar
          </Link>
          <Link href="/cadastro" className="btn-primary">
            Cadastrar
          </Link>
        </>
      )}
    </nav>
  );
}
