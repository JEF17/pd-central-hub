import { redirect } from "@tanstack/react-router";
import { getCurrentSession } from "./portal-auth.functions";

export async function requirePortalAuth(locationHref?: string, opts?: { admin?: boolean }) {
  const session = await getCurrentSession();
  if (!session) {
    throw redirect({
      to: "/auth/giris",
      search: locationHref ? { redirect: locationHref } : undefined,
    });
  }

  if (session.status === "pending") {
    throw redirect({ to: "/onay-bekliyor" });
  }

  if (opts?.admin && !session.isAdmin) {
    throw redirect({ to: "/" });
  }

  return session;
}

export async function redirectIfAuthenticated(locationHref?: string) {
  const session = await getCurrentSession();
  if (!session) return null;

  if (session.status === "pending") {
    throw redirect({ to: "/onay-bekliyor" });
  }

  const target = locationHref && locationHref !== "/auth/giris" ? locationHref : "/";
  throw redirect({ to: target as any });
}
