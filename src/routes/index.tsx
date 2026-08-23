import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import lspdLogo from "@/assets/lspd-logo.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { navItems } from "@/lib/nav-items";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const tools = navItems.filter((i) => i.to !== "/" && i.position !== "bottom");

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="gradient-border relative overflow-hidden rounded-2xl bg-card/60 p-8 surface-glow">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-8 translate-y-8 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative flex items-center gap-5">
            <div className="hidden shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 p-2 ring-1 ring-primary/20 shadow-lg shadow-primary/10 sm:block">
              <img src={lspdLogo.url} alt="LSPD badge" className="size-16 object-contain opacity-90" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gradient text-glow">LSPD Toolkit</h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Görev sırasında ihtiyaç duyduğunuz tüm raporlama, hesaplama ve kaynak araçları tek bir panelde.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/40 hover:bg-accent/30 hover:glow-card"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-primary/8 to-transparent" />
              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-lg icon-gradient text-primary-foreground ring-1 ring-primary/20 shadow-lg shadow-primary/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <tool.icon className="size-5" />
                </div>
                <h2 className="mt-4 flex items-center gap-1 text-lg font-semibold">
                  {tool.label}
                  <ChevronRight className="size-4 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
