import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { Check, ChevronDown, ChevronRight, Shield, ShieldCheck, Trash2, UserX, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requirePortalAuth } from "@/lib/portal-auth";
import {
  ADMIN_LEVEL_LABELS,
  approveUser,
  deleteUser,
  listUsers,
  rejectUser,
  setUserAdminLevel,
  type AdminLevel,
} from "@/lib/portal-auth.functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePortalSession } from "@/hooks/use-portal-session";
import { toast } from "sonner";

type UserDto = Awaited<ReturnType<typeof listUsers>>[number];

function userProfiles(user: UserDto) {
  const list = user.profile?.profiles ?? [];
  if (list.length > 0) return list;
  return user.profile && (user.profile.name || user.profile.serialNo) ? [user.profile] : [];
}

function ProfileDetails({ user, colSpan }: { user: UserDto; colSpan: number }) {
  const profiles = userProfiles(user);
  return (
    <TableRow className="bg-muted/30 hover:bg-muted/30">
      <TableCell colSpan={colSpan} className="p-4">
        {profiles.length === 0 ? (
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
                    {p.rank || "Rütbe yok"}
                    {p.serialNo ? ` • #${p.serialNo}` : ""}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{p.division || "Division yok"}</p>
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
  const toggleExpanded = (id: string) => setExpanded((cur) => (cur === id ? null : id));

  const listUsersFn = useServerFn(listUsers);
  const approveFn = useServerFn(approveUser);
  const rejectFn = useServerFn(rejectUser);
  const setLevelFn = useServerFn(setUserAdminLevel);
  const deleteFn = useServerFn(deleteUser);
  const { session } = usePortalSession();
  const myLevel = session?.adminLevel ?? null;

  const refresh = async () => {
    setLoading(true);
    try {
      const all = await listUsersFn({});
      setUsers(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const pendingUsers = users.filter((u) => u.status === "pending");
  const approvedUsers = users.filter((u) => u.status !== "pending");


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
    (myLevel === "query" ||
      (user.adminLevel !== "query" && user.adminLevel !== "faction_management"));

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
            <p className="text-sm text-muted-foreground">
              Kullanıcı onayları ve yönetici rolü atamaları.
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">Ana Sayfaya Dön</Button>
          </Link>
        </div>


        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserX className="size-4 text-warning" />
              Onay Bekleyen Kullanıcılar
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                    <TableHead>Oluşum</TableHead>
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
                      <TableCell>{user.profile?.rank || "—"}</TableCell>
                      <TableCell>
                        {user.inLspd ? (
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Oluşumda</Badge>
                        ) : (
                          <Badge variant="outline">Oluşumda Değil</Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[280px] truncate">
                        {user.characters.length > 0
                          ? user.characters
                              .map((c) => `${c.firstname} ${c.lastname}`)
                              .join(", ")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(user.id)}
                          >
                            <Check className="mr-1 size-3" />
                            Onayla
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(user.id)}
                          >
                            <X className="mr-1 size-3" />
                            Reddet
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expanded === user.id ? <ProfileDetails user={user} colSpan={6} /> : null}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-4 text-primary" />
              Tüm Kullanıcılar
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                      <TableCell>{user.profile?.rank || "—"}</TableCell>
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
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(user)}
                            >
                              <Trash2 className="mr-1 size-3" />
                              Sil
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expanded === user.id ? <ProfileDetails user={user} colSpan={8} /> : null}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Bekliyor",
    approved: "Onaylı",
    rejected: "Reddedildi",
  };
  return labels[status] || status;
}
