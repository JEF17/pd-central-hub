import { createFileRoute } from "@tanstack/react-router";
import { Copy, ExternalLink, Scale, Search, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { notify } from "@/lib/notifications";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
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
  head: () => ({
    meta: [
      { title: "Emsal Kararlar & Kaynaklar — LSPD Portal" },
      {
        name: "description",
        content:
          "GTA:W TR Roleplay için Türkçe emsal karar veritabanı, Miranda hakları ve resmî hukuki kaynaklar.",
      },
      { property: "og:title", content: "Emsal Kararlar & Kaynaklar — LSPD Portal" },
      {
        property: "og:description",
        content: "Türkçe emsal karar veritabanı, Miranda hakları ve resmî hukuki kaynaklar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Emsal Kararlar & Kaynaklar
          </h1>
          <p className="text-sm text-muted-foreground">
            Sahada işinize yarayacak emsal kararlar, Miranda hakları ve resmî hukuki kaynaklar.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {legalResources.map((resource) => (
            <a
              key={resource.title}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="group min-h-32 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60 lg:h-32"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{resource.title}</h2>
                <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
            </a>
          ))}

          <div className="flex min-h-32 flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:h-32">
            <div className="flex min-w-0 items-start gap-2">
              <ExternalLink className="mt-0.5 size-4 shrink-0 text-primary" />
              <h2 className="font-semibold">San Andreas Eyaleti CCTV Standartları</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {cctvStandards.map((standard) => (
                <Button
                  key={standard.label}
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-7 justify-between px-2 text-[11px] [&_svg]:size-3"
                >
                  <a href={standard.href} target="_blank" rel="noreferrer">
                    {standard.label}
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex min-h-32 flex-col items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 lg:h-32">
            <div className="flex min-w-0 items-center gap-2">
              <ShieldAlert className="size-4 shrink-0 text-primary" />
              <h2 className="font-semibold">Miranda Hakları</h2>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={copyMiranda}>
              <Copy className="size-4" />
              Hakları Kopyala
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">Emsal Karar Veritabanı</h2>
            </div>
            <p className="text-sm text-muted-foreground">İlgili emsal kararları arayın.</p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Dava adı, mahkeme veya konu ara..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">{filtered.length} karar listeleniyor.</p>

          <div className="space-y-3">
            {filtered.map((entry) => (
              <article
                key={entry.title + entry.source}
                className={cn(
                  "rounded-lg border border-border border-l-4 bg-card p-5",
                  entry.jurisdiction === "SA" ? "border-l-primary" : "border-l-muted-foreground/50",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{entry.title}</h3>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {entry.court}
                  </span>
                </div>

                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Özet
                    </h4>
                    <p className="mt-1 leading-relaxed">{entry.summary}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Memurlar İçin Sonuçları
                    </h4>
                    <p className="mt-1 leading-relaxed">{entry.implication}</p>
                  </div>
                </div>

                <a
                  href={entry.source}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Kaynağı Görüntüle
                  <ExternalLink className="size-3.5" />
                </a>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Aramanızla eşleşen emsal karar bulunamadı.
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
