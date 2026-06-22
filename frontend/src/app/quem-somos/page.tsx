export default function QuemSomosPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="eyebrow">Quem Somos</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
          Confiança para contratar serviços técnicos
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <article className="surface p-8">
          <div className="space-y-5 leading-8 text-slate-300">
            <p>
              O ConectaPro nasceu com o objetivo de tornar a contratação de serviços técnicos mais segura,
              transparente e eficiente.
            </p>
            <p>
              Nossa plataforma conecta clientes a profissionais qualificados, oferecendo um ambiente confiável para
              solicitações, avaliações e acompanhamento de serviços.
            </p>
            <p>
              Acreditamos que a confiança é um dos fatores mais importantes na contratação de profissionais e, por
              isso, implementamos mecanismos de aprovação, reputação e avaliação para garantir uma melhor experiência
              para todos os usuários.
            </p>
          </div>
        </article>

        <aside className="space-y-3">
          {["Aprovação administrativa", "Avaliações reais", "Histórico de solicitações", "Reputação do prestador"].map(
            (item) => (
              <div key={item} className="rounded-lg border border-violet-300/20 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-100">
                {item}
              </div>
            ),
          )}
        </aside>
      </div>
    </section>
  );
}
