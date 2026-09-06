import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import type { PortalUser, AdminLevel } from "./portal-auth.server";
import type { OfficerProfile } from "./officer-profile";

export type { AdminLevel };
export type { OfficerProfile };

/** Sunucuda saklanan profil: aktif profil alanları + kullanıcının tüm profilleri */
export type StoredProfilePayload = OfficerProfile & { profiles?: OfficerProfile[] };

export const ADMIN_LEVEL_LABELS: Record<AdminLevel, string> = {
  query: "Query",
  faction_management: "Faction Management",
  supervisor: "Supervisor",
};

export type PortalUserDto = {
  id: string;
  ucpUserId: number;
  username: string;
  status: "pending" | "approved" | "rejected";
  ucpRole: string;
  isAdmin: boolean;
  adminLevel: AdminLevel | null;
  isProtectedQuery: boolean;
  characters: Array<{ id: number; firstname: string; lastname: string; memberid: number }>;
  selectedCharacter: {
    id: number;
    firstname: string;
    lastname: string;
    memberid: number;
  } | null;
  lastLoginAt: string | null;
  createdAt: string;
  profile: StoredProfilePayload | null;
  profileCompleted: boolean;
};


export type PortalCharacterDto = {
  rowId: string;
  id: number;
  firstname: string;
  lastname: string;
  memberid: number;
  faction: string | null;
  isLspd: boolean;
  status: "pending" | "approved" | "rejected";
  requestedAt: string | null;
};

export type PortalSessionDto = {
  id: string;
  ucpUserId: number;
  username: string;
  status: "pending" | "approved" | "rejected";
  isAdmin: boolean;
  adminLevel: AdminLevel | null;
  profileCompleted: boolean;
  characters: Array<{ id: number; firstname: string; lastname: string; memberid: number }>;
  portalCharacters: PortalCharacterDto[];
  selectedCharacter: { id: number; firstname: string; lastname: string; memberid: number } | null;
};

function isProtectedQueryUsername(username: string | null | undefined): boolean {
  const admin = process.env["UCP_ADMIN_USERNAME"];
  return !!admin && !!username && username.toLowerCase() === admin.toLowerCase();
}

function parseProfile(raw: unknown): StoredProfilePayload | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<StoredProfilePayload>;
  const profiles = Array.isArray(p.profiles)
    ? p.profiles.map((x) => parseSingleProfile(x)).filter((x): x is OfficerProfile => x !== null)
    : [];
  return { ...(parseSingleProfile(p) ?? emptyProfile()), profiles };
}

function emptyProfile(): OfficerProfile {
  return {
    name: "",
    serialNo: "",
    rank: "",
    division: "",
    photo: "",
    email: "",
    phone: "",
    discord: "",
    note: "",
  };
}

function parseSingleProfile(raw: unknown): OfficerProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<OfficerProfile>;
  return {
    name: p.name ?? "",
    serialNo: p.serialNo ?? "",
    rank: p.rank ?? "",
    division: p.division ?? "",
    photo: p.photo ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    discord: p.discord ?? "",
    note: p.note ?? "",
  };
}

async function toUserDto(
  user: PortalUser,
  getLevel?: (userId: string) => Promise<AdminLevel | null>,
): Promise<PortalUserDto> {
  const adminLevel = getLevel ? await getLevel(user.id) : null;
  const isAdmin = adminLevel !== null;
  return {
    id: user.id,
    ucpUserId: user.ucp_user_id,
    username: user.username ?? "",
    status: user.status as "pending" | "approved" | "rejected",
    ucpRole: user.ucp_role ?? "",
    isAdmin,
    adminLevel,
    isProtectedQuery: isProtectedQueryUsername(user.username),
    characters: (user.characters ?? []) as Array<{ id: number; firstname: string; lastname: string; memberid: number }>,
    selectedCharacter: (() => {
      if (!user.selected_character) return null;
      try {
        return typeof user.selected_character === "string"
          ? (JSON.parse(user.selected_character) as {
              id: number;
              firstname: string;
              lastname: string;
              memberid: number;
            })
          : (user.selected_character as {
              id: number;
              firstname: string;
              lastname: string;
              memberid: number;
            });
      } catch {
        return null;
      }
    })(),
    lastLoginAt: user.last_login_at,
    createdAt: user.created_at,
    profile: parseProfile(user.profile),
    profileCompleted: user.profile_completed ?? false,
  };
}

