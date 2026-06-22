const sections = [
  {
    title: "Dados coletados",
    items: ["Nome completo", "E-mail", "Telefone", "Cidade", "Informações relacionadas aos serviços"],
  },
  {
    title: "Finalidade",
    items: ["Cadastro", "Comunicação", "Solicitações", "Avaliações", "Segurança"],
  },
  {
    title: "Direitos do usuário",
    items: ["Atualização de dados", "Correção", "Exclusão da conta", "Exclusão de dados pessoais"],
  },
];

export default function PoliticasPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="eyebrow">Políticas e Privacidade</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Política de Privacidade</h1>
        <p className="mt-3 text-slate-400">Última atualização: Junho de 2026</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="surface p-5">
            <h2 className="text-lg font-bold text-white">{section.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {section.items.map((item) => (
                <li key={item} className="border-l border-violet-300/35 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="surface p-6">
          <h2 className="text-xl font-bold text-white">Compartilhamento</h2>
          <p className="mt-3 leading-7 text-slate-300">O ConectaPro não comercializa dados pessoais.</p>
        </article>
        <article className="surface p-6">
          <h2 className="text-xl font-bold text-white">Segurança</h2>
          <p className="mt-3 leading-7 text-slate-300">
            Adotamos medidas técnicas e administrativas para proteger os dados.
          </p>
        </article>
      </div>

      <article className="surface p-6">
        <h2 className="text-xl font-bold text-white">Termos de Uso</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Term title="Clientes" items={["Devem fornecer informações verdadeiras", "Devem utilizar a plataforma de forma ética", "Só podem avaliar serviços realizados"]} />
          <Term title="Prestadores" items={["Devem manter dados atualizados", "Devem cumprir os serviços acordados", "Estão sujeitos à aprovação administrativa"]} />
          <Term title="Administração" items={["Pode aprovar ou reprovar prestadores", "Pode excluir usuários", "Pode suspender contas suspeitas"]} />
        </div>
        <p className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
          O ConectaPro atua como intermediador e não executa diretamente os serviços.
        </p>
      </article>
    </section>
  );
}

function Term({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-bold text-violet-200">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
