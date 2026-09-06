import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Shield, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";
import {
  getCurrentSession,
  listMyCharacters,
  setSelectedCharacter,
  signOut,
  type PortalCharacterDto,
} from "@/lib/portal-auth.functions";

export const Route = createFileRoute("/karakter-sec")({
  head: () => ({
    meta: [
      { title: "Karakter Seçimi | LSPD - Toolkit" },
      {
        name: "description",
        content: "LSPD karakterini seç ve personel profilini oluştur.",
      },
      { property: "og:title", content: "Karakter Seçimi | LSPD - Toolkit" },
      {
        property: "og:description",
        content: "LSPD karakterini seç ve personel profilini oluştur.",
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
    if (session.status !== "approved") {
      throw redirect({ to: "/onay-bekliyor" });
    }
    if (session.selectedCharacter) {
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
  onSelect: (character: PortalCharacterDto) => void;
  busy: boolean;
}) {
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
          {character.faction || "Los Santos Police Department"}
        </p>
      </div>
      <Button size="sm" disabled={busy} onClick={() => onSelect(character)}>
        Bu Karakteri Seç
      </Button>
    </div>
  );
}

function CharacterSelect() {
  const [characters, setCharacters] = useState<PortalCharacterDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const fetchCharacters = useServerFn(listMyCharacters);
  const chooseCharacter = useServerFn(setSelectedCharacter);
  const doSignOut = useServerFn(signOut);

  useEffect(() => {
    setLoading(true);
    fetchCharacters({})
      .then((rows) => setCharacters(rows))
      .finally(() => setLoading(false));
  }, []);

  const lspd = characters.filter((c) => c.isLspd);

  const handleSelect = async (character: PortalCharacterDto) => {
    setBusy(true);
    try {
      await chooseCharacter({
        data: {
          character: {
            id: character.id,
            firstname: character.firstname,
            lastname: character.lastname,
            memberid: character.memberid,
          },
        },
      });
      notify.success("Karakter seçildi");
      window.location.href = "/profil";
    } catch {
      notify.error("Karakter seçilemedi");
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
            Los Santos Police Department karakterlerinden birini seç, ardından personel profilini
            oluştur.
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Karakterler yükleniyor…</p>
        ) : (
          <div className="space-y-3">
            {lspd.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                UCP hesabında Los Santos Police Department karakteri bulunamadı.
              </p>
            ) : (
              lspd.map((c) => (
                <CharacterCard key={c.rowId} character={c} onSelect={handleSelect} busy={busy} />
              ))
            )}
          </div>
        )}

        <Button variant="outline" className="mt-6 w-full" onClick={handleSignOut}>
          <Shield className="mr-2 size-4" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}
