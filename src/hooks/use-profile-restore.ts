import { useEffect } from "react";
import { getMyProfile, saveOfficerProfile } from "@/lib/portal-auth.functions";
import {
  createEmptyStoredProfile,
  emptyOfficerProfile,
  loadOfficerProfiles,
  localProfilesUpdatedAt,
  saveOfficerProfiles,
  setLocalProfilesUpdatedAt,
  type OfficerProfile,
  type StoredOfficerProfile,
} from "@/lib/officer-profile";

function isBlank(p: OfficerProfile) {
  return !p.name.trim() && !p.serialNo.trim() && !p.rank.trim();
}

/**
 * Personel profillerini sunucuyla iki yönlü senkronize eder:
 * - Sunucudaki kayıt daha yeniyse (ya da yerelde profil yoksa) yerel depoya yazar.
 * - Yerel kayıt daha yeniyse sunucuya gönderir.
 * Böylece profil verisi cihazdan bağımsız olarak sunucuda kalıcıdır.
 */
export function useProfileRestore(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const local = loadOfficerProfiles();
    const localUsable = local.profiles.filter((p) => !isBlank(p));
    const localAt = localProfilesUpdatedAt();

    getMyProfile({})
      .then(async (remote) => {
        if (cancelled) return;

        const remoteList: OfficerProfile[] = remote
          ? remote.profiles && remote.profiles.length
            ? remote.profiles
            : [remote]
          : [];
        const remoteUsable = remoteList.filter((p) => !isBlank(p));
        const remoteAt = remote?.updatedAt ? new Date(remote.updatedAt) : null;

        const remoteIsNewer =
          remoteUsable.length > 0 &&
          (localUsable.length === 0 ||
            !localAt ||
            (remoteAt && !Number.isNaN(remoteAt.getTime()) && remoteAt.getTime() > localAt.getTime()));

        if (remoteIsNewer) {
          const stored: StoredOfficerProfile[] = remoteUsable.map((p) => ({
            ...emptyOfficerProfile,
            ...p,
            id: createEmptyStoredProfile().id,
          }));
          const remoteIndex =
            typeof remote?.activeIndex === "number" && stored[remote.activeIndex]
              ? remote.activeIndex
              : 0;
          saveOfficerProfiles(
            { profiles: stored, activeId: stored[remoteIndex]!.id },
            remoteAt ? remoteAt.toISOString() : undefined,
          );
          return;
        }


        // Yerel kayıt daha yeni: sunucuyu güncelle
        const localIsNewer =
          localUsable.length > 0 &&
          (remoteUsable.length === 0 ||
            !remoteAt ||
            (localAt && localAt.getTime() > remoteAt.getTime()));

        if (localIsNewer) {
          const active =
            local.profiles.find((p) => p.id === local.activeId && !isBlank(p)) ?? localUsable[0]!;
          const { id: _id, ...activeRest } = active;
          const all: OfficerProfile[] = localUsable.map((p) => {
            const { id: _pid, ...rest } = p as StoredOfficerProfile;
            return rest as OfficerProfile;
          });
          const updatedAt = (localAt ?? new Date()).toISOString();
          await saveOfficerProfile({
            data: { ...(activeRest as OfficerProfile), profiles: all, updatedAt },
          }).catch(() => undefined);
          setLocalProfilesUpdatedAt(updatedAt);
        }
      })
      .catch(() => {
        /* sessiz geç */
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
