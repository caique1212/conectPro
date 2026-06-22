import type { TipoUsuario, Usuario } from "@/services/api";

export type AuthUser = {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: TipoUsuario;
};

const STORAGE_KEY = "conectapro_user";

export const ADMIN_MASTER = {
  id: 0,
  nome: "Admin Master",
  email: "admin@conectapro.com",
  tipoUsuario: "ADMIN" as TipoUsuario,
};

const ADMIN_MASTER_PASSWORD = "admin123";

export function isAdminMasterLogin(email: string, senha: string) {
  return email.trim().toLowerCase() === ADMIN_MASTER.email && senha === ADMIN_MASTER_PASSWORD;
}

export function saveUser(usuario: AuthUser | Usuario) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.clear();
  window.location.href = "/login";
}

export function dashboardPath(tipoUsuario: TipoUsuario) {
  if (tipoUsuario === "ADMIN") return "/admin";
  if (tipoUsuario === "PRESTADOR") return "/prestador";
  return "/cliente";
}
