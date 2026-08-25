import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { getRequestHeader, setResponseHeader, setResponseHeaders } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

export type PortalUser = Database["public"]["Tables"]["portal_users"]["Row"];
export type PortalSession = Database["public"]["Tables"]["portal_sessions"]["Row"];

export const UCP_AUTH_URL = "https://ucp-tr.gta.world/oauth/authorize";
export const UCP_TOKEN_URL = "https://ucp-tr.gta.world/oauth/token";
export const UCP_USER_URL = "https://ucp-tr.gta.world/api/user";

export const SESSION_COOKIE = "portal_session";
export const STATE_COOKIE = "portal_oauth_state";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export interface UcpCharacter {
  id: number;
  firstname: string;
  lastname: string;
  memberid: number;
}

export interface UcpUserInfo {
  ucpUserId: number;
  username: string;
  confirmed: boolean;
  ucpRole: string;
  characters: UcpCharacter[];
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey || rest.length === 0) continue;
    const key = decodeURIComponent(rawKey);
    cookies[key] = decodeURIComponent(rest.join("="));
  }
  return cookies;
}

function serializeCookie(
  name: string,
  value: string,
  opts: {
    maxAge?: number;
    sameSite?: "Lax" | "None" | "Strict";
    secure?: boolean;
  } = {},
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`, "HttpOnly", "Path=/"];
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  if (opts.secure) parts.push("Secure");
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`);
  return parts.join("; ");
}

export function setSessionCookie(token: string): void {
  setResponseHeader("Set-Cookie", serializeSessionCookie(token));
}

export function serializeSessionCookie(token: string): string {
  return serializeCookie(SESSION_COOKIE, token, {
    maxAge: SESSION_TTL_SECONDS,
    sameSite: "Lax",
    secure: true,
  });
}

export function clearSessionCookie(): void {
  setResponseHeader(
    "Set-Cookie",
    serializeCookie(SESSION_COOKIE, "", {
      maxAge: 0,
      sameSite: "Lax",
      secure: true,
    }),
  );
}

export function setOAuthStateCookie(state: string): void {
  setResponseHeader(
    "Set-Cookie",
    serializeCookie(STATE_COOKIE, state, {
      maxAge: 600,
      sameSite: "None",
      secure: true,
    }),
  );
}

export function clearOAuthStateCookie(): string {
  return serializeCookie(STATE_COOKIE, "", {
    maxAge: 0,
    sameSite: "None",
    secure: true,
  });
}

export function readSessionCookie(): string | undefined {
  const cookies = parseCookies(getRequestHeader("cookie") ?? null);
  return cookies[SESSION_COOKIE];
}

export function readOAuthStateCookie(): string | undefined {
  const cookies = parseCookies(getRequestHeader("cookie") ?? null);
  return cookies[STATE_COOKIE];
}

export function buildUcpAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const url = new URL(UCP_AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "");
  return url.toString();
}

export async function exchangeUcpCode(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<{ accessToken: string; refreshToken?: string }> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetch(UCP_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`UCP token exchange failed (${res.status}): ${text}`);
  }

  let data: Record<string, unknown>;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("UCP token response was not valid JSON");
  }

  const accessToken = data['access_token'];
  if (typeof accessToken !== "string") {
    throw new Error("UCP token response missing access_token");
  }

  return { accessToken, refreshToken: typeof data['refresh_token'] === "string" ? data['refresh_token'] : undefined } as { accessToken: string; refreshToken?: string | undefined };
}

export async function fetchUcpUserInfo(accessToken: string): Promise<UcpUserInfo> {
  const res = await fetch(UCP_USER_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`UCP user fetch failed (${res.status}): ${text}`);
  }

  let data: { user?: unknown };
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("UCP user response was not valid JSON");
  }

  const user = data.user;
  if (!user || typeof user !== "object" || user === null) {
    throw new Error("UCP user response missing user object");
  }

  const u = user as Record<string, unknown>;
  const ucpUserId = Number(u['id']);
  if (!Number.isFinite(ucpUserId)) {
    throw new Error("UCP user response missing numeric id");
  }

  const rawRole = u['role'];
  const ucpRole =
    rawRole && typeof rawRole === "object" && "role_id" in rawRole
      ? String((rawRole as { role_id?: unknown }).role_id ?? "")
      : "";

  const rawCharacters = u['character'];
  const characters: UcpCharacter[] = Array.isArray(rawCharacters)
    ? rawCharacters
        .map((c: unknown) => {
          if (!c || typeof c !== "object") return null;
          const rc = c as Record<string, unknown>;
          return {
            id: Number(rc['id']),
            firstname: String(rc['firstname'] ?? ""),
            lastname: String(rc['lastname'] ?? ""),
            memberid: Number(rc['memberid']),
          };
        })
        .filter((c): c is UcpCharacter => !!c && Number.isFinite(c.id))
    : [];

  return {
    ucpUserId,
    username: String(u['username'] ?? ""),
    confirmed: Boolean(u['confirmed']),
    ucpRole,
    characters,
  };
}

