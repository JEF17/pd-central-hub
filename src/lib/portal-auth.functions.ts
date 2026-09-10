import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import type { PortalUser, AdminLevel } from "./portal-auth.server";
import type { OfficerProfile } from "./officer-profile";
import { groupLabel, portalGroups } from "./portal-groups";

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
  groups: string[];
};


export type PortalCharacterDto = {
  rowId: string;
  id: number;
  firstname: string;
  lastname: string;
  memberid: number;
  faction: string | null;
  isLspd: boolean;
  photo: string;
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
  groups: string[];
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
    assignmentDescription: "",
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
    assignmentDescription: p.assignmentDescription ?? "",
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
    groups: [],
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
        groups: portalGroups.map((g) => g.key),
        characters: [],
        portalCharacters: [
          {
            rowId: "preview-1",
            id: 1,
            firstname: "Alexandra",
            lastname: "Grasso",
            memberid: 0,
            faction: null,
            isLspd: true,
            photo: "",
            status: "approved",
            requestedAt: null,
          },
          {
            rowId: "preview-2",
            id: 2,
            firstname: "Jonathan",
            lastname: "Spencer",
            memberid: 0,
            faction: null,
            isLspd: false,
            photo: "",
            status: "approved",
            requestedAt: null,
          },
        ],
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
    getUserGroups,
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
    photo: c.photo ?? "",
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
    groups: await getUserGroups(user.id),
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

/** Liste yanıtlarını hafifletmek için base64 fotoğrafları çıkarır. */
function stripPhotos(dto: PortalUserDto): PortalUserDto {
  if (!dto.profile) return dto;
  const profile = {
    ...dto.profile,
    photo: "",
    profiles: (dto.profile.profiles ?? []).map((p) => ({ ...p, photo: "" })),
  };
  return { ...dto, profile };
}

export const listPendingUsers = createServerFn({ method: "GET" })
  .middleware([requirePortalAdminMiddleware])
  .handler(async () => {
    const { listPendingUsers: listPending, getAdminLevelsFor, getUserGroupsFor } = await import(
      "./portal-auth.server"
    );
    const users = await listPending();
    const levels = await getAdminLevelsFor(users.map((u) => u.id));
    const groups = await getUserGroupsFor(users.map((u) => u.id));
    return Promise.all(
      users.map(async (u) =>
        stripPhotos({
          ...(await toUserDto(u)),
          adminLevel: levels.get(u.id) ?? null,
          isAdmin: levels.has(u.id),
          groups: groups.get(u.id) ?? [],
        }),
      ),
    );
  });

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requirePortalAdminMiddleware])
  .handler(async () => {
    const { listAllUsers, getAdminLevelsFor, getUserGroupsFor } = await import("./portal-auth.server");
    const users = await listAllUsers();
    const levels = await getAdminLevelsFor(users.map((u) => u.id));
    const groups = await getUserGroupsFor(users.map((u) => u.id));
    return Promise.all(
      users.map(async (u) =>
        stripPhotos({
          ...(await toUserDto(u)),
          adminLevel: levels.get(u.id) ?? null,
          isAdmin: levels.has(u.id),
          groups: groups.get(u.id) ?? [],
        }),
      ),
    );
  });

/** Faction Management ve Query bir kullanıcının grup izinlerini düzenleyebilir. */
export const setUserGroupsFn = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string; groups: string[] }) => input)
  .handler(async ({ data, context }) => {
    if (context.adminLevel !== "query" && context.adminLevel !== "faction_management") {
      throw new Error("Bu işlem için yetkiniz yok");
    }
    const valid = new Set(portalGroups.map((g) => g.key as string));
    const groups = data.groups.filter((g) => valid.has(g));
    const { findPortalUserById, setUserGroups, logLoginEvent } = await import("./portal-auth.server");
    const target = await findPortalUserById(data.userId);
    if (!target) throw new Error("User not found");
    const saved = await setUserGroups(data.userId, groups, context.userId);
    await logLoginEvent(
      context.userId,
      context.user.username,
      "admin_set_groups",
      `${target.username} → ${saved.length ? saved.map(groupLabel).join(", ") : "grup yok"}`,
    );
    return { ok: true, groups: saved };
  });

/** Satır açıldığında profil detayını (fotoğraflar dahil) getirir. */
export const getUserProfileDetail = createServerFn({ method: "GET" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data }): Promise<StoredProfilePayload | null> => {
    const { findPortalUserById } = await import("./portal-auth.server");
    const user = await findPortalUserById(data.userId);
    if (!user) return null;
    return parseProfile(user.profile);
  });

