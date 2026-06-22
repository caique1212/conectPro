import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConectaPro",
  description: "Marketplace de servicos tecnicos confiaveis",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090f]/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-white">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-600 shadow-lg shadow-violet-900/40">
                CP
              </span>
              ConectaPro
            </Link>
            <PublicNav />
          </div>
        </header>
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
