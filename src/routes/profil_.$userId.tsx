import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Save, ShieldAlert, UserRound } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notify } from "@/lib/notifications";
import { requirePortalAuth } from "@/lib/portal-auth";
import { usePortalSession } from "@/hooks/use-portal-session";
import {
  adminUpdateUserProfile,
  getUserProfileDetail,
  listUsers,
  type OfficerProfile,
} from "@/lib/portal-auth.functions";
import { divisionProfileOptions, formatRank, rankOptions } from "@/lib/officer-profile";

type UserDto = Awaited<ReturnType<typeof listUsers>>[number];
type ProfilePayload = Awaited<ReturnType<typeof getUserProfileDetail>>;

export const Route = createFileRoute("/profil_/$userId")({
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { admin: true });
  },
  head: () => ({
    meta: [
      { title: "Personel Profili (Yönetici) — LSPD - Toolkit" },
      { name: "description", content: "Yönetici personel profili görüntüleme ve düzenleme." },
      { property: "og:title", content: "Personel Profili (Yönetici) — LSPD - Toolkit" },
      { property: "og:description", content: "Yönetici personel profili görüntüleme ve düzenleme." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { userId } = Route.useParams();
  const { session, loading: sessionLoading } = usePortalSession();
  const [user, setUser] = useState<UserDto | null>(null);
  const [profiles, setProfiles] = useState<OfficerProfile[]>([]);
  const [base, setBase] = useState<ProfilePayload>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const listUsersFn = useServerFn(listUsers);
  const detailFn = useServerFn(getUserProfileDetail);
  const updateFn = useServerFn(adminUpdateUserProfile);

  const canEdit = session?.adminLevel === "query" || session?.adminLevel === "faction_management";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [all, detail] = await Promise.all([listUsersFn({}), detailFn({ data: { userId } })]);
        if (cancelled) return;
        setUser(all.find((u) => u.id === userId) ?? null);
        setBase(detail);
        const list =
          detail?.profiles && detail.profiles.length > 0
            ? detail.profiles
            : detail && (detail.name || detail.serialNo)
              ? [detail]
              : [];
        setProfiles(list.map((p) => ({ ...p })));
      } catch {
        if (!cancelled) notify.error("Profil bilgileri yüklenemedi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const set = (index: number, key: keyof OfficerProfile, value: string) =>
    setProfiles((list) => list.map((p, i) => (i === index ? { ...p, [key]: value } : p)));

  const save = async () => {
    if (!base) return;
    setSaving(true);
    try {
      const first = profiles[0] ?? base;
      const saved = await updateFn({
        data: { userId, profile: { ...first, ...base, ...profiles[0], profiles } },
      });
      setBase(saved);
      notify.success("Personel profili güncellendi");
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Profil güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personel Profili</h1>
            <p className="mt-1 text-muted-foreground">
              {user ? `${user.username} kullanıcısına ait personel kayıtları.` : "Kullanıcı personel kayıtları."}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/admin">
              <ArrowLeft className="mr-2 size-4" />
              Panele Dön
            </Link>
          </Button>
        </div>

        {sessionLoading || loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Yükleniyor…</p>
        ) : !canEdit ? (
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            <ShieldAlert className="size-5 text-destructive" />
            Bu sayfayı görüntülemek için Faction Management veya üstü yetki gerekiyor.
          </div>
        ) : !user ? (
          <p className="mt-8 text-sm text-muted-foreground">Kullanıcı bulunamadı.</p>
        ) : (
          <>
            <section className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
              <Badge variant="outline">GTA World: {user.username}</Badge>
              <Badge variant="outline">User ID: {user.ucpUserId}</Badge>
            </section>

            {profiles.length === 0 ? (
              <p className="mt-8 text-sm text-muted-foreground">Bu kullanıcı henüz personel profili oluşturmamış.</p>
            ) : (
              profiles.map((p, i) => (
                <div key={i} className="mt-8 grid gap-6 md:grid-cols-[280px_1fr]">
                  <section className="rounded-xl border border-border bg-card p-6 text-center">
                    <div className="mx-auto flex size-36 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
                      {p.photo ? (
                        <img src={p.photo} alt={`${p.name || "Personel"} karakter fotoğrafı`} className="size-full object-cover" />
                      ) : (
                        <UserRound className="size-12 text-muted-foreground" />
                      )}
                    </div>
                    <p className="mt-4 truncate font-semibold">{p.name || "İsimsiz Personel"}</p>
                    <p className="text-xs text-muted-foreground">{formatRank(p.rank) || "Rütbe belirtilmedi"}</p>
                  </section>

                  <section className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">
                      Kimlik Bilgileri{profiles.length > 1 ? ` — Personel ${i + 1}` : ""}
                    </h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs">Adı Soyadı</Label>
                        <Input className="mt-2" value={p.name} onChange={(e) => set(i, "name", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">Seri Numarası</Label>
                        <Input className="mt-2" value={p.serialNo} onChange={(e) => set(i, "serialNo", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">Rütbe</Label>
                        <Select value={p.rank} onValueChange={(v) => set(i, "rank", v)}>
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
                        <Label className="text-xs">Görevlendirme</Label>
                        <Select value={p.division} onValueChange={(v) => set(i, "division", v)}>
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
                      <div className="sm:col-span-2">
                        <Label className="text-xs">Görevlendirme Tanımı</Label>
                        <Input
                          className="mt-2"
                          value={p.assignmentDescription}
                          onChange={(e) => set(i, "assignmentDescription", e.target.value)}
                        />
                      </div>
                    </div>

                    <h2 className="mt-8 text-lg font-semibold">İletişim</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs">E-Posta</Label>
                        <Input className="mt-2" type="email" value={p.email} onChange={(e) => set(i, "email", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">Telefon</Label>
                        <Input className="mt-2" value={p.phone} onChange={(e) => set(i, "phone", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">Discord</Label>
                        <Input className="mt-2" value={p.discord} onChange={(e) => set(i, "discord", e.target.value)} />
                      </div>
                    </div>
                  </section>
                </div>
              ))
            )}

            {profiles.length > 0 ? (
              <div className="mt-6">
                <Button disabled={saving} onClick={save}>
                  <Save className="size-4" />
                  {saving ? "Kaydediliyor…" : "Kaydet"}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </AppShell>
  );
}
