import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileStack, Search } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { paperworkTypes } from "@/lib/paperwork-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/paperwork-generators")({
  head: () => ({
    meta: [
      { title: "Rapor Oluştur — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "Rapor Oluştur — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const routes: Record<string, string> = {
  "olay-raporu": "/olay-raporu",
  "ifade-raporu": "/ifade-raporu",
  "ihlal-raporu": "/ihlal-raporu",
  "arac-el-koyma-raporu": "/arac-el-koyma-raporu",
  "tutuklama-raporu": "/tutuklama-raporu",
  "apb-sablonu": "/apb-sablonu",
  "field-interview-karti": "/field-interview-karti",
  "gozalti-kayit-formu": "/gozalti-kayit-formu",
  "e-posta": "/e-posta",
};

function Page() {
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return paperworkTypes;
    return paperworkTypes.filter(
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
              <FileStack className="size-6" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Rapor Oluştur</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Doldurmak istediğin evrak türünü seç; alanları doldur, çıktıyı kopyala.
              </p>
            </div>
            <span className="ml-auto hidden rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
              {paperworkTypes.length} şablon
            </span>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Şablon ara (örn. tutuklama, e-posta, ihlal)"
              className="h-11 bg-background/60 pl-9 transition-colors focus-visible:bg-background"
            />
          </div>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => {
            const path = routes[t.slug];
            const content = (
              <>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-gold to-transparent opacity-60 transition-opacity group-hover:opacity-100"
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-gold/10 text-primary ring-1 ring-primary/25 transition-transform group-hover:scale-105">
                    <t.icon className="size-5" />
                  </div>
                </div>

                <h2 className="mt-4 text-base font-semibold tracking-tight">{t.label}</h2>
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-70 transition-all group-hover:gap-2.5 group-hover:opacity-100">
                  Şablonu aç
                  <ArrowRight className="size-3.5" />
                </span>
              </>
            );

            const cls = cn(
              "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/80 p-5 text-left shadow-sm",
              "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:glow-card",
            );

            if (!path) {
              return (
                <button key={t.slug} type="button" className={cls}>
                  {content}
                </button>
              );
            }

            return (
              <Link key={t.slug} to={path as never} className={cls}>
                {content}
              </Link>
            );
          })}
        </div>

        {items.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
            “{query}” için şablon bulunamadı.
          </p>
        ) : null}
      </div>
    </AppShell>
  );
}
