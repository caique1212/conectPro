"use client";

import type { TipoUsuario } from "@/services/api";

type UserTypePickerProps = {
  value: TipoUsuario;
  onChange: (tipo: TipoUsuario) => void;
  options: TipoUsuario[];
};

const labels: Record<TipoUsuario, string> = {
  CLIENTE: "Cliente",
  PRESTADOR: "Prestador",
  ADMIN: "Admin",
};

export function UserTypePicker({ value, onChange, options }: UserTypePickerProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-4 py-3 text-sm font-bold transition ${
              selected
                ? "border-purple-400 bg-purple-600 text-white shadow-lg shadow-purple-950/35"
                : "border-purple-500/30 bg-[#1f1633] text-slate-200 hover:border-purple-400/70 hover:bg-purple-500/20"
            }`}
            aria-pressed={selected}
          >
            {labels[option]}
          </button>
        );
      })}
    </div>
  );
}
