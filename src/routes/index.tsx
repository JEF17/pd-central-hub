import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { requirePortalAuth } from "@/lib/portal-auth";
import { ChevronRight, Clock, ShieldCheck, X } from "lucide-react";

import lspdLogo from "@/assets/lspd-logo.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { navItems } from "@/lib/nav-items";
import { useOfficerProfile } from "@/hooks/use-officer-profile";
import { formatRelative, loadRecentDrafts, removeDraft, type RecentDraft } from "@/lib/recent-drafts";

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
      { property: "og:image", content: "https://lspdtoolkit.online/__l5e/assets-v1/65daa519-caf4-4c24-b060-577c9d5f8ed4/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://lspdtoolkit.online/__l5e/assets-v1/65daa519-caf4-4c24-b060-577c9d5f8ed4/og-image.png" },
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

  const handleDismiss = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeDraft(slug);
    setRecent((prev) => prev.filter((d) => d.type.slug !== slug));
  };

  const officerLine = profile?.name
    ? [profile.rank, profile.name].filter(Boolean).join(" ")
    : "Memur profili tanımlı değil";

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
        </section>

        {/* Kaldığın yerden devam et */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Clock className="size-4 text-gold" />
            Kaldığın yerden devam et
          </h2>
          {recent.length > 0 ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map(({ type, savedAt }) => (
                <div key={type.slug} className="group relative">
                  <Link
                    to={draftPaths[type.slug as keyof typeof draftPaths]}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 pr-10 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-accent/30"
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
            <div className="mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center">
              <Clock className="size-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm font-medium text-foreground/80">Henüz kayıtlı taslak yok</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Rapor hazırlamaya başladığınızda son kaydettikleriniz burada listelenecek.
              </p>
            </div>
          )}
        </section>

        {/* Araçlar */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Araçlar</h2>
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