async function validatePortalSession(required: true): Promise<PortalUser>;
async function validatePortalSession(required: false): Promise<PortalUser | null>;
async function validatePortalSession(required: boolean): Promise<PortalUser | null> {
  const { readSessionCookie, hashToken, findSessionByTokenHash } = await import("./portal-auth.server");
  const token = readSessionCookie();
  if (!token) {
    if (required) throw new Error("Unauthorized");
    return null;
  }
  const result = await findSessionByTokenHash(hashToken(token));
  if (!result) {
    if (required) throw new Error("Unauthorized");
    return null;
  }
  return result.user;
}

export const requirePortalAuthMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const user = await validatePortalSession(true);
  if (user.status !== "approved") {
    throw new Error("Account is pending approval");
  }
  return next({ context: { userId: user.id, user } });
});

export const requirePortalAdminMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const user = await validatePortalSession(true);
  if (user.status !== "approved") {
    throw new Error("Account is pending approval");
  }
  const { getAdminLevel } = await import("./portal-auth.server");
  const adminLevel = await getAdminLevel(user.id);
  if (!adminLevel) throw new Error("Forbidden");
  return next({ context: { userId: user.id, user, isAdmin: true, adminLevel } });
});

export const startUcpAuth = createServerFn({ method: "POST" }).handler(async () => {
  const clientId = process.env["UCP_CLIENT_ID"];
  const clientSecret = process.env["UCP_CLIENT_SECRET"];
  if (!clientId || !clientSecret) {
    throw new Error("UCP OAuth credentials are not configured");
  }

  const request = getRequest();
  if (!request) throw new Error("No request available");

  const redirectUri = new URL("/auth/ucp/callback", request.url).toString();

  const {
    generateSessionToken,
    setOAuthStateCookie,
    buildUcpAuthUrl,
  } = await import("./portal-auth.server");

  const state = generateSessionToken();
  setOAuthStateCookie(state);

  return { url: buildUcpAuthUrl(clientId, redirectUri, state) };
});

export const getCurrentSession = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  if (request) {
    const host = new URL(request.url).hostname;
    const isPreview =
      host.startsWith("id-preview--") || host === "localhost";
    if (isPreview) {
      return {
        id: "preview",
        ucpUserId: 0,
        username: "preview",
        status: "approved",
        isAdmin: true,
        adminLevel: "query" as AdminLevel,
        profileCompleted: true,
        characters: [],
        portalCharacters: [],
        selectedCharacter: null,
      } satisfies PortalSessionDto;
    }
  }

  const {
    readSessionCookie,
    hashToken,
    findSessionByTokenHash,
    getAdminLevel,
    ensureUserCharacters,
  } = await import("./portal-auth.server");

  const token = readSessionCookie();
  if (!token) return null;

  const result = await findSessionByTokenHash(hashToken(token));
  if (!result) return null;


  const { user } = result;
  const adminLevel = await getAdminLevel(user.id);
  const isAdmin = adminLevel !== null;
  const rows = await ensureUserCharacters(user);

  const portalCharacters: PortalCharacterDto[] = rows.map((c) => ({
    rowId: c.id,
    id: Number(c.character_id),
    firstname: c.firstname,
    lastname: c.lastname,
    memberid: Number(c.memberid ?? 0),
    faction: c.faction,
    isLspd: c.is_lspd,
    status: c.status as PortalCharacterDto["status"],
    requestedAt: c.requested_at,
  }));

  return {
    id: user.id,
    ucpUserId: user.ucp_user_id,
    username: user.username,
    status: user.status as PortalSessionDto["status"],
    isAdmin,
    adminLevel,
    profileCompleted: user.profile_completed ?? false,
    characters: (user.characters ?? []) as PortalSessionDto["characters"],
    portalCharacters,
    selectedCharacter: (() => {
      const raw = user.selected_character;
      if (!raw) return null;
      try {
        return (typeof raw === "string" ? JSON.parse(raw) : raw) as PortalSessionDto["selectedCharacter"];
      } catch {
        return null;
      }
    })(),

  } satisfies PortalSessionDto;
});

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const { readSessionCookie, hashToken, deleteSession, clearSessionCookie } = await import(
    "./portal-auth.server"
  );

  const token = readSessionCookie();
  if (token) {
    await deleteSession(hashToken(token));
  }
  clearSessionCookie();
  return { ok: true };
});