export async function findPortalUserByUcpId(ucpUserId: number): Promise<PortalUser | null> {
  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .select("*")
    .eq("ucp_user_id", ucpUserId)
    .maybeSingle();
  if (error) throw error;
  return data as PortalUser | null;
}

export async function findPortalUserById(id: string): Promise<PortalUser | null> {
  const { data, error } = await supabaseAdmin.from("portal_users").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as PortalUser | null;
}

export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("portal_user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin");
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function createPortalUser(info: UcpUserInfo, isAdmin: boolean): Promise<PortalUser> {
  const now = new Date().toISOString();
  const selectedCharacter = info.characters[0] ?? null;

  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .insert({
      ucp_user_id: info.ucpUserId,
      username: info.username,
      ucp_role: info.ucpRole,
      status: isAdmin ? "approved" : "pending",
      characters: info.characters as unknown as Json,
      selected_character: (selectedCharacter ? JSON.stringify(selectedCharacter) : null) as string | null,
      last_login_at: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Failed to create portal user");

  const user = data as PortalUser;

  await supabaseAdmin.from("portal_user_roles").insert({
    user_id: user.id,
    role: isAdmin ? "admin" : "user",
  });

  return user;
}

export async function updatePortalUserLogin(userId: string, info: UcpUserInfo): Promise<PortalUser> {
  const now = new Date().toISOString();
  const selectedCharacter = info.characters[0] ?? null;

  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .update({
      username: info.username,
      ucp_role: info.ucpRole,
      characters: info.characters as unknown as Json,
      selected_character: (selectedCharacter ? JSON.stringify(selectedCharacter) : null) as string | null,
      last_login_at: now,
      updated_at: now,
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Failed to update portal user");
  return data as PortalUser;
}

export async function createSession(userId: string, tokenHash: string, userAgent: string | null): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  const { error } = await supabaseAdmin.from("portal_sessions").insert({
    user_id: userId,
    token_hash: tokenHash,
    user_agent: userAgent ?? null,
    expires_at: expiresAt,
  });
  if (error) throw error;
}

export async function findSessionByTokenHash(tokenHash: string): Promise<{ session: PortalSession; user: PortalUser } | null> {
  const { data, error } = await supabaseAdmin
    .from("portal_sessions")
    .select("*, portal_users!inner(*)")
    .eq("token_hash", tokenHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { portal_users: user, ...session } = data as unknown as Record<string, unknown>;
  return {
    session: session as unknown as PortalSession,
    user: user as unknown as PortalUser,
  };
}

export async function deleteSession(tokenHash: string): Promise<void> {
  const { error } = await supabaseAdmin.from("portal_sessions").delete().eq("token_hash", tokenHash);
  if (error) throw error;
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
  const { error } = await supabaseAdmin.from("portal_sessions").delete().eq("user_id", userId);
  if (error) throw error;
}

export async function logLoginEvent(
  userId: string | null,
  username: string | null,
  event: string,
  detail: string | null,
): Promise<void> {
  const { error } = await supabaseAdmin.from("portal_login_logs").insert({
    user_id: userId,
    username,
    event,
    detail,
  });
  if (error) throw error;
}

export async function listPendingUsers(): Promise<PortalUser[]> {
  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PortalUser[];
}

export async function listAllUsers(): Promise<PortalUser[]> {
  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PortalUser[];
}

export async function approveUser(userId: string, approvedById: string): Promise<PortalUser> {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .update({ status: "approved", decided_at: now, decided_by: approvedById, updated_at: now })
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  if (!data) throw new Error("User not found");
  return data as PortalUser;
}

export async function rejectUser(userId: string, rejectedById: string): Promise<PortalUser> {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .update({ status: "rejected", decided_at: now, decided_by: rejectedById, updated_at: now })
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  if (!data) throw new Error("User not found");
  return data as PortalUser;
}

export async function assignRole(userId: string, role: "user" | "admin"): Promise<void> {
  const { error } = await supabaseAdmin.from("portal_user_roles").upsert(
    { user_id: userId, role },
    { onConflict: "user_id,role" },
  );
  if (error) throw error;
}

export async function removeRole(userId: string, role: "user" | "admin"): Promise<void> {
  const { error } = await supabaseAdmin.from("portal_user_roles").delete().eq("user_id", userId).eq("role", role);
  if (error) throw error;
}

export async function setSelectedCharacter(userId: string, character: UcpCharacter | null): Promise<void> {
  const { error } = await supabaseAdmin
    .from("portal_users")
    .update({ selected_character: (character ? JSON.stringify(character) : null) as string | null, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}

// JSON helper used for casting Supabase JSON columns.
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
