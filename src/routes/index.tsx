import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { requirePortalAuth } from "@/lib/portal-auth";
import { ChevronRight, Clock, ShieldCheck, X } from "lucide-react";

import lspdLogo from "@/assets/lspd-logo.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { navItems } from "@/lib/nav-items";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import {
  formatRelative,
  loadRecentDrafts,
  removeDraft,
  syncDraftsFromServer,
  type RecentDraft,
} from "@/lib/recent-drafts";
import { formatRank } from "@/lib/officer-profile";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href);
  },

  head: () => ({
    meta: [
      { title: "LSPD Toolkit" },
      { name: "description", content: "LSPD Toolkit" },
      { property: "og:title", content: "LSPD Toolkit" },
      { property: "og:description", content: "LSPD Toolkit" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://lspdtoolkit.online/__l5e/assets-v1/0360ca9c-cbda-4ef2-b913-7b42f56ebf1e/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://lspdtoolkit.online/__l5e/assets-v1/0360ca9c-cbda-4ef2-b913-7b42f56ebf1e/og-image.png" },
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
  const tools = navItems.filter((i) => i.to !== "/" && i.position !== "bottom" && !i.groupKey);
  const profile = useOfficerProfile();
  const [recent, setRecent] = useState<RecentDraft[]>([]);

  useEffect(() => {
    setRecent(loadRecentDrafts(4));
    let cancelled = false;
    // Sunucudaki taslakları indir (yeni cihaz / temizlenmiş tarayıcı)
    void syncDraftsFromServer().then(() => {
      if (!cancelled) setRecent(loadRecentDrafts(4));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDismiss = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeDraft(slug);
    setRecent((prev) => prev.filter((d) => d.type.slug !== slug));
  };

  const officerLine = profile?.name
    ? [formatRank(profile.rank), profile.name].filter(Boolean).join(" ")
    : "Memur profili tanımlı değil";

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Karşılama */}
        <section className="gradient-border surface-glow relative overflow-hidden rounded-2xl bg-card/60 p-8">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-10 size-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            <div className="hidden shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 p-2 shadow-lg shadow-primary/10 ring-1 ring-primary/20 sm:block">
              <img src={lspdLogo.url} alt="LSPD rozeti" className="size-16 object-contain opacity-90" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/90">{greeting()}</p>
              <h1 className="text-gradient text-glow mt-1 text-4xl font-extrabold tracking-tight">LSPD Toolkit</h1>
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
          <div className="relative mt-7 flex flex-wrap gap-3">
            <Link
              to="/paperwork-generators"
              className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-background shadow-[0_0_22px_color-mix(in_oklab,var(--gold)_25%,transparent)] transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              Yeni Rapor Oluştur
            </Link>
            <Link
              to="/penal-code"
              className="rounded-lg border border-border bg-muted/40 px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-accent/40"
            >
              Ceza Kanunları
            </Link>
          </div>
        </section>

        {/* Kaldığın yerden devam et */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
            <span className="h-5 w-1 rounded-full bg-gold" />
            Kaldığın yerden devam et
          </h2>
          {recent.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map(({ type, savedAt }) => (
                <div key={type.slug} className="group relative">
                  <Link
                    to={draftPaths[type.slug as keyof typeof draftPaths]}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 pr-10 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-accent/30"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold ring-1 ring-gold/25">
                      <type.icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{type.label}</span>
                      <span className="block text-[11px] text-muted-foreground">{formatRelative(savedAt)}</span>
                    </span>
                    <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                  </Link>
                  <button
                    type="button"
                    aria-label={`${type.label} taslağını kaldır`}
                    onClick={(e) => handleDismiss(e, type.slug)}
                    className="evidence-remove absolute right-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="group mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-card/30 px-4 py-9 text-center transition-colors hover:border-gold/30">
              <Clock className="size-8 text-muted-foreground/40 transition-colors group-hover:text-gold/50" />
              <p className="mt-2 text-sm font-medium text-foreground/80">Aktif taslağınız bulunmuyor</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Rapor hazırlamaya başladığınızda son kaydettikleriniz burada listelenecek.
              </p>
            </div>
          )}
        </section>

        {/* Araçlar */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
            <span className="h-5 w-1 rounded-full bg-gold" />
            Hızlı Araçlar
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => {
              const accent = accents[i % accents.length];
              return (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-accent/20 hover:glow-card"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div
                      className={`flex size-12 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${accent}`}
                    >
                      <tool.icon className="size-5" />
                    </div>
                    <h3 className="mt-5 flex items-center gap-1 text-base font-bold tracking-tight">
                      {tool.label}
                      <ChevronRight className="size-4 text-gold opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
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

