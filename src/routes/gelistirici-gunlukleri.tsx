import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { changelog } from "@/lib/changelog";

export const Route = createFileRoute("/gelistirici-gunlukleri")({
  head: () => ({
    meta: [
      { title: "Geliştirici Günlükleri — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "Geliştirici Günlükleri — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Terminal className="size-5" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Geliştirici Günlükleri</h1>
            <p className="mt-1 text-muted-foreground">
              Uygulamaya eklenen güncellemeler, düzeltmeler ve geliştirme notları.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {changelog.map((entry) => (
            <section key={entry.date} className="rounded-xl border border-border bg-card p-6">
              <span className="font-mono text-xs text-muted-foreground">{entry.date}</span>
              <h2 className="mt-1 text-lg font-semibold">{entry.title}</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-primary">
                {entry.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
