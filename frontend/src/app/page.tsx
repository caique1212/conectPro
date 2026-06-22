import Link from "next/link";

const benefits = [
  {
    title: "Prestadores Verificados",
    text: "Todos os profissionais passam por um processo de analise antes de aparecerem na plataforma.",
    icon: "shield",
  },
  {
    title: "Avaliacoes Reais",
    text: "As avaliacoes sao registradas somente apos a conclusao do servico.",
    icon: "star",
  },
  {
    title: "Mais Seguranca",
    text: "Historico de solicitacoes, reputacao e acompanhamento administrativo para maior confianca.",
    icon: "lock",
  },
  {
    title: "Busca Inteligente",
    text: "Encontre profissionais por categoria, cidade e avaliacao.",
    icon: "search",
  },
];

const steps = [
  "Cliente busca o prestador.",
  "Cliente solicita o servico.",
  "Prestador aceita e realiza.",
  "Cliente avalia apos finalizacao.",
];

const stats = [
  ["Prestadores", "verificados"],
  ["Avaliacoes", "pos-servico"],
  ["Admin", "controle ativo"],
];

export default function Home() {
  return (
    <div className="space-y-24 pb-10">
      <section className="grid min-h-[calc(100vh-96px)] items-center gap-12 pt-4 lg:grid-cols-[minmax(0,1fr)_560px]">
        <div>
          <p className="eyebrow">Marketplace seguro de servicos tecnicos</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Contrate profissionais confiaveis com mais seguranca
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            O ConectaPro conecta clientes a prestadores de servicos avaliados e aprovados, oferecendo mais
            transparencia, reputacao e seguranca em cada contratacao.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/buscar" className="btn-primary px-6">
              Buscar Prestadores
            </Link>
            <Link href="/cadastro" className="btn-ghost px-6">
              Criar Conta
            </Link>
          </div>
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={value} className="border-l border-violet-300/35 pl-4">
                <p className="text-sm font-black uppercase tracking-wide text-white">{value}</p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroIllustration />
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <article key={benefit.title} className="surface p-5">
            <Icon name={benefit.icon} />
            <h2 className="mt-5 text-lg font-bold text-white">{benefit.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{benefit.text}</p>
          </article>
        ))}
      </section>

      <section className="full-band">
        <div>
          <p className="eyebrow">Como funciona</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Do pedido a avaliacao final</h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step} className="timeline-step">
              <span>{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-8 lg:grid-cols-[1fr_480px]">
        <div>
          <p className="eyebrow text-fuchsia-300">Para prestadores</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Divulgue seus servicos</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Cadastre-se como prestador, passe pela aprovacao administrativa e construa sua reputacao dentro da
            plataforma.
          </p>
          <Link href="/cadastro" className="mt-7 inline-flex btn-primary">
            Quero ser prestador
          </Link>
        </div>
        <ProvidersIllustration />
      </section>

      <section className="cta-section">
        <p className="eyebrow text-violet-100">ConectaPro</p>
        <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Comece agora no ConectaPro</h2>
        <p className="mx-auto mt-4 max-w-2xl text-violet-100">
          Encontre profissionais confiaveis ou divulgue seus servicos para novos clientes.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/cadastro" className="btn-primary bg-white text-violet-700 hover:bg-violet-50">
            Criar Conta
          </Link>
          <Link href="/buscar" className="btn-ghost border-white/30 bg-white/10 text-white">
            Buscar Prestadores
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="flex flex-col gap-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-black text-white">ConectaPro</p>
            <p className="mt-1">© 2026 ConectaPro. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/quem-somos" className="hover:text-white">
              Quem Somos
            </Link>
            <Link href="/politicas" className="hover:text-white">
              Politicas e Privacidade
            </Link>
            <Link href="/contato" className="hover:text-white">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z",
    star: "M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z",
    lock: "M7 10V8a5 5 0 0110 0v2m-11 0h12v10H6V10z",
    search: "M11 5a6 6 0 104.2 10.2L20 20l-4.8-4.8A6 6 0 0011 5z",
  };

  return (
    <div className="grid h-11 w-11 place-items-center rounded-xl border border-violet-300/25 bg-violet-500/15">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-violet-200 stroke-2">
        <path d={paths[name]} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-violet-300/20 bg-[#0f0b1f] shadow-2xl shadow-violet-950/40">
      <svg viewBox="0 0 900 680" role="img" aria-label="Cliente contratando profissional pelo aplicativo" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity=".55" />
            <stop offset="55%" stopColor="#7c3aed" stopOpacity=".16" />
            <stop offset="100%" stopColor="#09090f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="screen" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop stopColor="#1e123e" />
            <stop offset="1" stopColor="#09090f" />
          </linearGradient>
        </defs>
        <rect width="900" height="680" fill="#0f0b1f" />
        <circle cx="500" cy="210" r="360" fill="url(#heroGlow)" />
        <path d="M90 570 C180 490 260 610 355 535 C460 452 560 515 650 470 C760 415 812 485 865 430 V680 H90Z" fill="#130a2c" />
        <rect x="560" y="95" width="220" height="430" rx="38" fill="#09090f" stroke="#c084fc" strokeOpacity=".45" strokeWidth="4" />
        <rect x="582" y="130" width="176" height="350" rx="24" fill="url(#screen)" />
        <rect x="612" y="170" width="116" height="18" rx="9" fill="#c084fc" opacity=".9" />
        <rect x="612" y="212" width="116" height="92" rx="18" fill="#7c3aed" opacity=".32" />
        <circle cx="640" cy="256" r="26" fill="#c084fc" />
        <path d="M684 246h34M684 268h46" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" opacity=".8" />
        <rect x="612" y="330" width="116" height="18" rx="9" fill="#f8fafc" opacity=".75" />
        <rect x="612" y="370" width="78" height="18" rx="9" fill="#a855f7" />
        <path d="M250 310c0-72 54-130 121-130s121 58 121 130v210H250V310z" fill="#1a1038" stroke="#a855f7" strokeOpacity=".35" strokeWidth="3" />
        <circle cx="370" cy="210" r="62" fill="#f3c9a4" />
        <path d="M304 208c24-80 118-88 147-23-29 8-68-4-92-26-12 29-28 43-55 49z" fill="#231337" />
        <path d="M305 360h130l35 160H270l35-160z" fill="#7c3aed" />
        <path d="M272 382l-78 86M463 380l70 72" stroke="#f3c9a4" strokeWidth="34" strokeLinecap="round" />
        <path d="M505 443l55 10" stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" />
        <rect x="120" y="410" width="210" height="130" rx="26" fill="#09090f" stroke="#a855f7" strokeOpacity=".5" strokeWidth="3" />
        <rect x="148" y="438" width="128" height="16" rx="8" fill="#f8fafc" opacity=".82" />
        <rect x="148" y="475" width="72" height="16" rx="8" fill="#c084fc" />
        <path d="M282 485l20 20 42-55" fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ProvidersIllustration() {
  return (
    <div className="relative min-h-[330px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]">
      <svg viewBox="0 0 760 470" role="img" aria-label="Prestadores de diversas categorias verificados" className="absolute inset-0 h-full w-full">
        <rect width="760" height="470" fill="#0f0b1f" />
        <circle cx="520" cy="110" r="250" fill="#7c3aed" opacity=".22" />
        <circle cx="180" cy="360" r="220" fill="#a855f7" opacity=".16" />
        {[
          [155, 175, "#7c3aed"],
          [310, 150, "#a855f7"],
          [465, 175, "#6d28d9"],
          [610, 160, "#c084fc"],
        ].map(([x, y, color], index) => (
          <g key={index}>
            <circle cx={x} cy={y} r="48" fill="#f3c9a4" />
            <path d={`M${Number(x) - 50} ${Number(y) + 88}c0-52 23-86 50-86s50 34 50 86v82H${Number(x) - 50}z`} fill={String(color)} />
            <rect x={Number(x) - 62} y={Number(y) + 155} width="124" height="34" rx="17" fill="#09090f" stroke="#c084fc" strokeOpacity=".38" />
          </g>
        ))}
        <path d="M92 382h576" stroke="#c084fc" strokeOpacity=".45" strokeWidth="3" />
        <rect x="60" y="60" width="170" height="62" rx="18" fill="#09090f" stroke="#c084fc" strokeOpacity=".4" />
        <path d="M88 92h65M88 108h102" stroke="#f8fafc" strokeOpacity=".78" strokeWidth="9" strokeLinecap="round" />
        <path d="M625 66l22 22 45-58" fill="none" stroke="#22c55e" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
