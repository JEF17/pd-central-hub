import { createFileRoute } from "@tanstack/react-router";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  BookOpen,
  Copy,
  ExternalLink,
  Gavel,
  Scale,
  Search,
  ShieldAlert,
  Video,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { notify } from "@/lib/notifications";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  caseEntries,
  cctvStandards,
  legalResources,
  mirandaRights,
  type Jurisdiction,
} from "@/lib/caselaw-data";
import { cn } from "@/lib/utils";

type Filter = "ALL" | Jurisdiction;

const filterOptions: Array<{ value: Filter; label: string }> = [
  { value: "ALL", label: "Tümü" },
  { value: "US", label: "Amerika Birleşik Devletleri" },
  { value: "SA", label: "San Andreas" },
];

export const Route = createFileRoute("/caselaw")({
  beforeLoad: async ({ location }) => { await requirePortalAuth(location.href); },
  
  head: () => ({
    meta: [
      { title: "Emsal Kararlar & Kaynaklar — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "Emsal Kararlar & Kaynaklar — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CaselawPage,
});

function CaselawPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");

    if (filter === "SA") return [];

    return caseEntries.filter((entry) => {
      const matchesFilter = entry.jurisdiction === "US";
      if (!matchesFilter) return false;
      if (!q) return true;

      return [entry.title, entry.court, entry.summary, entry.implication]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(q);
    });
  }, [query, filter]);

  const copyMiranda = async () => {
    try {
      await navigator.clipboard.writeText(mirandaRights.join("\n"));
      notify.success("Miranda hakları panoya kopyalandı.");
    } catch {
      notify.error("Kopyalama başarısız oldu.");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Gavel className="size-4" aria-hidden="true" />
            Hukuki Referans
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Emsal Kararlar &amp; Kaynaklar
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Sahada işinize yarayacak emsal kararlar, Miranda hakları ve resmî kaynaklar.
          </p>
        </header>

        {/* Kaynaklar */}
        <section className="mb-10 space-y-4" aria-label="Resmî kaynaklar">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold tracking-tight">Resmî Kaynaklar</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {legalResources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex min-h-36 flex-col overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-primary opacity-60 transition-opacity group-hover:opacity-100"
                />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-semibold leading-snug">
                    {resource.title}
                  </h3>
                  <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {resource.description}
                </p>
              </a>
            ))}

            <div className="relative flex min-h-36 flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-primary/60"
              />
              <div className="flex min-w-0 items-start gap-2">
                <Video className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <h3 className="font-display text-base font-semibold leading-snug">
                  San Andreas Eyaleti CCTV Standartları
                </h3>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {cctvStandards.map((standard) => (
                  <Button
                    key={standard.label}
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 justify-between rounded-lg px-2.5 text-[11px] [&_svg]:size-3"
                  >
                    <a href={standard.href} target="_blank" rel="noreferrer">
                      {standard.label}
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-36 flex-col justify-between gap-3 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-primary/60" />
              <div>
                <div className="flex min-w-0 items-center gap-2">
                  <ShieldAlert className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <h3 className="font-display text-base font-semibold">Miranda Hakları</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Gözaltı sırasında okunması gereken hakların tam metnini kopyalayın.
                </p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0" onClick={copyMiranda}>
                <Copy className="size-4" />
                Hakları Kopyala
              </Button>
            </div>
          </div>
        </section>

        {/* Emsal karar veritabanı */}
        <section className="space-y-5" aria-label="Emsal karar veritabanı">
          <div className="flex items-center gap-2">
            <Scale className="size-5 text-primary" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Emsal Karar Veritabanı
            </h2>
          </div>

          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Dava adı, mahkeme veya konu ara..."
              aria-label="Emsal kararlarda ara"
              className="h-14 rounded-xl border-border bg-card pl-12 pr-12 text-base shadow-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Aramayı temizle"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {filterOptions.map((option) => {
              const active = filter === option.value;
              return (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  aria-pressed={active}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "h-auto rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "border-transparent bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent",
                  )}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <p className="text-sm font-medium text-muted-foreground">
              {query ? `“${query}” için sonuçlar` : "Tüm emsal kararlar"}
            </p>
            <Badge variant="secondary" className="font-mono">
              {filtered.length} karar
            </Badge>
          </div>

          <div className="grid gap-5" aria-live="polite">
            {filtered.map((entry) => (
              <Card
                key={entry.title + entry.source}
                className="group relative overflow-hidden border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 top-0 h-1",
                    entry.jurisdiction === "SA" ? "bg-primary" : "bg-muted-foreground/50",
                  )}
                />
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <CardTitle className="flex-1 font-display text-lg font-semibold leading-snug tracking-tight">
                      {entry.title}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0 font-normal text-muted-foreground">
                      {entry.court}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pb-5 text-sm">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Özet
                    </h4>
                    <p className="mt-1.5 leading-relaxed">{entry.summary}</p>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Memurlar İçin Sonuçları
                    </h4>
                    <p className="mt-1.5 leading-relaxed">{entry.implication}</p>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border bg-muted/30 px-6 py-3.5">
                  <a
                    href={entry.source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Kaynağı Görüntüle
                    <ExternalLink className="size-3.5" />
                  </a>
                </CardFooter>
              </Card>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <Scale className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Aramanızla eşleşen emsal karar bulunamadı.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
