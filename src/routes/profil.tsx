import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { IdCard, Plus, Save, Trash2, UserRound, Users } from "lucide-react";

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
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import { usePortalSession } from "@/hooks/use-portal-session";
import {
  saveOfficerProfile as saveOfficerProfileServer,
} from "@/lib/portal-auth.functions";
import {
  createEmptyStoredProfile,
  divisionProfileOptions,
  emptyOfficerProfile,
  loadOfficerProfiles,
  profileLabel,
  rankOptions,
  saveOfficerProfiles,
  type OfficerProfile,
  type StoredOfficerProfile,
} from "@/lib/officer-profile";


export const Route = createFileRoute("/profil")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { allowIncompleteProfile: true });
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

function Page() {
  const [profiles, setProfiles] = useState<StoredOfficerProfile[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { session } = usePortalSession();
  const router = useRouter();
  const mustCreateProfile = session ? !session.profileCompleted : false;
  const saveProfileFn = useServerFn(saveOfficerProfileServer);

  useEffect(() => {
    const store = loadOfficerProfiles();
    setProfiles(store.profiles);
    setActiveId(store.activeId);
  }, []);

  const active = profiles.find((p) => p.id === activeId);
  const data: OfficerProfile = active ?? emptyOfficerProfile;

  const set = <K extends keyof OfficerProfile>(key: K, value: OfficerProfile[K]) =>
    setProfiles((list) => list.map((p) => (p.id === activeId ? { ...p, [key]: value } : p)));

  const persist = (list: StoredOfficerProfile[], id: string) => {
    setProfiles(list);
    setActiveId(id);
    saveOfficerProfiles({ profiles: list, activeId: id });
  };

  const addProfile = () => {
    const fresh = createEmptyStoredProfile();
    persist([...profiles, fresh], fresh.id);
    notify.success("Yeni personel profili eklendi");
  };

  const removeActiveProfile = () => {
    if (profiles.length <= 1) {
      const fresh = createEmptyStoredProfile();
      persist([fresh], fresh.id);
      notify.success("Profil temizlendi");
      return;
    }
    const rest = profiles.filter((p) => p.id !== activeId);
    persist(rest, rest[0]!.id);
    notify.success("Personel profili silindi");
  };

  const charPhoto = (() => {
    const list = session?.portalCharacters ?? [];
    const approved = list.filter((c) => !!c.photo);
    const selectedId = session?.selectedCharacter?.id;
    const match = approved.find((c) => c.id === selectedId) ?? approved[0];
    return match?.photo ?? "";
  })();
  const photo = charPhoto || data.photo;

  useEffect(() => {
    if (charPhoto && activeId && data.photo !== charPhoto) set("photo", charPhoto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charPhoto, activeId]);

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
              Birden fazla personel kaydı oluştur, aralarında geçiş yap ve raporlarda kullan.
            </p>
          </div>
        </div>

        {mustCreateProfile ? (
          <div className="mt-6 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
            Panele erişebilmek için önce personel profilini oluşturman gerekiyor. Adı Soyadı, Seri
            Numarası ve Rütbe alanlarını doldurup <strong>Kaydet</strong>'e bas.
          </div>
        ) : null}

        <section className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
          <div className="min-w-56 flex-1">
            <Label className="flex items-center gap-2 text-xs">
              <Users className="size-3.5" />
              Aktif Personel
            </Label>
            <Select
              value={activeId}
              onValueChange={(v) => persist(profiles, v)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Profil seç" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {profiles.map((p, i) => (
                  <SelectItem key={p.id} value={p.id}>
                    {profileLabel(p, i)}
                    {p.rank ? ` — ${p.rank}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="outline" onClick={addProfile}>
            <Plus className="size-4" />
            Personel Ekle
          </Button>
          <Button type="button" variant="ghost" onClick={removeActiveProfile}>
            <Trash2 className="size-4" />
            Profili Sil
          </Button>
        </section>


        <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr]">
          <section className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex size-36 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
              {photo ? (
                <img src={photo} alt={`${displayName} karakter fotoğrafı`} className="size-full object-cover" />
              ) : (
                <UserRound className="size-12 text-muted-foreground" />
              )}
            </div>
            <p className="mt-4 truncate font-semibold">{displayName}</p>
            <p className="text-xs text-muted-foreground">
              {data.rank || "Rütbe belirtilmedi"}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Karakter fotoğrafı MDC üzerinden otomatik gelir.
            </p>
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
                  placeholder="serino@lspd.online"
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
                  placeholder="Kullanıcı Adı"
                  onChange={(e) => set("discord", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    saveOfficerProfiles({ profiles, activeId });
                    const { id: _id, ...rest } = (active ??
                      { ...emptyOfficerProfile, id: "" }) as StoredOfficerProfile;
                    const all = profiles.map(({ id: _pid, ...p }) => p);
                    if (!rest.name.trim() || !rest.rank.trim() || !rest.serialNo.trim()) {
                      notify.error("Adı Soyadı, Seri Numarası ve Rütbe zorunludur");
                      return;
                    }
                    await saveProfileFn({ data: { ...rest, profiles: all } });
                    notify.success("Profil kaydedildi");
                    if (mustCreateProfile) {
                      await router.invalidate();
                      router.navigate({ to: "/" });
                    }
                  } catch {
                    notify.error("Profil kaydedilemedi");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <Save className="size-4" />
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  persist(
                    profiles.map((p) => (p.id === activeId ? { ...emptyOfficerProfile, id: p.id } : p)),
                    activeId,
                  );
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
