import { redirect } from "@tanstack/react-router";
import { getCurrentSession } from "./portal-auth.functions";

export async function requirePortalAuth(
  locationHref?: string,
  opts?: { admin?: boolean; allowIncompleteProfile?: boolean },
) {
  const session = await getCurrentSession();
  if (!session) {
    throw redirect({
      to: "/auth/giris",
      search: { redirect: locationHref || "", error: undefined },
    });
  }

  if (session.status !== "approved") {
    throw redirect({ to: "/onay-bekliyor" });
  }

  if (!session.selectedCharacter) {
    throw redirect({ to: "/karakter-sec" });
  }

  if (!session.profileCompleted && !opts?.allowIncompleteProfile) {
    throw redirect({ to: "/profil" });
  }

  if (opts?.admin && !session.isAdmin) {
    throw redirect({ to: "/" });
  }

  return session;
}

export async function redirectIfAuthenticated(locationHref?: string) {
  const session = await getCurrentSession();
  if (!session) return null;

  if (session.status !== "approved") {
    throw redirect({ to: "/onay-bekliyor" });
  }

  if (!session.selectedCharacter) {
    throw redirect({ to: "/karakter-sec" });
  }

  if (!session.profileCompleted) {
    throw redirect({ to: "/profil" });
  }

  const target = locationHref && locationHref !== "/auth/giris" ? locationHref : "/";
  throw redirect({ to: target as any });
}
