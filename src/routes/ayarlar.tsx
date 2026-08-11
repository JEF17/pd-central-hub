import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Moon, Rows3, Rows4, Save, Settings, Sun, Trash2 } from "lucide-react";
import { notify } from "@/lib/notifications";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppearance } from "@/hooks/use-appearance";
import { cn } from "@/lib/utils";
import type { Density, ThemeMode } from "@/lib/appearance";
import {
  clearOfficerProfile,
  divisionCode,
  divisionProfileOptions,
  emptyOfficerProfile,
  loadOfficerProfile,
  rankOptions,
  saveOfficerProfile,
  type OfficerProfile,
} from "@/lib/officer-profile";

export const Route = createFileRoute("/ayarlar")({
  head: () => ({
    meta: [
      { title: "Ayarlar — LSPD - Paperwork Tool" },
      { name: "description", content: "LSPD - Paperwork Tool" },
      { property: "og:title", content: "Ayarlar — LSPD - Paperwork Tool" },
      { property: "og:description", content: "LSPD - Paperwork Tool" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData] = useState<OfficerProfile>(emptyOfficerProfile);
  const { appearance, update } = useAppearance();

  useEffect(() => {
    const saved = loadOfficerProfile();
    if (saved) setData(saved);
  }, []);

  const set = <K extends keyof OfficerProfile>(key: K, value: OfficerProfile[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const code = divisionCode(data.division);

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
              Personel profilini ve görünüm tercihlerini buradan yönet.
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Personel Profili</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Bilgilerini bir kez kaydet, rapor formlarında "Profilden Doldur" ile aktar.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Adı Soyadı</Label>
              <Input
                className="mt-2"
                value={data.name}
                placeholder="John Doe"
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Seri Numarası</Label>
              <Input
                className="mt-2"
                value={data.serialNo}
                placeholder="00000"
                onChange={(e) => set("serialNo", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Rütbe</Label>
              <Select value={data.rank} onValueChange={(v) => set("rank", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {rankOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Division</Label>
              <Select value={data.division} onValueChange={(v) => set("division", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {divisionProfileOptions.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {code ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Raporlarda kullanılacak kısaltma:{" "}
                  <span className="font-mono text-foreground">{code}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                saveOfficerProfile(data);
                notify.success("Profil kaydedildi");
              }}
            >
              <Save className="size-4" />
              Kaydet
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearOfficerProfile();
                setData(emptyOfficerProfile);
                notify.success("Profil temizlendi");
              }}
            >
              <Trash2 className="size-4" />
              Temizle
            </Button>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-6">
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
