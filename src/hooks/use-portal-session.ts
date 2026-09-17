import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCurrentSession, signOut } from "@/lib/portal-auth.functions";
import type { PortalSessionDto } from "@/lib/portal-auth.functions";

const PORTAL_SESSION_KEY = ["portal-session"] as const;

export function usePortalSession() {
  const fetchSession = useServerFn(getCurrentSession);
  const doSignOut = useServerFn(signOut);
  const queryClient = useQueryClient();

  const query = useQuery<PortalSessionDto | null>({
    queryKey: PORTAL_SESSION_KEY,
    queryFn: () => fetchSession({}),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const handleSignOut = async () => {
    await doSignOut({});
    queryClient.setQueryData(PORTAL_SESSION_KEY, null);
    window.location.href = "/auth/giris";
  };

  const refetch = async () => {
    const result = await query.refetch();
    return result.data ?? null;
  };

  return {
    session: query.data ?? null,
    loading: query.isLoading,
    refetch,
    signOut: handleSignOut,
  };
}
