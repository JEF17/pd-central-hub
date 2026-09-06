import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Mail, Pencil, Phone, Plus, Search, Trash2, UserRound, Users } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
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
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  createRosterEntry,
  deleteRosterEntry,
  listRoster,
  updateRosterEntry,
  type RosterEntry,
  type RosterInput,
} from "@/lib/roster.functions";
import { divisionProfileOptions, rankOptions } from "@/lib/officer-profile";
import { usePortalSession } from "@/hooks/use-portal-session";
import { toast } from "sonner";

export const Route = createFileRoute("/calisan-listesi")({
  head: () => ({
    meta: [
      { title: "Personel Listesi | LSPD - Toolkit" },
      {
        name: "description",
        content: "LSPD personel kadrosu; görevlendirme ve istasyonlara göre personel kartları.",
      },
      { property: "og:title", content: "Personel Listesi | LSPD - Toolkit" },
      {
        property: "og:description",
        content: "LSPD personel kadrosu; görevlendirme ve istasyonlara göre personel kartları.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href);
  },
  component: RosterPage,
});

/** Rütbe hiyerarşisi: listede ne kadar öndeyse o kadar düşük rütbe. */
function rankWeight(rank: string): number {
  const idx = rankOptions.findIndex((r) => r.toLowerCase() === rank.trim().toLowerCase());
  return idx === -1 ? -1 : idx;
}

const emptyForm: RosterInput = {
  name: "",
  serialNo: "",
  rank: "",
  division: "",
  photo: "",
  email: "",
  phone: "",
  discord: "",
  status: "active",
};

function RosterPage() {
  const { session } = usePortalSession();
  const canManage = session?.adminLevel === "query" || session?.adminLevel === "faction_management";

  const [entries, setEntries] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RosterEntry | null>(null);
  const [form, setForm] = useState<RosterInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchList = useServerFn(listRoster);
  const doCreate = useServerFn(createRosterEntry);
  const doUpdate = useServerFn(updateRosterEntry);
  const doDelete = useServerFn(deleteRosterEntry);

  const reload = async () => {
    setLoading(true);
    try {
      setEntries(await fetchList({}));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? entries.filter((e) =>
          [e.name, e.serialNo, e.rank, e.division, e.discord]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : entries;
    // En yüksek rütbe en üstte
    return [...filtered].sort(
      (a, b) => rankWeight(b.rank) - rankWeight(a.rank) || a.name.localeCompare(b.name, "tr"),
    );
  }, [entries, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (entry: RosterEntry) => {
    setEditing(entry);
    setForm({
      name: entry.name,
      serialNo: entry.serialNo,
      rank: entry.rank,
      division: entry.division,
      photo: entry.photo,
      email: entry.email,
      phone: entry.phone,
      discord: entry.discord,
      status: entry.status,
      note: entry.note,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name?.trim()) {
      toast.error("İsim zorunludur");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await doUpdate({ data: { ...form, id: editing.id } });
        toast.success("Personel güncellendi");
      } else {
        await doCreate({ data: form });
        toast.success("Personel eklendi");
      }
      setDialogOpen(false);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry: RosterEntry) => {
    if (!window.confirm(`${entry.name} listeden silinsin mi?`)) return;
    try {
      await doDelete({ data: { id: entry.id } });
      toast.success("Personel silindi");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Silme başarısız");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
              <Users className="size-6 text-primary" />
              Personel Listesi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Görevlendirme ve istasyonlara göre personel kadrosu.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İsim, seri no, rütbe ara..."
                className="w-64 pl-9"
              />
            </div>
            {canManage && (
              <Button onClick={openCreate}>
                <Plus className="mr-1.5 size-4" />
                Personel Ekle
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">Yükleniyor...</p>
        ) : sortedEntries.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <UserRound className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {entries.length === 0
                ? "Henüz personel eklenmemiş."
                : "Aramanızla eşleşen personel bulunamadı."}
            </p>
            {canManage && entries.length === 0 && (
              <Button variant="outline" size="sm" onClick={openCreate}>
                <Plus className="mr-1.5 size-4" />
                İlk personeli ekle
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <section>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Mission Row Community Police Station
                </h2>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  {sortedEntries.length} personel
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {sortedEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center gap-3.5 p-4">
                        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                          {entry.photo ? (
                            <img
                              src={entry.photo}
                              alt={entry.name}
                              className="size-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <UserRound className="size-7 text-muted-foreground/40" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold leading-tight">{entry.name}</h3>
                          {entry.rank && (
                            <p className="mt-0.5 truncate text-xs font-medium text-primary">
                              {entry.rank}
                            </p>
                          )}
                          {entry.serialNo && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              Seri No: {entry.serialNo}
                            </p>
                          )}
                        </div>
                      </div>
                      {(entry.email || entry.phone || entry.discord) && (
                        <div className="space-y-1 border-t px-4 py-2.5 text-xs text-muted-foreground">
                          {entry.email && (
                            <p className="flex items-center gap-1.5 truncate">
                              <Mail className="size-3 shrink-0" /> {entry.email}
                            </p>
                          )}
                          {entry.phone && (
                            <p className="flex items-center gap-1.5 truncate">
                              <Phone className="size-3 shrink-0" /> {entry.phone}
                            </p>
                          )}
                          {entry.discord && (
                            <p className="truncate">Discord: {entry.discord}</p>
                          )}
                        </div>
                      )}
                      {canManage && (
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => openEdit(entry)}
                            className="flex size-7 items-center justify-center rounded-md border bg-background/90 text-muted-foreground shadow-sm hover:text-foreground"
                            title="Düzenle"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry)}
                            className="flex size-7 items-center justify-center rounded-md border bg-background/90 text-muted-foreground shadow-sm hover:text-destructive"
                            title="Sil"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Personeli Düzenle" : "Yeni Personel"}</DialogTitle>
            <DialogDescription>
              Personelin kadroda görünecek bilgilerini girin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="roster-name">Adı Soyadı</Label>
              <Input
                id="roster-name"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Alexandra Grasso"
              />
            </div>
            <div>
              <Label htmlFor="roster-serial">Seri Numarası</Label>
              <Input
                id="roster-serial"
                value={form.serialNo ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, serialNo: e.target.value }))}
                placeholder="4567"
              />
            </div>
            <div>
              <Label htmlFor="roster-rank">Rütbe</Label>
              <Input
                id="roster-rank"
                list="roster-ranks"
                value={form.rank ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, rank: e.target.value }))}
                placeholder="Police Officer III"
              />
              <datalist id="roster-ranks">
                {rankOptions.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>
            <div className="col-span-2">
              <Label htmlFor="roster-division">Görevlendirme / İstasyon</Label>
              <Input
                id="roster-division"
                list="roster-divisions"
                value={form.division ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, division: e.target.value }))}
                placeholder="Mission Row Area Patrol Division"
              />
              <datalist id="roster-divisions">
                {divisionProfileOptions.map((d) => (
                  <option key={d.value} value={d.value} />
                ))}
              </datalist>
            </div>
            <div className="col-span-2">
              <Label htmlFor="roster-photo">Fotoğraf URL</Label>
              <Input
                id="roster-photo"
                value={form.photo ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="roster-email">E-Posta</Label>
              <Input
                id="roster-email"
                value={form.email ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="serino@lspd.online"
              />
            </div>
            <div>
              <Label htmlFor="roster-phone">Telefon</Label>
              <Input
                id="roster-phone"
                value={form.phone ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="555-0100"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="roster-discord">Discord</Label>
              <Input
                id="roster-discord"
                value={form.discord ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, discord: e.target.value }))}
                placeholder="Kullanıcı Adı"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Vazgeç
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Kaydediliyor..." : editing ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
