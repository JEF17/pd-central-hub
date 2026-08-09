import { useCallback, useEffect, useState } from "react";
import {
  loadOfficerProfile,
  type OfficerProfile,
} from "@/lib/officer-profile";

export function useOfficerProfile() {
  const [profile, setProfile] = useState<OfficerProfile | null>(null);

  const refresh = useCallback(() => setProfile(loadOfficerProfile()), []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("lspd-officer-profile-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("lspd-officer-profile-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  return profile;
}
