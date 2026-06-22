import type { StatusSolicitacao } from "@/services/api";

export function StatusBadge({ status }: { status: StatusSolicitacao }) {
  const styles = {
    PENDENTE: "bg-amber-400/10 text-amber-200 border-amber-300/25",
    ACEITO: "bg-sky-400/10 text-sky-200 border-sky-300/25",
    RECUSADO: "bg-rose-400/10 text-rose-200 border-rose-300/25",
    FINALIZADO: "bg-emerald-400/10 text-emerald-200 border-emerald-300/25",
  };

  return (
    <span className={`w-fit rounded-md border px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export function NivelBadge({ nivel }: { nivel?: string }) {
  const styles: Record<string, string> = {
    BRONZE: "bg-orange-400/10 text-orange-200 border-orange-300/25",
    PRATA: "bg-slate-300/10 text-slate-200 border-slate-200/25",
    OURO: "bg-amber-300/10 text-amber-100 border-amber-200/25",
  };

  const label = nivel ?? "BRONZE";

  return (
    <span className={`w-fit rounded-md border px-2 py-1 text-xs font-semibold ${styles[label] ?? styles.BRONZE}`}>
      {label}
    </span>
  );
}
