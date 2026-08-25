import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getCurrentSession, signOut } from "@/lib/portal-auth.functions";
import type { PortalSessionDto } from "@/lib/portal-auth.functions";

export function usePortalSession() {
  const [session, setSession] = useState<PortalSessionDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useServerFn(getCurrentSession);
  const doSignOut = useServerFn(signOut);

  useEffect(() => {
    let cancelled = false;
    fetchSession({})
      .then((s) => {
        if (!cancelled) setSession(s);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    await doSignOut({});
    setSession(null);
    window.location.href = "/auth/giris";
  };

  return { session, loading, refetch: fetchSession, signOut: handleSignOut };
}
