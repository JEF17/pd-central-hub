import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { Check, ChevronDown, ChevronRight, IdCard, ScrollText, Shield, ShieldCheck, Trash2, Users2, UserX, X } from "lucide-react";
import { portalGroups } from "@/lib/portal-groups";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  ADMIN_LEVEL_LABELS,
  approveUser,
  deleteUser,
  getUserProfileDetail,
  listPortalLogs,
  listUsers,
  rejectUser,
  setUserAdminLevel,
  setUserGroupsFn,
  type AdminLevel,
  type PortalLogDto,
} from "@/lib/portal-auth.functions";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePortalSession } from "@/hooks/use-portal-session";
import { toast } from "sonner";
import { formatRank } from "@/lib/officer-profile";

type UserDto = Awaited<ReturnType<typeof listUsers>>[number];
type ProfilePayload = Awaited<ReturnType<typeof getUserProfileDetail>>;

function userProfiles(payload: ProfilePayload) {
  const list = payload?.profiles ?? [];
  if (list.length > 0) return list;
  return payload && (payload.name || payload.serialNo) ? [payload] : [];
}


/** Kullanıcının özel alan (grup) izinleri. */
function GroupPermissions({ user, canEdit }: { user: UserDto; canEdit: boolean }) {
  const [groups, setGroups] = useState<string[]>(user.groups ?? []);
  const [saving, setSaving] = useState(false);
  const saveFn = useServerFn(setUserGroupsFn);

  const toggle = async (key: string) => {
    const next = groups.includes(key) ? groups.filter((g) => g !== key) : [...groups, key];
    const prev = groups;
    setGroups(next);
    setSaving(true);
    try {
      await saveFn({ data: { userId: user.id, groups: next } });
      toast.success("Grup yetkileri güncellendi");
    } catch (err) {
      setGroups(prev);
      toast.error(err instanceof Error ? err.message : "Grup yetkisi güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-4 rounded-lg border border-border bg-card p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Users2 className="size-4 text-primary" />
        Gruplar
      </p>
      <div className="flex flex-wrap gap-2">
        {portalGroups.map((g) => {
          const active = groups.includes(g.key);
          return (
            <button
              key={g.key}
              type="button"
              disabled={!canEdit || saving}
              onClick={() => toggle(g.key)}
              className={
                active
                  ? "rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-60"
                  : "rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
              }
            >
              {g.label}
            </button>
          );
        })}
      </div>
      {!canEdit ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Grup yetkisi vermek için Faction Management veya üstü gerekir.
        </p>
      ) : null}
    </div>
  );
}

function ProfileDetails({
  user,
  payload,
  loading,
  colSpan,
  canEdit,
}: {
  user: UserDto;
  payload: ProfilePayload;
  loading: boolean;
  colSpan: number;
  canEdit: boolean;
}) {
  const profiles = userProfiles(payload);
  return (
    <TableRow className="bg-muted/30 hover:bg-muted/30">
      <TableCell colSpan={colSpan} className="p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Badge variant="outline">GTA World: {user.username}</Badge>
          <Badge variant="outline">User ID: {user.ucpUserId}</Badge>
          {canEdit ? (
            <Button asChild size="sm" variant="outline" className="ml-auto" disabled={loading}>
              <Link to="/profil/$userId" params={{ userId: user.id }}>
                <IdCard className="mr-1 size-3" />
                Profil Sayfasına Git
              </Link>
            </Button>
          ) : null}
        </div>
        <GroupPermissions user={user} canEdit={canEdit} />
        {loading ? (
          <p className="text-sm text-muted-foreground">Profil yükleniyor…</p>
        ) : profiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">Bu kullanıcı henüz personel profili oluşturmamış.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p, i) => (
              <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                <div className="size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted/40">
                  {p.photo ? (
                    <img src={p.photo} alt={`${p.name || "Personel"} fotoğrafı`} className="size-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 text-sm">
                  <p className="truncate font-semibold">{p.name || "İsimsiz Personel"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatRank(p.rank) || "Rütbe yok"}
                    {p.serialNo ? ` • #${p.serialNo}` : ""}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{p.division || "Division yok"}</p>
                  {p.assignmentDescription ? (
                    <p className="truncate text-xs text-muted-foreground">{p.assignmentDescription}</p>
                  ) : null}
                  {p.email ? <p className="truncate text-xs text-muted-foreground">{p.email}</p> : null}
                  {p.phone ? <p className="truncate text-xs text-muted-foreground">{p.phone}</p> : null}
                  {p.discord ? <p className="truncate text-xs text-muted-foreground">Discord: {p.discord}</p> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

/** Açılıp kapanabilen bölüm başlığı. */
function SectionCard({
  title,
  icon,
  count,
  open,
  onToggle,
  className,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  open: boolean;
  onToggle: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="cursor-pointer select-none" onClick={onToggle}>
        <CardTitle className="flex items-center gap-2 text-base">
          {open ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
          {icon}
          {title}
          <Badge variant="secondary" className="ml-auto tabular-nums">
            {count}
          </Badge>
        </CardTitle>
      </CardHeader>
      {open ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Yönetim Paneli | LSPD - Toolkit" },
      { name: "description", content: "Kullanıcı onayları ve rol yönetimi" },
      { property: "og:title", content: "Yönetim Paneli | LSPD - Toolkit" },
      { property: "og:description", content: "Kullanıcı onayları ve rol yönetimi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href, { admin: true });
  },
  component: AdminPage,
});

function AdminPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, ProfilePayload>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pending: true,
    approved: false,
    rejected: false,
    logs: false,
  });
  const toggleSection = (key: string) => setOpenSections((cur) => ({ ...cur, [key]: !cur[key] }));

  const [logs, setLogs] = useState<PortalLogDto[]>([]);

  const listUsersFn = useServerFn(listUsers);
  const listLogsFn = useServerFn(listPortalLogs);
  const detailFn = useServerFn(getUserProfileDetail);
  const approveFn = useServerFn(approveUser);
  const rejectFn = useServerFn(rejectUser);
  const setLevelFn = useServerFn(setUserAdminLevel);
  const deleteFn = useServerFn(deleteUser);
  const { session } = usePortalSession();
  const myLevel = session?.adminLevel ?? null;
  const canViewLogs = myLevel === "query" || myLevel === "faction_management";
  const canEditProfiles = myLevel === "query" || myLevel === "faction_management";



  const toggleExpanded = (id: string) => {
    setExpanded((cur) => (cur === id ? null : id));
    if (expanded === id || details[id] !== undefined) return;
    setDetailLoading(id);
    detailFn({ data: { userId: id } })
      .then((payload) => setDetails((cur) => ({ ...cur, [id]: payload })))
      .catch(() => setDetails((cur) => ({ ...cur, [id]: null })))
      .finally(() => setDetailLoading((cur) => (cur === id ? null : cur)));
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const all = await listUsersFn({});
      setUsers(all);
      setDetails({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!canViewLogs) return;
    listLogsFn({})
      .then(setLogs)
      .catch(() => setLogs([]));
  }, [canViewLogs]);

  const matches = (u: UserDto) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [u.username, u.profile?.name, u.profile?.rank, u.profile?.division, u.profile?.serialNo]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q));
  };

  const pendingUsers = users.filter((u) => u.status === "pending" && matches(u));
  const approvedUsers = users.filter((u) => u.status === "approved" && matches(u));
  const rejectedUsers = users.filter((u) => u.status === "rejected" && matches(u));

  const handleApprove = async (id: string) => {
    await approveFn({ data: { userId: id } });
    await refresh();
  };

  const handleReject = async (id: string) => {
    await rejectFn({ data: { userId: id } });
    await refresh();
  };

  const canManageRoles = myLevel === "query" || myLevel === "faction_management";

  const availableLevels: Array<{ value: string; label: string }> = [
    { value: "none", label: "Kullanıcı" },
    { value: "supervisor", label: ADMIN_LEVEL_LABELS.supervisor },
    ...(myLevel === "query"
      ? [
          { value: "faction_management", label: ADMIN_LEVEL_LABELS.faction_management },
          { value: "query", label: ADMIN_LEVEL_LABELS.query },
        ]
      : []),
  ];

  const handleLevelChange = async (user: UserDto, value: string) => {
    try {
      await setLevelFn({
        data: { userId: user.id, level: value === "none" ? null : (value as AdminLevel) },
      });
      toast.success("Yetki güncellendi");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yetki güncellenemedi");
    }
  };

  const canDeleteUsers = myLevel === "query" || myLevel === "faction_management";

  const canDeleteUser = (user: UserDto) =>
    canDeleteUsers &&
    !user.isProtectedQuery &&
    user.id !== session?.id &&
    (myLevel === "query" || (user.adminLevel !== "query" && user.adminLevel !== "faction_management"));

  const handleDelete = async (user: UserDto) => {
    const ok = window.confirm(
      `"${user.username}" kullanıcısını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
    );
    if (!ok) return;
    try {
      await deleteFn({ data: { userId: user.id } });
      toast.success("Kullanıcı silindi");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kullanıcı silinemedi");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Yönetim Paneli</h1>
            <p className="text-sm text-muted-foreground">Kullanıcı onayları ve yönetici rolü atamaları.</p>
          </div>
          <Link to="/">
            <Button variant="outline">Ana Sayfaya Dön</Button>
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Onay Bekleyen",
              value: pendingUsers.length,
              icon: <UserX className="size-4 text-warning" />,
            },
            {
              label: "Aktif Kullanıcı",
              value: approvedUsers.length,
              icon: <ShieldCheck className="size-4 text-primary" />,
            },
            {
              label: "Reddedilen",
              value: rejectedUsers.length,
              icon: <X className="size-4 text-destructive" />,
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between py-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">{stat.value}</p>
                </div>
                {stat.icon}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kullanıcı adı, personel adı, rütbe ara…"
            className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <SectionCard
          className="mb-6"
          title="Onay Bekleyen Kullanıcılar"
          icon={<UserX className="size-4 text-warning" />}
          count={pendingUsers.length}
          open={!!openSections["pending"]}
          onToggle={() => toggleSection("pending")}
        >
          <div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Yükleniyor…</p>
            ) : pendingUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Onay bekleyen kullanıcı yok.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>UCP Kullanıcı Adı</TableHead>
                    <TableHead>Personel Ad Soyad</TableHead>
                    <TableHead>Rütbe</TableHead>
                    <TableHead>Karakterler</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <Fragment key={user.id}>
                      <TableRow className="cursor-pointer" onClick={() => toggleExpanded(user.id)}>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            {expanded === user.id ? (
                              <ChevronDown className="size-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground" />
                            )}
                            {user.username}
                          </span>
                        </TableCell>
                        <TableCell>{user.profile?.name || "—"}</TableCell>
                        <TableCell>{formatRank(user.profile?.rank) || "—"}</TableCell>
                        <TableCell className="max-w-[280px] truncate">
                          {user.characters.length > 0
                            ? user.characters.map((c) => `${c.firstname} ${c.lastname}`).join(", ")
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="default" onClick={() => handleApprove(user.id)}>
                              <Check className="mr-1 size-3" />
                              Onayla
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(user.id)}>
                              <X className="mr-1 size-3" />
                              Reddet
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expanded === user.id ? (
                        <ProfileDetails
                          user={user}
                          payload={details[user.id] ?? null}
                          loading={detailLoading === user.id}
                          colSpan={5}
                          canEdit={canEditProfiles}
                        />
                      ) : null}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Tüm Kullanıcılar"
          icon={<ShieldCheck className="size-4 text-primary" />}
          count={approvedUsers.length}
          open={!!openSections["approved"]}
          onToggle={() => toggleSection("approved")}
        >
          <div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Yükleniyor…</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>UCP Kullanıcı Adı</TableHead>
                    <TableHead>Personel Ad Soyad</TableHead>
                    <TableHead>Rütbe</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Son Giriş</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedUsers.map((user) => (
                    <Fragment key={user.id}>
                      <TableRow className="cursor-pointer" onClick={() => toggleExpanded(user.id)}>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            {expanded === user.id ? (
                              <ChevronDown className="size-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground" />
                            )}
                            {user.username}
                          </span>
                        </TableCell>
                        <TableCell>{user.profile?.name || "—"}</TableCell>
                        <TableCell>{formatRank(user.profile?.rank) || "—"}</TableCell>
                        <TableCell>{user.profile?.division || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{statusLabel(user.status)}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.adminLevel ? (
                            <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                              <Shield className="mr-1 size-3" />
                              {ADMIN_LEVEL_LABELS[user.adminLevel]}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Kullanıcı</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("tr-TR") : "—"}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {!canManageRoles ? (
                              <span className="text-xs text-muted-foreground">—</span>
                            ) : user.isProtectedQuery ? (
                              <span className="text-xs text-muted-foreground">Korumalı hesap</span>
                            ) : myLevel === "faction_management" &&
                              (user.adminLevel === "query" || user.adminLevel === "faction_management") ? (
                              <span className="text-xs text-muted-foreground">Yetkiniz yok</span>
                            ) : (
                              <Select
                                value={user.adminLevel ?? "none"}
                                onValueChange={(v) => handleLevelChange(user, v)}
                              >
                                <SelectTrigger className="ml-auto w-[190px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableLevels.map((lvl) => (
                                    <SelectItem key={lvl.value} value={lvl.value}>
                                      {lvl.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {canDeleteUser(user) && (
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(user)}>
                                <Trash2 className="mr-1 size-3" />
                                Sil
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {expanded === user.id ? (
                        <ProfileDetails
                          user={user}
                          payload={details[user.id] ?? null}
                          loading={detailLoading === user.id}
                          colSpan={8}
                          canEdit={canEditProfiles}
                        />
                      ) : null}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SectionCard>

        <SectionCard
          className="mt-6"
          title="Reddedilen Kullanıcılar"
          icon={<X className="size-4 text-destructive" />}
          count={rejectedUsers.length}
          open={!!openSections["rejected"]}
          onToggle={() => toggleSection("rejected")}
        >
          <div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Yükleniyor…</p>
            ) : rejectedUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Reddedilen kullanıcı yok.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>UCP Kullanıcı Adı</TableHead>
                    <TableHead>Personel Ad Soyad</TableHead>
                    <TableHead>Karakterler</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.profile?.name || "—"}</TableCell>
                      <TableCell className="max-w-[280px] truncate">
                        {user.characters.length > 0
                          ? user.characters.map((c) => `${c.firstname} ${c.lastname}`).join(", ")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="default" onClick={() => handleApprove(user.id)}>
                            <Check className="mr-1 size-3" />
                            Onayla
                          </Button>
                          {canDeleteUser(user) && (
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(user)}>
                              <Trash2 className="mr-1 size-3" />
                              Sil
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SectionCard>

        {canViewLogs && (
          <SectionCard
            className="mt-6"
            title="İşlem Kayıtları"
            icon={<ScrollText className="size-4 text-primary" />}
            count={logs.length}
            open={!!openSections["logs"]}
            onToggle={() => toggleSection("logs")}
          >
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz kayıt yok.</p>
            ) : (
              <div className="max-h-[480px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>İşlem</TableHead>
                      <TableHead>Yapan</TableHead>
                      <TableHead>Detay</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString("tr-TR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{logEventLabel(log.event)}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.username || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.detail || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        )}
      </div>
    </AppShell>
  );
}

function logEventLabel(event: string): string {
  const labels: Record<string, string> = {
    login: "Giriş",
    register: "Kayıt / Başvuru",
    resubmit: "Tekrar Başvuru",
    callback_error: "Giriş Hatası",
    admin_approve_user: "Kullanıcı Onaylandı",
    admin_reject_user: "Kullanıcı Reddedildi",
    admin_set_role: "Yetki Değişikliği",
    admin_delete_user: "Kullanıcı Silindi",
    admin_edit_profile: "Personel Profili Düzenlendi",
    admin_set_groups: "Grup Yetkisi Değişikliği",
  };
  return labels[event] || event;
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Bekliyor",
    approved: "Onaylı",
    rejected: "Reddedildi",
  };
  return labels[status] || status;
}