export const listPendingUsers = createServerFn({ method: "GET" })
  .middleware([requirePortalAdminMiddleware])
  .handler(async () => {
    const { listPendingUsers: listPending, getAdminLevel } = await import("./portal-auth.server");
    const users = await listPending();
    return Promise.all(users.map((u) => toUserDto(u, getAdminLevel)));
  });

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requirePortalAdminMiddleware])
  .handler(async () => {
    const { listAllUsers, getAdminLevel } = await import("./portal-auth.server");
    const users = await listAllUsers();
    return Promise.all(users.map((u) => toUserDto(u, getAdminLevel)));
  });

export const approveUser = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    const { approveUser: doApprove } = await import("./portal-auth.server");
    const user = await doApprove(data.userId, context.userId);
    return toUserDto(user);
  });

export const rejectUser = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    const { rejectUser: doReject } = await import("./portal-auth.server");
    const user = await doReject(data.userId, context.userId);
    return toUserDto(user);
  });

export const setUserAdminLevel = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string; level: AdminLevel | null }) => input)
  .handler(async ({ data, context }) => {
    const { setAdminLevel, findPortalUserById, getAdminLevel } = await import("./portal-auth.server");

    // Supervisors cannot manage roles at all.
    if (context.adminLevel === "supervisor") {
      throw new Error("Forbidden");
    }

    const target = await findPortalUserById(data.userId);
    if (!target) throw new Error("User not found");

    // The protected Query account can never lose or change its level.
    if (isProtectedQueryUsername(target.username)) {
      throw new Error("Bu hesabın yetkisi değiştirilemez");
    }

    const targetLevel = await getAdminLevel(data.userId);

    // Only Query can grant or revoke Query / Faction Management.
    if (context.adminLevel !== "query") {
      if (data.level === "query" || data.level === "faction_management") {
        throw new Error("Bu yetkiyi tanımlama izniniz yok");
      }
      if (targetLevel === "query" || targetLevel === "faction_management") {
        throw new Error("Bu kullanıcının yetkisini değiştirme izniniz yok");
      }
    }

    if (data.userId === context.userId && data.level !== context.adminLevel) {
      throw new Error("Kendi yetkinizi değiştiremezsiniz");
    }

    await setAdminLevel(data.userId, data.level);
    const user = await findPortalUserById(data.userId);
    if (!user) throw new Error("User not found");
    return toUserDto(user, getAdminLevel);
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    const { findPortalUserById, getAdminLevel, deletePortalUser, logLoginEvent } = await import("./portal-auth.server");

    // Supervisors cannot delete users at all.
    if (context.adminLevel === "supervisor") {
      throw new Error("Forbidden");
    }

    const target = await findPortalUserById(data.userId);
    if (!target) throw new Error("User not found");

    // The protected Query account can never be deleted.
    if (isProtectedQueryUsername(target.username)) {
      throw new Error("Bu hesap silinemez");
    }

    if (data.userId === context.userId) {
      throw new Error("Kendi hesabınızı silemezsiniz");
    }

    // Faction Management cannot delete Query or Faction Management users.
    const targetLevel = await getAdminLevel(data.userId);
    if (
      context.adminLevel !== "query" &&
      (targetLevel === "query" || targetLevel === "faction_management")
    ) {
      throw new Error("Bu kullanıcıyı silme izniniz yok");
    }

    await deletePortalUser(data.userId);
    await logLoginEvent(context.userId, context.user.username, "admin_delete_user", target.username);
    return { ok: true };
  });

export const resubmitApplication = createServerFn({ method: "POST" }).handler(async () => {
  const user = await validatePortalSession(true);
  if (user.status !== "rejected") {
    throw new Error("Only rejected applications can be resubmitted");
  }
  const { resubmitApplication: doResubmit, logLoginEvent } = await import("./portal-auth.server");
  const updated = await doResubmit(user.id);
  await logLoginEvent(user.id, user.username, "resubmit", "application_resubmitted");
  return { ok: true, status: updated.status };
});

export const setSelectedCharacter = createServerFn({ method: "POST" })
  .middleware([requirePortalAuthMiddleware])
  .inputValidator((input: { character: { id: number; firstname: string; lastname: string; memberid: number } | null }) => input)
  .handler(async ({ data, context }) => {
    const { setSelectedCharacter: doSet } = await import("./portal-auth.server");
    await doSet(context.userId, data.character);
    return { ok: true };
  });

export const saveOfficerProfile = createServerFn({ method: "POST" })
  .middleware([requirePortalAuthMiddleware])
  .inputValidator((input: StoredProfilePayload) => input)
  .handler(async ({ data, context }) => {
    const { updateOfficerProfile } = await import("./portal-auth.server");
    await updateOfficerProfile(context.userId, data);
    return { ok: true };
  });
