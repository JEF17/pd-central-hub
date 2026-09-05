import { createFileRoute } from "@tanstack/react-router";
import { requirePortalAuth } from "@/lib/portal-auth";
import { Moon, Rows3, Rows4, Settings, Sun } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Label } from "@/components/ui/label";
import { useAppearance } from "@/hooks/use-appearance";
import { cn } from "@/lib/utils";
import type { Density, ThemeMode } from "@/lib/appearance";

export const Route = createFileRoute("/ayarlar")({
  beforeLoad: async ({ location }) => { await requirePortalAuth(location.href); },
  
  head: () => ({
    meta: [
      { title: "Ayarlar — LSPD - Toolkit" },
      { name: "description", content: "LSPD - Toolkit" },
      { property: "og:title", content: "Ayarlar — LSPD - Toolkit" },
      { property: "og:description", content: "LSPD - Toolkit" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { appearance, update } = useAppearance();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Settings className="size-5" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
            <p className="mt-1 text-muted-foreground">
              Görünüm tercihlerini buradan yönet.
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Görünüm</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tema ve arayüz yoğunluğu tercihin tarayıcında saklanır.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Tema</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Option
                  active={appearance.theme === "dark"}
                  onClick={() => update({ theme: "dark" as ThemeMode })}
                  icon={<Moon className="size-4" />}
                  label="Koyu"
                />
                <Option
                  active={appearance.theme === "light"}
                  onClick={() => update({ theme: "light" as ThemeMode })}
                  icon={<Sun className="size-4" />}
                  label="Açık"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                Yoğunluk
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Option
                  active={appearance.density === "comfortable"}
                  onClick={() => update({ density: "comfortable" as Density })}
                  icon={<Rows3 className="size-4" />}
                  label="Rahat"
                />
                <Option
                  active={appearance.density === "compact"}
                  onClick={() => update({ density: "compact" as Density })}
                  icon={<Rows4 className="size-4" />}
                  label="Kompakt"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Option({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-xs font-medium transition-all",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
