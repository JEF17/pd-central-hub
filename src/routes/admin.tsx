import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Shield, ShieldCheck, UserX, X } from "lucide-react";
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

  const listUsersFn = useServerFn(listUsers);
  const approveFn = useServerFn(approveUser);
  const rejectFn = useServerFn(rejectUser);
  const setLevelFn = useServerFn(setUserAdminLevel);
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
  const approvedUsers = users.filter((u) => u.status === "approved");


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
                    <TableHead>UCP Rolü</TableHead>
                    <TableHead>Karakterler</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.profile?.name || "—"}</TableCell>
                      <TableCell>{user.profile?.rank || "—"}</TableCell>
                      <TableCell>{user.ucpRole || "—"}</TableCell>
                      <TableCell className="max-w-[280px] truncate">
                        {user.characters.length > 0
                          ? user.characters
                              .map((c) => `${c.firstname} ${c.lastname}`)
                              .join(", ")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
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
                    <TableHead>Durum</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Son Giriş</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
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
                      <TableCell className="text-right">
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
                      </TableCell>
                    </TableRow>
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
