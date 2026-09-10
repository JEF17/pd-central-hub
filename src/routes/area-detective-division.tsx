import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { requirePortalAuth } from "@/lib/portal-auth";
import { Search, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/area-detective-division")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { group: "area_detective_division" });
  },
  head: () => ({
    meta: [
      { title: "Area Detective Division — LSPD - Toolkit" },
      {
        name: "description",
        content: "Area Detective Division personeline özel rapor şablonları ve araçlar.",
      },
      { property: "og:title", content: "Area Detective Division — LSPD - Toolkit" },
      {
        property: "og:description",
        content: "Area Detective Division personeline özel rapor şablonları ve araçlar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

/** ADD'a özel şablonlar buraya eklenecek. */
type AddTemplate = { slug: string; label: string; description: string; to?: string };
const addTemplates: AddTemplate[] = [];

function Page() {
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return addTemplates;
    return addTemplates.filter(
      (t) =>
        t.label.toLocaleLowerCase("tr").includes(q) ||
        t.description.toLocaleLowerCase("tr").includes(q),
    );
  }, [query]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="gradient-border relative overflow-hidden rounded-2xl bg-card/70 px-6 py-7 shadow-sm">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-wrap items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-gold/15 text-primary ring-1 ring-primary/25">
              <ShieldCheck className="size-6" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Area Detective Division</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Bu alan yalnızca Area Detective Division yetkisi bulunan personele açıktır.
              </p>
            </div>
            <span className="ml-auto hidden rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
              {addTemplates.length} şablon
            </span>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Şablon ara"
              className="h-11 bg-background/60 pl-9 transition-colors focus-visible:bg-background"
            />
          </div>
        </header>

        {items.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
            Bu alana özel şablonlar henüz eklenmedi. Eklenecek rapor türlerini ilettiğinde buraya tanımlayabiliriz.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <div
                key={t.slug}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/80 p-5 text-left shadow-sm"
              >
                <h2 className="text-base font-semibold tracking-tight">{t.label}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
