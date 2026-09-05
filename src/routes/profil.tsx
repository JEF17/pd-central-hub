import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, IdCard, Save, Trash2, UserRound } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import { usePortalSession } from "@/hooks/use-portal-session";
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

export const Route = createFileRoute("/profil")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href);
  },
  head: () => ({
    meta: [
      { title: "Personel Profili — LSPD - Toolkit" },
      {
        name: "description",
        content: "Karakter fotoğrafın, iletişim bilgilerin ve rütbe bilgilerini tek yerde tut.",
      },
      { property: "og:title", content: "Personel Profili — LSPD - Toolkit" },
      {
        property: "og:description",
        content: "Karakter fotoğrafın, iletişim bilgilerin ve rütbe bilgilerini tek yerde tut.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

/** Fotoğrafı 512px'e küçültüp data URL üretir (tarayıcı deposu sınırlı). */
async function fileToResizedDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Görsel açılamadı"));
    el.src = dataUrl;
  });

  const max = 512;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function Page() {
  const [data, setData] = useState<OfficerProfile>(emptyOfficerProfile);
  const fileRef = useRef<HTMLInputElement>(null);
  const { session } = usePortalSession();

  useEffect(() => {
    const saved = loadOfficerProfile();
    if (saved) setData(saved);
  }, []);

  const set = <K extends keyof OfficerProfile>(key: K, value: OfficerProfile[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const code = divisionCode(data.division);
  const displayName =
    data.name ||
    (session?.selectedCharacter
      ? `${session.selectedCharacter.firstname} ${session.selectedCharacter.lastname}`
      : "İsimsiz Memur");

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IdCard className="size-5" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personel Profili</h1>
            <p className="mt-1 text-muted-foreground">
              Bilgilerini bir kez kaydet, rapor formlarında "Profilden Doldur" ile aktar.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr]">
          <section className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex size-36 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
              {data.photo ? (
                <img src={data.photo} alt={`${displayName} karakter fotoğrafı`} className="size-full object-cover" />
              ) : (
                <UserRound className="size-12 text-muted-foreground" />
              )}
            </div>
            <p className="mt-4 truncate font-semibold">{displayName}</p>
            <p className="text-xs text-muted-foreground">
              {[data.rank, code].filter(Boolean).join(" • ") || "Rütbe belirtilmedi"}
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  set("photo", await fileToResizedDataUrl(file));
                  notify.success("Fotoğraf eklendi, kaydetmeyi unutma");
                } catch {
                  notify.error("Fotoğraf yüklenemedi");
                }
              }}
            />

            <div className="mt-4 flex flex-col gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Camera className="size-4" />
                Fotoğraf Yükle
              </Button>
              {data.photo ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => set("photo", "")}>
                  <Trash2 className="size-4" />
                  Fotoğrafı Kaldır
                </Button>
              ) : null}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Kimlik Bilgileri</h2>

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

            <h2 className="mt-8 text-lg font-semibold">İletişim</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">E-Posta</Label>
                <Input
                  className="mt-2"
                  type="email"
                  value={data.email}
                  placeholder="john.doe@lspd.gov"
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Telefon</Label>
                <Input
                  className="mt-2"
                  value={data.phone}
                  placeholder="555-0100"
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Discord</Label>
                <Input
                  className="mt-2"
                  value={data.discord}
                  placeholder="kullanici_adi"
                  onChange={(e) => set("discord", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Not</Label>
                <Textarea
                  className="mt-2"
                  rows={3}
                  value={data.note}
                  placeholder="Görev bölgesi, ekip bilgisi vb."
                  onChange={(e) => set("note", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  try {
                    saveOfficerProfile(data);
                    notify.success("Profil kaydedildi");
                  } catch {
                    notify.error("Profil kaydedilemedi");
                  }
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
        </div>

      </div>
    </AppShell>
  );
}
