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
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-8 card-shadow">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative">
            <h1 className="text-3xl font-bold tracking-tight text-gradient">LSPD Toolkit</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Görev sırasında ihtiyaç duyduğunuz tüm raporlama, hesaplama ve kaynak araçları tek bir panelde.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/30 hover:glow-card"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-md icon-gradient text-primary-foreground ring-1 ring-primary/20 shadow-lg shadow-primary/10">
                  <tool.icon className="size-5" />
                </div>
                <h2 className="mt-4 flex items-center gap-1 font-semibold">
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
