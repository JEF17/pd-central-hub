import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Calculator, ChevronRight, Clock, Files, Gavel, ShieldCheck, Zap } from "lucide-react";

import lspdLogo from "@/assets/lspd-logo.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { navItems } from "@/lib/nav-items";
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

const quickShortcuts = [
  {
    label: "Rapor Oluştur",
    description: "Olay, ifade, tutuklama ve diğer raporlar",
    to: "/paperwork-generators",
    icon: Files,
    tone: "from-primary/25 to-primary/5 text-primary ring-primary/30",
  },
  {
    label: "Süre Hesapla",
    description: "Suçlara göre hapis süresi hesapla",
    to: "/arrest-calculator",
    icon: Calculator,
    tone: "from-gold/25 to-gold/5 text-gold ring-gold/30",
  },
  {
    label: "Ceza Kanunları",
    description: "San Andreas Ceza Kanunu",
    to: "/penal-code",
    icon: BookOpen,
    tone: "from-success/25 to-success/5 text-success ring-success/30",
  },
  {
    label: "Emsal Kararlar",
    description: "Kaynaklar ve emsal kararlar",
    to: "/caselaw",
    icon: Gavel,
    tone: "from-warning/25 to-warning/5 text-warning ring-warning/30",
  },
];

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
        </section>

        {/* Hızlı erişim + Kaldığın yerden devam et */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Hızlı erişim */}
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Zap className="size-4 text-primary" />
              Hızlı Erişim
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {quickShortcuts.map((shortcut) => (
                <Link
                  key={shortcut.to}
                  to={shortcut.to}
                  className="group relative flex items-center gap-3 rounded-xl border border-border bg-card/70 px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/30"
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${shortcut.tone}`}
                  >
                    <shortcut.icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      {shortcut.label}
                      <ChevronRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="block text-[11px] text-muted-foreground">{shortcut.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Kaldığın yerden devam et */}
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Clock className="size-4 text-gold" />
              Kaldığın yerden devam et
            </h2>
            {recent.length > 0 ? (
              <div className="mt-3 grid gap-3">
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
            ) : (
              <div className="mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-4 py-8 text-center">
                <Clock className="size-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm font-medium text-foreground/80">Henüz kayıtlı taslak yok</p>
                <p className="text-xs text-muted-foreground">
                  Rapor jeneratörlerinde çalışmaya başladığında burada görünecek.
                </p>
              </div>
            )}
          </section>
        </div>

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