/** Faction Management ve üstü bir kullanıcının personel profillerini düzenleyebilir. */
export const adminUpdateUserProfile = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string; profile: StoredProfilePayload }) => input)
  .handler(async ({ data, context }) => {
    if (context.adminLevel !== "query" && context.adminLevel !== "faction_management") {
      throw new Error("Bu işlem için yetkiniz yok");
    }
    const { findPortalUserById, updateOfficerProfile, logLoginEvent } = await import("./portal-auth.server");
    const target = await findPortalUserById(data.userId);
    if (!target) throw new Error("User not found");

    const parsed = parseProfile(data.profile) ?? { ...emptyProfile(), profiles: [] };
    await updateOfficerProfile(data.userId, parsed);
    const { syncRosterFromProfiles } = await import("./roster.server");
    await syncRosterFromProfiles(data.userId, parsed);
    await logLoginEvent(
      context.userId,
      context.user.username,
      "admin_edit_profile",
      `${target.username} personel profili güncellendi`,
    );
    return parsed;
  });




export type PortalLogDto = {
  id: string;
  event: string;
  username: string | null;
  detail: string | null;
  createdAt: string;
};

export const listPortalLogs = createServerFn({ method: "GET" })
  .middleware([requirePortalAdminMiddleware])
  .handler(async ({ context }): Promise<PortalLogDto[]> => {
    if (context.adminLevel !== "query" && context.adminLevel !== "faction_management") {
      throw new Error("Forbidden");
    }
    const { listPortalLogs: doList } = await import("./portal-auth.server");
    const rows = await doList(200);
    return rows.map((r) => ({
      id: r.id,
      event: r.event,
      username: r.username,
      detail: r.detail,
      createdAt: r.created_at,
    }));
  });

export const approveUser = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    const { approveUser: doApprove, logLoginEvent } = await import("./portal-auth.server");
    const user = await doApprove(data.userId, context.userId);
    await logLoginEvent(context.userId, context.user.username, "admin_approve_user", user.username);
    return toUserDto(user);
  });

export const rejectUser = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    const { rejectUser: doReject, logLoginEvent } = await import("./portal-auth.server");
    const user = await doReject(data.userId, context.userId);
    await logLoginEvent(context.userId, context.user.username, "admin_reject_user", user.username);
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
    {
      const { logLoginEvent } = await import("./portal-auth.server");
      await logLoginEvent(
        context.userId,
        context.user.username,
        "admin_set_role",
        `${target.username} → ${data.level ?? "kullanıcı"}`,
      );
    }
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
    const { syncRosterFromProfiles } = await import("./roster.server");
    await syncRosterFromProfiles(context.userId, data);
    return { ok: true };
  });



/** Oyuncunun UCP karakterleri (onay durumlarıyla). */
export const listMyCharacters = createServerFn({ method: "GET" }).handler(
  async (): Promise<PortalCharacterDto[]> => {
    const user = await validatePortalSession(true);
    const { ensureUserCharacters } = await import("./portal-auth.server");
    const rows = await ensureUserCharacters(user);
    return rows.map((c) => ({
      rowId: c.id,
      id: Number(c.character_id),
      firstname: c.firstname,
      lastname: c.lastname,
      memberid: Number(c.memberid ?? 0),
      faction: c.faction,
      isLspd: c.is_lspd,
      photo: c.photo ?? "",
      status: c.status as PortalCharacterDto["status"],
      requestedAt: c.requested_at,
    }));
  },
);

/** Seçilen karakteri yönetici onayına gönderir. */
export const requestCharacter = createServerFn({ method: "POST" })
  .inputValidator((input: { characterId: number }) => input)
  .handler(async ({ data }) => {
    const user = await validatePortalSession(true);
    const { requestCharacterApproval, logLoginEvent, listUserCharacters } = await import(
      "./portal-auth.server"
    );
    await requestCharacterApproval(user.id, data.characterId);
    const target = (await listUserCharacters(user.id)).find(
      (c) => Number(c.character_id) === data.characterId,
    );
    await logLoginEvent(
      user.id,
      user.username,
      "character_request",
      target ? `${target.firstname} ${target.lastname}` : String(data.characterId),
    );
    return { ok: true };
  });

export const listCharacterRequests = createServerFn({ method: "GET" })
  .middleware([requirePortalAdminMiddleware])
  .handler(async () => {
    const { listPendingCharacters } = await import("./portal-auth.server");
    const rows = await listPendingCharacters();
    return rows.map((c) => ({
      rowId: c.id,
      id: Number(c.character_id),
      username: c.username,
      firstname: c.firstname,
      lastname: c.lastname,
      memberid: Number(c.memberid ?? 0),
      faction: c.faction,
      isLspd: c.is_lspd,
      photo: c.photo ?? "",
      requestedAt: c.requested_at,
    }));
  });

export type CharacterRequestDto = Awaited<ReturnType<typeof listCharacterRequests>>[number];

export const decideCharacterRequest = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { rowId: string; status: "approved" | "rejected" }) => input)
  .handler(async ({ data, context }) => {
    const { decideCharacter, logLoginEvent } = await import("./portal-auth.server");
    const character = await decideCharacter(data.rowId, context.userId, data.status);
    await logLoginEvent(
      context.userId,
      context.user.username,
      data.status === "approved" ? "character_approve" : "character_reject",
      `${character.firstname} ${character.lastname}`,
    );
    return { ok: true };
  });
