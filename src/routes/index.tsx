import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Clock, Files, Gavel, ShieldCheck } from "lucide-react";

import lspdLogo from "@/assets/lspd-logo.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { navItems } from "@/lib/nav-items";
import { chargeCatalog } from "@/lib/charge-catalog";
import { caseEntries } from "@/lib/caselaw-data";
import { paperworkTypes } from "@/lib/paperwork-types";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { formatRelative, loadRecentDrafts, type RecentDraft } from "@/lib/recent-drafts";

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

/** Kart aksanları — her araç farklı bir vurgu rengi alır. */
const accents = [
  "from-primary/25 to-primary/5 text-primary ring-primary/30",
  "from-gold/25 to-gold/5 text-gold ring-gold/30",
  "from-success/25 to-success/5 text-success ring-success/30",
  "from-warning/25 to-warning/5 text-warning ring-warning/30",
  "from-destructive/25 to-destructive/5 text-destructive ring-destructive/30",
] as const;

const draftPaths = {
  "olay-raporu": "/olay-raporu",
  "ifade-raporu": "/ifade-raporu",
  "ihlal-raporu": "/ihlal-raporu",
  "arac-el-koyma-raporu": "/arac-el-koyma-raporu",
  "tutuklama-raporu": "/tutuklama-raporu",
  "apb-sablonu": "/apb-sablonu",
  "field-interview-karti": "/field-interview-karti",
  "gozalti-kayit-formu": "/gozalti-kayit-formu",
  "e-posta": "/e-posta",
} as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

function Dashboard() {
  const tools = navItems.filter((i) => i.to !== "/" && i.position !== "bottom");
  const profile = useOfficerProfile();
  const [recent, setRecent] = useState<RecentDraft[]>([]);

  useEffect(() => {
    setRecent(loadRecentDrafts(4));
  }, []);

  const officerLine = profile?.name
    ? [profile.rank, profile.name].filter(Boolean).join(" ")
    : "Memur profili tanımlı değil";

  const typeCount = (t: "F" | "M" | "I") =>
    chargeCatalog.filter((c) => c.variants.some((v) => v.type === t)).length;

  const stats = [
    {
      label: "Ceza maddesi",
      value: chargeCatalog.length,
      detail: `${typeCount("F")} F · ${typeCount("M")} M · ${typeCount("I")} I`,
      icon: BookOpen,
      to: "/penal-code" as const,
      tone: "text-primary",
    },
    {
      label: "Rapor şablonu",
      value: paperworkTypes.length,
      detail: "BBCode & HTML çıktısı",
      icon: Files,
      to: "/paperwork-generators" as const,
      tone: "text-gold",
    },
    {
      label: "Emsal karar",
      value: caseEntries.length,
      detail: "Kararlar & kaynaklar",
      icon: Gavel,
      to: "/caselaw" as const,
      tone: "text-success",
    },
    {
      label: "Kayıtlı taslak",
      value: recent.length,
      detail: recent[0] ? `Son: ${formatRelative(recent[0].savedAt)}` : "Henüz taslak yok",
      icon: Clock,
      to: "/paperwork-generators" as const,
      tone: "text-warning",
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Karşılama */}
        <section className="gradient-border surface-glow relative overflow-hidden rounded-2xl bg-card/60 p-8">
          <div className="absolute right-0 top-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-8 translate-y-8 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            <div className="hidden shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 p-2 shadow-lg shadow-primary/10 ring-1 ring-primary/20 sm:block">
              <img src={lspdLogo.url} alt="LSPD rozeti" className="size-16 object-contain opacity-90" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/90">
                {greeting()}
              </p>
              <h1 className="text-gradient text-glow mt-1 text-4xl font-extrabold tracking-tight">
                LSPD Toolkit
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span className="font-medium text-foreground/90">{officerLine}</span>
                {profile?.serialNo ? (
                  <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[11px]">
                    #{profile.serialNo}
                  </span>
                ) : (
                  <Link to="/ayarlar" className="text-primary underline-offset-4 hover:underline">
                    Ayarlardan tanımla
                  </Link>
                )}
              </p>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border/70 bg-background/40 px-4 py-3 backdrop-blur-sm"
              >
                <s.icon className="size-4 text-primary/80" />
                <p className="mt-2 text-2xl font-bold tabular-nums leading-none">{s.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Kaldığın yerden devam et */}
        {recent.length > 0 && (
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Clock className="size-4 text-gold" />
              Kaldığın yerden devam et
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map(({ type, savedAt }) => (
                <Link
                  key={type.slug}
                  to={draftPaths[type.slug as keyof typeof draftPaths]}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-accent/30"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold ring-1 ring-gold/25">
                    <type.icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{type.label}</span>
                    <span className="block text-[11px] text-muted-foreground">
                      {formatRelative(savedAt)}
                    </span>
                  </span>
                  <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Araçlar */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Araçlar
          </h2>
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => {
              const accent = accents[i % accents.length];
              return (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-accent/20 hover:glow-card"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div
                      className={`flex size-11 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${accent}`}
                    >
                      <tool.icon className="size-5" />
                    </div>
                    <h3 className="mt-4 flex items-center gap-1 text-lg font-semibold">
                      {tool.label}
                      <ChevronRight className="size-4 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
