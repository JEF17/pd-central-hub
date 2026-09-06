import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requirePortalAuth } from "@/lib/portal-auth";
import { usePortalSession } from "@/hooks/use-portal-session";
import { divisionProfileOptions, rankOptions } from "@/lib/officer-profile";
import { loadOfficerProfiles } from "@/lib/officer-profile";
import {
  createRosterEntry,
  deleteRosterEntry,
  listRoster,
  updateRosterEntry,
  type RosterEntry,
} from "@/lib/roster.functions";

export const Route = createFileRoute("/calisan-listesi")({
  head: () => ({
    meta: [
      { title: "Çalışan Listesi | LSPD - Toolkit" },
      { name: "description", content: "LSPD personel kadrosu: rütbe, seri numarası ve divizyon bilgileri." },
      { property: "og:title", content: "Çalışan Listesi | LSPD - Toolkit" },
      { property: "og:description", content: "LSPD personel kadrosu: rütbe, seri numarası ve divizyon bilgileri." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href);
  },
  component: RosterPage,
});

type FormState = {
  id: string | null;
  name: string;
  serialNo: string;
  rank: string;
  division: string;
  photo: string;
  email: string;
  phone: string;
  discord: string;
  status: string;
  sortOrder: string;
};

const emptyForm: FormState = {
  id: null,
  name: "",
  serialNo: "",
  rank: "",
  division: "",
  photo: "",
  email: "",
  phone: "",
  discord: "",
  status: "active",
  sortOrder: "0",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  loa: "İzinli (LOA)",
  inactive: "Pasif",
};

function RosterPage() {
  const { session } = usePortalSession();
  const isAdmin = !!session?.isAdmin;

  const [entries, setEntries] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const listFn = useServerFn(listRoster);
  const createFn = useServerFn(createRosterEntry);
  const updateFn = useServerFn(updateRosterEntry);
  const deleteFn = useServerFn(deleteRosterEntry);

  const refresh = async () => {
    setLoading(true);
    try {
      setEntries(await listFn({}));
    } catch {
      toast.error("Liste yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? entries
      : entries.filter((e) =>
          [e.name, e.serialNo, e.rank, e.division, e.email, e.discord]
            .join(" ")
            .toLowerCase()
            .includes(q),
        );
    const rankIndex = (rank: string) => {
      const i = rankOptions.indexOf(rank);
      return i === -1 ? -1 : i;
    };
    return [...base].sort((a, b) => {
      const diff = rankIndex(b.rank) - rankIndex(a.rank);
      if (diff !== 0) return diff;
      const order = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (order !== 0) return order;
      return a.name.localeCompare(b.name, "tr");
    });
  }, [entries, query]);


  const openCreate = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (entry: RosterEntry) => {
    setForm({
      id: entry.id,
      name: entry.name,
      serialNo: entry.serialNo,
      rank: entry.rank,
      division: entry.division,
      photo: entry.photo,
      email: entry.email,
      phone: entry.phone,
      discord: entry.discord,
      status: entry.status || "active",
      sortOrder: String(entry.sortOrder ?? 0),
    });
    setOpen(true);
  };

  const fillFromMyProfile = () => {
    const { profiles, activeId } = loadOfficerProfiles();
    const p = profiles.find((x) => x.id === activeId) ?? profiles[0];
    if (!p) return;
    setForm((f) => ({
      ...f,
      name: p.name,
      serialNo: p.serialNo,
      rank: p.rank,
      division: p.division,
      photo: p.photo,
      email: p.email,
      phone: p.phone,
      discord: p.discord,
    }));
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("İsim zorunludur");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        serialNo: form.serialNo,
        rank: form.rank,
        division: form.division,
        photo: form.photo,
        email: form.email,
        phone: form.phone,
        discord: form.discord,
        status: form.status,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (form.id) {
        await updateFn({ data: { ...payload, id: form.id } });
        toast.success("Personel güncellendi");
      } else {
        await createFn({ data: payload });
        toast.success("Personel eklendi");
      }
      setOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (entry: RosterEntry) => {
    if (!window.confirm(`"${entry.name}" listeden silinsin mi?`)) return;
    try {
      await deleteFn({ data: { id: entry.id } });
      toast.success("Personel silindi");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Silinemedi");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Çalışan Listesi</h1>
            <p className="text-sm text-muted-foreground">
              Departman kadrosu. Yöneticiler personel ekleyip düzenleyebilir.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Personel ara…"
                className="w-56 pl-9"
              />
            </div>
            {isAdmin ? (
              <Button onClick={openCreate}>
                <Plus className="mr-1 size-4" />
                Personel Ekle
              </Button>
            ) : null}
          </div>
        </div>

        <section>
          <div className="mb-5 border-b border-border pb-3">
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-primary">
              Mission Row Area
            </h2>
            <h3 className="mt-1 flex items-center gap-2 text-base font-semibold text-foreground/90">
              <Users className="size-4 text-primary" />
              Mission Row Community Police Station
              <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span>
            </h3>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Yükleniyor…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {entries.length === 0 ? "Henüz personel eklenmemiş." : "Aramanla eşleşen personel yok."}
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <CardContent className="flex flex-wrap items-center gap-4 p-4">
                    <div className="size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted/40">
                      {entry.photo ? (
                        <img
                          src={entry.photo}
                          alt={`${entry.name} fotoğrafı`}
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-[200px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold">{entry.name}</span>
                        <Badge variant={entry.status === "active" ? "secondary" : "outline"}>
                          {STATUS_LABELS[entry.status] ?? entry.status}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-primary">{entry.rank || "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        {entry.serialNo ? `Seri No: #${entry.serialNo}` : "Seri No: —"}
                        {entry.division ? ` • ${entry.division}` : ""}
                      </div>
                    </div>

                    <div className="min-w-[180px] text-xs text-muted-foreground">
                      {entry.email ? <div className="truncate">{entry.email}</div> : null}
                      {entry.phone ? <div className="truncate">{entry.phone}</div> : null}
                      {entry.discord ? <div className="truncate">Discord: {entry.discord}</div> : null}
                      {!entry.email && !entry.phone && !entry.discord ? "—" : null}
                    </div>

                    {isAdmin ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(entry)}>
                          <Pencil className="size-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(entry)}>
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Personeli Düzenle" : "Personel Ekle"}</DialogTitle>
            <DialogDescription>
              Çalışan listesinde görünecek bilgileri doldurun. Yalnızca isim zorunludur.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={fillFromMyProfile}>
                Profilimden Doldur
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roster-name">Ad Soyad</Label>
              <Input
                id="roster-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roster-serial">Seri Numarası</Label>
              <Input
                id="roster-serial"
                value={form.serialNo}
                onChange={(e) => setForm({ ...form, serialNo: e.target.value })}
                placeholder="12345"
              />
            </div>
            <div className="space-y-2">
              <Label>Rütbe</Label>
              <Select value={form.rank} onValueChange={(v) => setForm({ ...form, rank: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Rütbe seç" />
                </SelectTrigger>
                <SelectContent>
                  {rankOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Division</Label>
              <Select
                value={form.division}
                onValueChange={(v) => setForm({ ...form, division: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Division seç" />
                </SelectTrigger>
                <SelectContent>
                  {divisionProfileOptions.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roster-email">E-Posta</Label>
              <Input
                id="roster-email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="serino@lspd.online"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roster-phone">Telefon</Label>
              <Input
                id="roster-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roster-discord">Discord</Label>
              <Input
                id="roster-discord"
                value={form.discord}
                onChange={(e) => setForm({ ...form, discord: e.target.value })}
                placeholder="Kullanıcı Adı"
              />
            </div>
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roster-sort">Sıra</Label>
              <Input
                id="roster-sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Vazgeç
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? "Kaydediliyor…" : form.id ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
