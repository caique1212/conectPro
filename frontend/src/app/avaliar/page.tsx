import Link from "next/link";
import { Message } from "@/components/Message";

export default function AvaliarPage() {
  return (
    <section className="surface mx-auto max-w-xl space-y-4 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">Fluxo protegido</p>
      <h1 className="text-2xl font-black text-white">Avaliação pelo Dashboard Cliente</h1>
      <Message>A avaliação aparece somente quando uma solicitação estiver finalizada.</Message>
      <Link href="/cliente" className="btn-primary">
        Ir para Cliente
      </Link>
    </section>
  );
}
