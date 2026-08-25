import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requirePortalAuth } from "@/lib/portal-auth";

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
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href);
  },
  component: PendingApproval,
});

function PendingApproval() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl backdrop-blur-sm">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-warning/10 p-3 ring-1 ring-warning/30">
            <Clock className="size-8 text-warning" />
          </div>
        </div>
        <h1 className="mb-2 text-xl font-bold">Onay Bekleniyor</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Hesabınız başarıyla oluşturuldu. Panele erişmek için bir yöneticinin onayını
          beklemeniz gerekiyor.
        </p>
        <Link to="/auth/giris">
          <Button variant="outline" className="w-full">
            <Shield className="mr-2 size-4" />
            Giriş Sayfasına Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
