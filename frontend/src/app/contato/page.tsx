const contacts = [
  ["Email", "suporte@conectapro.com.br"],
  ["Telefone", "(48) 99999-9999"],
  ["Cidade", "Criciúma - SC"],
  ["Horário", "Segunda a Sexta-feira, 08h às 18h"],
];

export default function ContatoPage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="eyebrow">Contato</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Entre em Contato</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Fale com o suporte para dúvidas sobre cadastro, aprovação de prestadores, solicitações ou uso da plataforma.
        </p>
      </div>

      <div className="surface p-6">
        <div className="space-y-4">
          {contacts.map(([label, value]) => (
            <div key={label} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
              <p className="text-sm font-bold uppercase tracking-wide text-violet-300">{label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
