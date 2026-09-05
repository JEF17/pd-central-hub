import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Clock, IdCard, Loader2, ShieldX, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  chooseCharacter,
  getCurrentSession,
  requestCharacterApprovals,
} from "@/lib/portal-auth.functions";

export const Route = createFileRoute("/karakter-sec")({
  head: () => ({
    meta: [
      { title: "Karakter Seçimi | LSPD - Toolkit" },
      { name: "description", content: "LSPD karakterlerini onaya gönder ve aktif karakterini seç." },
      { property: "og:title", content: "Karakter Seçimi | LSPD - Toolkit" },
      { property: "og:description", content: "LSPD karakterlerini onaya gönder ve aktif karakterini seç." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const session = await getCurrentSession();
    if (!session) {
      throw redirect({ to: "/auth/giris", search: { redirect: "", error: undefined } });
    }
    if (session.status === "rejected") {
      throw redirect({ to: "/onay-bekliyor" });
    }
  },
  loader: async () => {
    const session = await getCurrentSession();
    return {
      characters: session?.portalCharacters ?? [],
      selectedId: session?.selectedCharacter?.id ?? null,
    };
  },
  component: CharacterSelect,
});

function CharacterSelect() {
  const { characters, selectedId } = Route.useLoaderData();
  const navigate = useNavigate();
  const submit = useServerFn(chooseCharacter);
  const requestApproval = useServerFn(requestCharacterApprovals);

  const approved = characters.filter((c) => c.status === "approved");
  const pending = characters.filter((c) => c.status === "pending");
  const rejected = characters.filter((c) => c.status === "rejected");

  const [selected, setSelected] = useState<number | null>(selectedId ?? approved[0]?.id ?? null);
  const [checked, setChecked] = useState<number[]>(pending.filter((c) => !c.requestedAt).map((c) => c.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleConfirm() {
    if (selected === null) return;
    setSaving(true);
    setError(null);
    try {
      await submit({ data: { characterId: selected } });
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Karakter kaydedilemedi.");
      setSaving(false);
    }
  }

  async function handleRequest() {
    if (checked.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await requestApproval({ data: { characterIds: checked } });
      setSent(true);
      navigate({ to: "/onay-bekliyor" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvuru gönderilemedi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3 ring-1 ring-primary/30">
              <IdCard className="size-8 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-bold">Karakterlerin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sadece LSPD kadrosundaki karakterlerin listelenir. Birden fazla karakter için onay
            isteyebilir, onaylananlar arasında istediğin zaman geçiş yapabilirsin.
          </p>
        </div>

        {characters.length === 0 ? (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            UCP hesabında LSPD kadrosunda görünen bir karakter bulunamadı. Lütfen bir yöneticiyle
            iletişime geç.
          </p>
        ) : null}

        {approved.length > 0 ? (
          <section className="mb-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Onaylı Karakterler
            </h2>
            <div className="space-y-2">
              {approved.map((character) => {
                const isActive = selected === character.id;
                return (
                  <button
                    key={character.rowId}
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
                        {character.faction ?? "LSPD"}
                        {character.memberid ? ` • Üye ID: ${character.memberid}` : ""}
                      </span>
                    </span>
                    {isActive ? <CheckCircle2 className="size-5 text-primary" /> : null}
                  </button>
                );
              })}
            </div>
            <Button className="mt-4 w-full" disabled={selected === null || saving} onClick={handleConfirm}>
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Bu Karakterle Devam Et
            </Button>
          </section>
        ) : null}

        {pending.length > 0 ? (
          <section className="mb-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Onay Bekleyenler
            </h2>
            <div className="space-y-2">
              {pending.map((character) => {
                const isChecked = checked.includes(character.id);
                return (
                  <label
                    key={character.rowId}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background/40 p-4"
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-current"
                      checked={isChecked}
                      onChange={() =>
                        setChecked((prev) =>
                          isChecked ? prev.filter((id) => id !== character.id) : [...prev, character.id],
                        )
                      }
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">
                        {character.firstname} {character.lastname}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {character.faction ?? "LSPD"}
                        {character.memberid ? ` • Üye ID: ${character.memberid}` : ""}
                      </span>
                    </span>
                    {character.requestedAt ? (
                      <Badge variant="secondary">
                        <Clock className="mr-1 size-3" />
                        Onayda
                      </Badge>
                    ) : (
                      <Badge variant="outline">Başvurulmadı</Badge>
                    )}
                  </label>
                );
              })}
            </div>
            <Button
              variant={approved.length > 0 ? "outline" : "default"}
              className="mt-4 w-full"
              disabled={checked.length === 0 || saving || sent}
              onClick={handleRequest}
            >
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Seçilen Karakterleri Onaya Gönder
            </Button>
          </section>
        ) : null}

        {rejected.length > 0 ? (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Reddedilenler
            </h2>
            <div className="space-y-2">
              {rejected.map((character) => (
                <div
                  key={character.rowId}
                  className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4"
                >
                  <ShieldX className="size-5 text-destructive" />
                  <span className="text-sm">
                    {character.firstname} {character.lastname}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
