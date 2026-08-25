import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { startUcpAuth } from "@/lib/portal-auth.functions";
import { redirectIfAuthenticated } from "@/lib/portal-auth";

export const Route = createFileRoute("/auth/giris")({
  head: () => ({
    meta: [
      { title: "Giriş | LSPD - Toolkit" },
      { name: "description", content: "LSPD Toolkit UCP girişi" },
      { property: "og:title", content: "Giriş | LSPD - Toolkit" },
      { property: "og:description", content: "LSPD Toolkit UCP girişi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await redirectIfAuthenticated(location.href);
  },
  component: LoginPage,
});

function LoginPage() {
  const startAuth = useServerFn(startUcpAuth);

  const handleLogin = async () => {
    const { url } = await startAuth({});
    window.location.href = url;
  };

  const error = Route.useSearch<{ error?: string }>().error;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(900px 420px at 50% -10%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%), radial-gradient(800px 500px at 50% 110%, color-mix(in oklab, var(--gold) 10%, transparent), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-primary/20 to-gold/20 p-3 ring-1 ring-primary/20">
            <Shield className="size-8 text-primary" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold tracking-tight">LSPD Toolkit</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Panele erişmek için UCP hesabınla giriş yap.
        </p>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{errorMessage(error)}</span>
          </div>
        )}

        <Button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-primary to-primary/80 py-5 text-base font-semibold hover:from-primary/90 hover:to-primary/70"
        >
          <Shield className="mr-2 size-4" />
          UCP ile Giriş Yap
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Giriş yaptıktan sonra yönetici onayı gerekebilir.
        </p>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}

function errorMessage(error: string): string {
  const messages: Record<string, string> = {
    missing_code: "UCP'den gerekli bilgiler gelmedi. Lütfen tekrar dene.",
    invalid_state: "Güvenlik doğrulaması başarısız oldu. Lütfen tekrar dene.",
    not_configured: "OAuth bağlantısı henüz yapılandırılmamış.",
    access_denied: "UCP girişi reddedildi.",
  };
  return messages[error] || error;
}
