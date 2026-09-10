import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";

/** Gruba özel rapor şablonu tanımı. */
export type GroupTemplate = {
  slug: string;
  label: string;
  description: string;
  /** Hazır şablon sayfası varsa hedef yol. */
  to?: string;
  /** Harici bağlantı (yönerge vb.). */
  href?: string;
  /** Bağlantı/aksiyon metni. */
  actionLabel?: string;
};

export function GroupAreaPage({
  title,
  subtitle,
  note,
  templates,
}: {
  title: string;
  subtitle: string;
  note?: ReactNode;
  templates: GroupTemplate[];
}) {
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.label.toLocaleLowerCase("tr").includes(q) ||
        t.description.toLocaleLowerCase("tr").includes(q),
    );
  }, [query, templates]);

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
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <span className="ml-auto hidden rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
              {templates.length} şablon
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
          {note ? (
            <div className="relative mt-5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              {note}
            </div>
          ) : null}
        </header>

        {items.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
            Bu alana özel şablonlar henüz eklenmedi. Eklenecek rapor türlerini ilettiğinde buraya
            tanımlayabiliriz.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => {
              const inner = (
                <>
                  <h2 className="text-base font-semibold tracking-tight">{t.label}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
                  {t.to || t.href ? (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-70 transition-all group-hover:gap-2.5 group-hover:opacity-100">
                      {t.actionLabel ?? "Şablonu aç"}
                      <ArrowRight className="size-3.5" />
                    </span>
                  ) : null}
                </>
              );

              const cls =
                "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/80 p-5 text-left shadow-sm";

              const hoverCls =
                "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md";

              if (t.href) {
                return (
                  <a
                    key={t.slug}
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cls} ${hoverCls}`}
                  >
                    {inner}
                  </a>
                );
              }

              if (!t.to) {
                return (
                  <div key={t.slug} className={cls}>
                    {inner}
                  </div>
                );
              }

              return (
                <Link
                  key={t.slug}
                  to={t.to as never}
                  className={`${cls} transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md`}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
