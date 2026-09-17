import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/portal-auth.functions";
import {
  createEmptyStoredProfile,
  emptyOfficerProfile,
  loadOfficerProfiles,
  saveOfficerProfiles,
  type OfficerProfile,
  type StoredOfficerProfile,
} from "@/lib/officer-profile";

function isBlank(p: OfficerProfile) {
  return !p.name.trim() && !p.serialNo.trim() && !p.rank.trim();
}

/**
 * Cihaz/tarayıcı değiştiğinde (format, temizlenen depolama) sunucuda saklı personel
 * profillerini tekrar yerel depolamaya yazar. Yerelde profil varsa hiçbir şey yapmaz.
 */
export function useProfileRestore(enabled: boolean) {
  const fetchProfile = useServerFn(getMyProfile);

  useEffect(() => {
    if (!enabled) return;
    const local = loadOfficerProfiles();
    if (local.profiles.some((p) => !isBlank(p))) return;

    let cancelled = false;
    fetchProfile({})
      .then((remote) => {
        if (cancelled || !remote) return;
        const list: OfficerProfile[] =
          remote.profiles && remote.profiles.length ? remote.profiles : [remote];
        const usable = list.filter((p) => !isBlank(p));
        if (!usable.length) return;
        const stored: StoredOfficerProfile[] = usable.map((p) => ({
          ...emptyOfficerProfile,
          ...p,
          id: createEmptyStoredProfile().id,
        }));
        saveOfficerProfiles({ profiles: stored, activeId: stored[0]!.id });
      })
      .catch(() => {
        /* sessiz geç */
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
