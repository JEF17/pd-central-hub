import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { navItems } from "@/lib/nav-items";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LSPD - Paperwork Tool" },
      { name: "description", content: "LSPD - Paperwork Tool" },
      { property: "og:title", content: "LSPD - Paperwork Tool" },
      { property: "og:description", content: "LSPD - Paperwork Tool" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const tools = navItems.filter((i) => i.to !== "/" && i.to !== "/ayarlar");

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">LSPD Paperwork Generator</h1>
        <p className="mt-2 text-muted-foreground">
          {"\n"}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
                <tool.icon className="size-5" />
              </div>
              <h2 className="mt-4 flex items-center gap-1 font-semibold">
                {tool.label}
                <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
