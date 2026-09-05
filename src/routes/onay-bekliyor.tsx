import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Clock, ShieldX, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentSession, signOut } from "@/lib/portal-auth.functions";

export const Route = createFileRoute("/onay-bekliyor")({
  head: () => ({
    meta: [
      { title: "Onay Bekleniyor | LSPD - Toolkit" },
      { name: "description", content: "Hesabınız yönetici onayı bekliyor." },
      { property: "og:title", content: "Onay Bekleniyor | LSPD - Toolkit" },
      { property: "og:description", content: "Hesabınız yönetici onayı bekliyor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const session = await getCurrentSession();
    if (!session) {
      throw redirect({ to: "/auth/giris", search: { redirect: "", error: undefined } });
    }
    if (session.status === "approved") {
      throw redirect({ to: "/" });
    }
    return { status: session.status };
  },
  component: PendingApproval,
});

function PendingApproval() {
  const { status } = Route.useRouteContext();
  const rejected = status === "rejected";
  const doSignOut = useServerFn(signOut);

  const handleBackToLogin = async () => {
    await doSignOut({});
    window.location.href = "/auth/giris";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl backdrop-blur-sm">
        <div className="mb-4 flex justify-center">
          <div
            className={
              rejected
                ? "rounded-full bg-destructive/10 p-3 ring-1 ring-destructive/30"
                : "rounded-full bg-warning/10 p-3 ring-1 ring-warning/30"
            }
          >
            {rejected ? (
              <ShieldX className="size-8 text-destructive" />
            ) : (
              <Clock className="size-8 text-warning" />
            )}
          </div>
        </div>
        <h1 className="mb-2 text-xl font-bold">
          {rejected ? "Başvurunuz Reddedildi" : "Onay Bekleniyor"}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {rejected
            ? "Başvurunuz bir yönetici tarafından reddedildi. Panele erişiminiz bulunmuyor. İtiraz için LSPD yönetimiyle iletişime geçebilirsiniz."
            : "Hesabınız başarıyla oluşturuldu. Panele erişmek için bir yöneticinin onayını beklemeniz gerekiyor. "}
        </p>
        <Link to="/auth/giris" search={{ error: undefined, redirect: undefined }}>
          <Button variant="outline" className="w-full">
            <Shield className="mr-2 size-4" />
            Giriş Sayfasına Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}

