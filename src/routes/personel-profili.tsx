import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";

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

export const Route = createFileRoute("/personel-profili")({
  head: () => ({
    meta: [
      { title: "Personel Profili — LSPD Portal" },
      {
        name: "description",
        content:
          "Adı soyadı, seri numarası, rütbe ve division bilgilerini kaydet, raporlarda tek tıkla doldur.",
      },
      { property: "og:title", content: "Personel Profili — LSPD Portal" },
      {
        property: "og:description",
        content: "Personel bilgilerini kaydet ve rapor formlarına otomatik aktar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [data, setData] = useState<OfficerProfile>(emptyOfficerProfile);

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
            <UserCog className="size-5" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personel Profili</h1>
            <p className="mt-1 text-muted-foreground">
              Bilgilerini bir kez kaydet, rapor formlarında "Profilden Doldur" ile aktar.
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
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
                toast.success("Profil kaydedildi");
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
                toast.success("Profil temizlendi");
              }}
            >
              <Trash2 className="size-4" />
              Temizle
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
