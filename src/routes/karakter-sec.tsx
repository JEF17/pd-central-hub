import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Clock, Shield, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/lib/notifications";
import {
  getCurrentSession,
  listMyCharacters,
  requestCharacter,
  signOut,
  type PortalCharacterDto,
} from "@/lib/portal-auth.functions";

export const Route = createFileRoute("/karakter-sec")({
  head: () => ({
    meta: [
      { title: "Karakter Seçimi | LSPD - Toolkit" },
      {
        name: "description",
        content: "UCP hesabındaki LSPD karakterini seç ve yönetici onayına gönder.",
      },
      { property: "og:title", content: "Karakter Seçimi | LSPD - Toolkit" },
      {
        property: "og:description",
        content: "UCP hesabındaki LSPD karakterini seç ve yönetici onayına gönder.",
      },
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
    if (session.status === "approved") {
      throw redirect({ to: session.profileCompleted ? "/" : "/profil" });
    }
    return {};
  },
  component: CharacterSelect,
});

function CharacterCard({
  character,
  onSelect,
  busy,
}: {
  character: PortalCharacterDto;
  onSelect: (id: number) => void;
  busy: boolean;
}) {
  const requested = !!character.requestedAt;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/70 p-4">
      <div className="size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        {character.photo ? (
          <img
            src={character.photo}
            alt={`${character.firstname} ${character.lastname}`}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <UserRound className="size-6" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">
          {character.firstname} {character.lastname}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {character.isLspd ? character.faction || "Los Santos Police Department" : "Oluşum dışı"}
        </p>
      </div>
      {requested ? (
        <Badge variant="outline" className="gap-1">
          <Clock className="size-3" /> Onayda
        </Badge>
      ) : (
        <Button size="sm" disabled={busy} onClick={() => onSelect(character.id)}>
          Onaya Gönder
        </Button>
      )}
    </div>
  );
}

function CharacterSelect() {
  const [characters, setCharacters] = useState<PortalCharacterDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  const fetchCharacters = useServerFn(listMyCharacters);
  const sendRequest = useServerFn(requestCharacter);
  const doSignOut = useServerFn(signOut);

  const load = () => {
    setLoading(true);
    fetchCharacters({})
      .then((rows) => setCharacters(rows))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const lspd = characters.filter((c) => c.isLspd);
  const others = characters.filter((c) => !c.isLspd);
  const hasRequest = characters.some((c) => c.requestedAt);

  const handleSelect = async (characterId: number) => {
    setBusy(true);
    try {
      await sendRequest({ data: { characterId } });
      notify.success("Karakterin yönetici onayına gönderildi");
      load();
    } catch {
      notify.error("İstek gönderilemedi");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await doSignOut({});
    window.location.href = "/auth/giris";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3 ring-1 ring-primary/30">
              <ShieldCheck className="size-7 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-bold">Karakter Seçimi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Los Santos Police Department karakterini seç ve yönetici onayına gönder.
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Karakterler yükleniyor…</p>
        ) : (
          <div className="space-y-3">
            {lspd.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                UCP hesabında Los Santos Police Department karakteri bulunamadı.
              </p>
            )}
            {lspd.map((c) => (
              <CharacterCard key={c.rowId} character={c} onSelect={handleSelect} busy={busy} />
            ))}

            {others.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline underline-offset-4"
                  onClick={() => setShowOthers((v) => !v)}
                >
                  {showOthers ? "Diğer karakterleri gizle" : "Diğer karakterlerim"}
                </button>
                {showOthers && (
                  <div className="mt-3 space-y-3">
                    {others.map((c) => (
                      <CharacterCard
                        key={c.rowId}
                        character={c}
                        onSelect={handleSelect}
                        busy={busy}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {hasRequest && (
          <p className="mt-6 rounded-lg bg-warning/10 p-3 text-center text-sm text-warning">
            Başvurun yönetici onayında. Onaylandığında panele erişebileceksin.
          </p>
        )}

        <Button variant="outline" className="mt-6 w-full" onClick={handleSignOut}>
          <Shield className="mr-2 size-4" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}
