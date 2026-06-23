import Link from "next/link";
import { NivelBadge } from "@/components/Badges";
import type { Prestador } from "@/services/api";

type PrestadorCardProps = {
  prestador: Prestador;
  showAdminStatus?: boolean;
  onAprovar?: (id: number) => void;
};

export function PrestadorCard({ prestador, showAdminStatus = false, onAprovar }: PrestadorCardProps) {
  return (
    <article className="surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{prestador.usuarioNome ?? "Prestador"}</h3>
          <p className="text-sm text-slate-300">
            {prestador.categoria} em {prestador.cidade}
          </p>
        </div>
        {showAdminStatus && (
          <span
            className={`w-fit rounded-md px-2 py-1 text-xs font-semibold ${
              prestador.aprovado ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-200"
            }`}
          >
            {prestador.aprovado ? "Aprovado" : "Pendente"}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{prestador.descricao}</p>
      {prestador.qualificacao && (
        <p className="mt-2 text-sm text-violet-200">
          <span className="font-semibold">Qualificação:</span> {prestador.qualificacao}
        </p>
      )}
      <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-4">
        <span>Telefone: {prestador.telefone}</span>
        <span>Média: {(prestador.mediaAvaliacoes ?? 0).toFixed(1)}</span>
        <span>Avaliações: {prestador.quantidadeAvaliacoes ?? 0}</span>
        <NivelBadge nivel={prestador.nivel} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link className="btn-secondary" href={`/prestadores/${prestador.id}`}>
          Ver perfil
        </Link>
        {onAprovar && !prestador.aprovado && (
          <button className="btn-primary" onClick={() => onAprovar(prestador.id)}>
            Aprovar
          </button>
        )}
      </div>
    </article>
  );
}
