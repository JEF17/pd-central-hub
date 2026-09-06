import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { requirePortalAuth } from "@/lib/portal-auth";

export const Route = createFileRoute("/calisan-listesi")({
  head: () => ({
    meta: [
      { title: "Çalışan Listesi | LSPD - Toolkit" },
      { name: "description", content: "LSPD personel kadrosu geçici olarak pasiftir." },
      { property: "og:title", content: "Çalışan Listesi | LSPD - Toolkit" },
      { property: "og:description", content: "LSPD personel kadrosu geçici olarak pasiftir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    await requirePortalAuth(location.href);
  },
  component: InactiveRosterPage,
});

function InactiveRosterPage() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Construction className="size-10" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Çalışan Listesi</h1>
        <p className="mt-3 text-muted-foreground">
          Bu bölüm şu an için pasiftir. Daha detaylı bir çalışma sonrasında aktif hale getirilecektir.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </AppShell>
  );
}
