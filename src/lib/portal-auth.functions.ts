import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import type { PortalUser } from "./portal-auth.server";

export type PortalUserDto = {
  id: string;
  ucpUserId: number;
  username: string;
  status: "pending" | "approved" | "rejected";
  ucpRole: string;
  isAdmin: boolean;
  characters: Array<{ id: number; firstname: string; lastname: string; memberid: number }>;
  selectedCharacter: {
    id: number;
    firstname: string;
    lastname: string;
    memberid: number;
  } | null;
  lastLoginAt: string | null;
  createdAt: string;
};

export type PortalSessionDto = {
  id: string;
  ucpUserId: number;
  username: string;
  status: "pending" | "approved" | "rejected";
  isAdmin: boolean;
  characters: Array<{ id: number; firstname: string; lastname: string; memberid: number }>;
  selectedCharacter: { id: number; firstname: string; lastname: string; memberid: number } | null;
};

async function toUserDto(
  user: PortalUser,
  checkUserIsAdmin?: (userId: string) => Promise<boolean>,
): Promise<PortalUserDto> {
  const isAdmin = checkUserIsAdmin ? await checkUserIsAdmin(user.id) : false;
  return {
    id: user.id,
    ucpUserId: user.ucp_user_id,
    username: user.username ?? "",
    status: user.status as "pending" | "approved" | "rejected",
    ucpRole: user.ucp_role,
    isAdmin,
    characters: (user.characters ?? []) as Array<{ id: number; firstname: string; lastname: string; memberid: number }>,
    selectedCharacter: (user.selected_character ?? null) as {
      id: number;
      firstname: string;
      lastname: string;
      memberid: number;
    } | null,
    lastLoginAt: user.last_login_at,
    createdAt: user.created_at,
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
  const { checkUserIsAdmin } = await import("./portal-auth.server");
  const isAdmin = await checkUserIsAdmin(user.id);
  if (!isAdmin) throw new Error("Forbidden");
  return next({ context: { userId: user.id, user, isAdmin } });
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
  const {
    readSessionCookie,
    hashToken,
    findSessionByTokenHash,
    checkUserIsAdmin,
  } = await import("./portal-auth.server");

  const token = readSessionCookie();
  if (!token) return null;

  const result = await findSessionByTokenHash(hashToken(token));
  if (!result) return null;

  const { user } = result;
  const isAdmin = await checkUserIsAdmin(user.id);

  return {
    id: user.id,
    ucpUserId: user.ucp_user_id,
    username: user.username,
    status: user.status as PortalSessionDto["status"],
    isAdmin,
    characters: (user.characters ?? []) as PortalSessionDto["characters"],
    selectedCharacter: (user.selected_character ?? null) as PortalSessionDto["selectedCharacter"],
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
    const { listPendingUsers: listPending, checkUserIsAdmin } = await import("./portal-auth.server");
    const users = await listPending();
    return Promise.all(users.map((u) => toUserDto(u, checkUserIsAdmin)));
  });

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requirePortalAdminMiddleware])
  .handler(async () => {
    const { listAllUsers, checkUserIsAdmin } = await import("./portal-auth.server");
    const users = await listAllUsers();
    return Promise.all(users.map((u) => toUserDto(u, checkUserIsAdmin)));
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

export const toggleAdmin = createServerFn({ method: "POST" })
  .middleware([requirePortalAdminMiddleware])
  .inputValidator((input: { userId: string; makeAdmin: boolean }) => input)
  .handler(async ({ data, context }) => {
    const { assignRole, removeRole, findPortalUserById } = await import("./portal-auth.server");
    if (data.userId === context.userId && !data.makeAdmin) {
      throw new Error("You cannot remove your own admin role");
    }
    if (data.makeAdmin) {
      await assignRole(data.userId, "admin");
    } else {
      await removeRole(data.userId, "admin");
    }
    const user = await findPortalUserById(data.userId);
    if (!user) throw new Error("User not found");
    return toUserDto(user);
  });

export const setSelectedCharacter = createServerFn({ method: "POST" })
  .middleware([requirePortalAuthMiddleware])
  .inputValidator((input: { character: { id: number; firstname: string; lastname: string; memberid: number } | null }) => input)
  .handler(async ({ data, context }) => {
    const { setSelectedCharacter: doSet } = await import("./portal-auth.server");
    await doSet(context.userId, data.character);
    return { ok: true };
  });
