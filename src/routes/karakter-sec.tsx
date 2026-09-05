import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, IdCard, Loader2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chooseCharacter, getCurrentSession } from "@/lib/portal-auth.functions";

export const Route = createFileRoute("/karakter-sec")({
  head: () => ({
    meta: [
      { title: "Karakter Seçimi | LSPD - Toolkit" },
      { name: "description", content: "UCP hesabınızdaki aktif karakteri seçerek onay sürecini başlatın." },
      { property: "og:title", content: "Karakter Seçimi | LSPD - Toolkit" },
      { property: "og:description", content: "UCP hesabınızdaki aktif karakteri seçerek onay sürecini başlatın." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const session = await getCurrentSession();
    if (!session) {
      throw redirect({ to: "/auth/giris", search: { redirect: "", error: undefined } });
    }
    if (session.selectedCharacter) {
      throw redirect({ to: session.status === "approved" ? "/" : "/onay-bekliyor" });
    }
    return { session };
  },
  loader: async () => {
    const session = await getCurrentSession();
    return { characters: session?.characters ?? [], status: session?.status ?? "pending" };
  },
  component: CharacterSelect,
});

function CharacterSelect() {
  const { characters, status } = Route.useLoaderData();
  const navigate = useNavigate();
  const submit = useServerFn(chooseCharacter);
  const [selected, setSelected] = useState<number | null>(characters[0]?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (selected === null) return;
    setSaving(true);
    setError(null);
    try {
      const result = await submit({ data: { characterId: selected } });
      navigate({ to: result.status === "approved" ? "/" : "/onay-bekliyor" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Karakter kaydedilemedi.");
      setSaving(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3 ring-1 ring-primary/30">
              <IdCard className="size-8 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-bold">Karakter Seçimi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            UCP hesabınızdaki karakterlerden biriyle devam edin. Seçiminiz yönetici onayına gönderilir.
          </p>
        </div>

        {characters.length === 0 ? (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            UCP hesabınızda aktif karakter bulunamadı. Lütfen bir yöneticiyle iletişime geçin.
          </p>
        ) : (
          <div className="space-y-2">
            {characters.map((character) => {
              const isActive = selected === character.id;
              return (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => setSelected(character.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/40 hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <UserRound className={`size-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">
                      {character.firstname} {character.lastname}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Karakter ID: {character.id}
                      {character.memberid ? ` • Üye ID: ${character.memberid}` : ""}
                    </span>
                  </span>
                  {isActive ? <CheckCircle2 className="size-5 text-primary" /> : null}
                </button>
              );
            })}
          </div>
        )}

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        <Button
          className="mt-6 w-full"
          disabled={selected === null || saving}
          onClick={handleConfirm}
        >
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {status === "approved" ? "Karakteri Kaydet ve Devam Et" : "Karakteri Seç ve Onaya Gönder"}
        </Button>
      </div>
    </div>
  );
}
