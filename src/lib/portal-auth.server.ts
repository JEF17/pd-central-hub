import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { getRequestHeader, setResponseHeader, setResponseHeaders } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";
import type { OfficerProfile } from "./officer-profile";

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
  faction?: string | null;
  isLspd?: boolean;
  photo?: string | null;
  raw?: Record<string, unknown>;
}

/** MDC (UCP ile entegre) — karakter fotoğrafları buradan gelir. */
export const MDC_USER_URL = "https://mdc-tr.gta.world/api/user";

function pickPhotoUrl(raw: Record<string, unknown>): string | null {
  const keys = ["image", "img", "photo", "picture", "avatar", "mugshot", "character_image", "image_url"];
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && /^https?:\/\//i.test(value)) return value;
  }
  return null;
}

/**
 * MDC, UCP oturumuyla çalıştığı için UCP access token'ı ile denenir.
 * Erişilemezse boş sonuç döner; sistem fotoğrafsız çalışmaya devam eder.
 */
export async function fetchMdcCharacterPhotos(accessToken: string): Promise<Record<number, string>> {
  const photos: Record<number, string> = {};
  try {
    const res = await fetch(MDC_USER_URL, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    });
    if (!res.ok) return photos;
    const data = (await res.json()) as unknown;

    const seen = new Set<unknown>();
    const walk = (value: unknown): void => {
      if (!value || typeof value !== "object" || seen.has(value)) return;
      seen.add(value);
      if (Array.isArray(value)) {
        for (const item of value) walk(item);
        return;
      }
      const obj = value as Record<string, unknown>;
      const id = Number(obj['id'] ?? obj['character_id']);
      const photo = pickPhotoUrl(obj);
      if (Number.isFinite(id) && photo) photos[id] = photo;
      for (const v of Object.values(obj)) walk(v);
    };
    walk(data);
  } catch {
    /* MDC erişilemedi */
  }
  return photos;
}


const LSPD_PATTERN = /(lspd|los santos police|police department|san andreas state police|\bpolice\b)/i;

/** Walks a character object and returns the first faction-looking string that matches LSPD. */
export function detectLspdFaction(raw: Record<string, unknown>): string | null {
  const seen = new Set<unknown>();
  const walk = (value: unknown): string | null => {
    if (typeof value === "string") return LSPD_PATTERN.test(value) ? value : null;
    if (!value || typeof value !== "object" || seen.has(value)) return null;
    seen.add(value);
    for (const v of Object.values(value as Record<string, unknown>)) {
      const hit = walk(v);
      if (hit) return hit;
    }
    return null;
  };
  return walk(raw);
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
): Promise<{ accessToken: string; refreshToken?: string | undefined }> {
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
        .map((c: unknown): UcpCharacter | null => {
          if (!c || typeof c !== "object") return null;
          const rc = c as Record<string, unknown>;
          const faction = detectLspdFaction(rc);
          return {
            id: Number(rc['id']),
            firstname: String(rc['firstname'] ?? ""),
            lastname: String(rc['lastname'] ?? ""),
            memberid: Number(rc['memberid']),
            faction,
            isLspd: !!faction,
            raw: rc,
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

export type AdminLevel = "query" | "faction_management" | "supervisor";

const ADMIN_LEVEL_ORDER: AdminLevel[] = ["query", "faction_management", "supervisor"];

export async function getAdminLevel(userId: string): Promise<AdminLevel | null> {
  const { data, error } = await supabaseAdmin
    .from("portal_user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw error;
  const roles = (data ?? []).map((r) => r.role as string);
  // legacy "admin" role maps to faction_management
  if (roles.includes("admin") && !roles.includes("faction_management")) roles.push("faction_management");
  for (const level of ADMIN_LEVEL_ORDER) {
    if (roles.includes(level)) return level;
  }
  return null;
}

export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  return (await getAdminLevel(userId)) !== null;
}

export async function setAdminLevel(userId: string, level: AdminLevel | null): Promise<void> {
  const { error: delError } = await supabaseAdmin
    .from("portal_user_roles")
    .delete()
    .eq("user_id", userId)
    .in("role", ["admin", "supervisor", "faction_management", "query"]);
  if (delError) throw delError;

  if (level) {
    const { error } = await supabaseAdmin
      .from("portal_user_roles")
      .upsert({ user_id: userId, role: level }, { onConflict: "user_id,role" });
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
      .from("portal_user_roles")
      .upsert({ user_id: userId, role: "user" }, { onConflict: "user_id,role" });
    if (error) throw error;
  }
}

export async function ensureQueryRole(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("portal_user_roles")
    .upsert({ user_id: userId, role: "query" }, { onConflict: "user_id,role" });
  if (error) throw error;
}


export async function createPortalUser(info: UcpUserInfo, isAdmin: boolean): Promise<PortalUser> {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .insert({
      ucp_user_id: info.ucpUserId,
      username: info.username,
      ucp_role: info.ucpRole,
      status: isAdmin ? "approved" : "pending",
      characters: info.characters as unknown as Json,
      selected_character: null,
      last_login_at: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Failed to create portal user");

  const user = data as PortalUser;

  await supabaseAdmin.from("portal_user_roles").insert({
    user_id: user.id,
    role: isAdmin ? "query" : "user",
  });

  return user;
}

export async function updatePortalUserLogin(userId: string, info: UcpUserInfo): Promise<PortalUser> {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .update({
      username: info.username,
      ucp_role: info.ucpRole,
      characters: info.characters as unknown as Json,
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

export async function updateOfficerProfile(
  userId: string,
  profile: OfficerProfile & { profiles?: OfficerProfile[] },
): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("portal_users")
    .update({
      profile: profile as unknown as Json,
      profile_completed: true,
      updated_at: now,
    })
    .eq("id", userId);
  if (error) throw error;
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

export type PortalLoginLog = Database["public"]["Tables"]["portal_login_logs"]["Row"];

export async function listPortalLogs(limit = 200): Promise<PortalLoginLog[]> {
  const { data, error } = await supabaseAdmin
    .from("portal_login_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as PortalLoginLog[];
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

export async function resubmitApplication(userId: string): Promise<PortalUser> {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("portal_users")
    .update({ status: "pending", decided_at: null, decided_by: null, updated_at: now })
    .eq("id", userId)
    .eq("status", "rejected")
    .select("*")
    .single();
  if (error) throw error;
  if (!data) throw new Error("User not found or not rejected");
  return data as PortalUser;
}

export async function deletePortalUser(userId: string): Promise<void> {
  const { error: sessionsError } = await supabaseAdmin.from("portal_sessions").delete().eq("user_id", userId);
  if (sessionsError) throw sessionsError;
  const { error: rolesError } = await supabaseAdmin.from("portal_user_roles").delete().eq("user_id", userId);
  if (rolesError) throw rolesError;
  const { error: charactersError } = await supabaseAdmin.from("portal_characters").delete().eq("user_id", userId);
  if (charactersError) throw charactersError;
  const { error: logsError } = await supabaseAdmin.from("portal_login_logs").delete().eq("user_id", userId);
  if (logsError) throw logsError;
  const { error } = await supabaseAdmin.from("portal_users").delete().eq("id", userId);
  if (error) throw error;
}

export async function assignRole(userId: string, role: "user" | "admin" | AdminLevel): Promise<void> {
  const { error } = await supabaseAdmin.from("portal_user_roles").upsert(
    { user_id: userId, role },
    { onConflict: "user_id,role" },
  );
  if (error) throw error;
}

export async function removeRole(userId: string, role: "user" | "admin" | AdminLevel): Promise<void> {
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

export type PortalCharacter = Database["public"]["Tables"]["portal_characters"]["Row"];

/**
 * Stores the account's UCP characters. Only LSPD characters are kept; if UCP returned no
 * faction information at all, every character is kept so an admin can still decide manually.
 */
export async function syncUserCharacters(
  userId: string,
  characters: UcpCharacter[],
): Promise<PortalCharacter[]> {
  const anyLspd = characters.some((c) => c.isLspd);
  const relevant = anyLspd ? characters.filter((c) => c.isLspd) : characters;

  if (relevant.length > 0) {
    const now = new Date().toISOString();
    const { error } = await supabaseAdmin.from("portal_characters").upsert(
      relevant.map((c) => ({
        user_id: userId,
        character_id: c.id,
        firstname: c.firstname,
        lastname: c.lastname,
        memberid: Number.isFinite(c.memberid) ? c.memberid : null,
        faction: c.faction ?? null,
        is_lspd: !!c.isLspd,
        raw: (c.raw ?? {}) as unknown as Json,
        updated_at: now,
      })),
      { onConflict: "user_id,character_id", ignoreDuplicates: false },
    );
    if (error) throw error;
  }

  return listUserCharacters(userId);
}

export async function listUserCharacters(userId: string): Promise<PortalCharacter[]> {
  const { data, error } = await supabaseAdmin
    .from("portal_characters")
    .select("*")
    .eq("user_id", userId)
    .order("firstname", { ascending: true });
  if (error) throw error;
  return (data ?? []) as PortalCharacter[];
}

/**
 * Backfills character rows for accounts created before character-level approvals existed.
 * An already-approved account keeps its previously selected character approved.
 */
export async function ensureUserCharacters(user: PortalUser): Promise<PortalCharacter[]> {
  const existing = await listUserCharacters(user.id);
  if (existing.length > 0) return existing;

  const legacyCharacters = Array.isArray(user.characters)
    ? (user.characters as Array<Record<string, unknown>>)
        .map((character): UcpCharacter | null => {
          const id = Number(character['id']);
          if (!Number.isFinite(id)) return null;
          return {
            id,
            firstname: String(character['firstname'] ?? ""),
            lastname: String(character['lastname'] ?? ""),
            memberid: Number(character['memberid']),
            faction: null,
            isLspd: false,
            raw: character,
          };
        })
        .filter((character): character is UcpCharacter => character !== null)
    : [];

  if (legacyCharacters.length === 0) return [];
  const synced = await syncUserCharacters(user.id, legacyCharacters);

  if (user.status !== "approved" || !user.selected_character) return synced;

  let selected: unknown = user.selected_character;
  if (typeof selected === "string") {
    try {
      selected = JSON.parse(selected);
    } catch {
      selected = null;
    }
  }
  const selectedId = Number((selected as { id?: unknown } | null)?.id);
  if (!Number.isFinite(selectedId)) return synced;

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("portal_characters")
    .update({ status: "approved", requested_at: now, decided_at: now, decided_by: user.id })
    .eq("user_id", user.id)
    .eq("character_id", selectedId);
  if (error) throw error;

  return listUserCharacters(user.id);
}

export async function listAllCharacters(): Promise<
  Array<PortalCharacter & { username: string | null }>
> {
  const { data, error } = await supabaseAdmin
    .from("portal_characters")
    .select("*, portal_users!inner(username)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as Array<Record<string, unknown>>).map((row) => {
    const { portal_users: owner, ...rest } = row;
    return {
      ...(rest as unknown as PortalCharacter),
      username: ((owner as { username?: string | null } | null)?.username ?? null) as string | null,
    };
  });
}

export async function requestCharacterApproval(userId: string, characterId: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from("portal_characters")
    .update({ requested_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("character_id", characterId)
    .eq("status", "pending");
  if (error) throw error;

  // A rejected account can apply again with another character: reopen it as pending.
  const { error: userError } = await supabaseAdmin
    .from("portal_users")
    .update({ status: "pending", decided_at: null, decided_by: null, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .eq("status", "rejected");
  if (userError) throw userError;
}

export async function decideCharacter(
  characterRowId: string,
  adminId: string,
  status: "approved" | "rejected",
): Promise<PortalCharacter> {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("portal_characters")
    .update({ status, decided_at: now, decided_by: adminId })
    .eq("id", characterRowId)
    .select("*")
    .single();
  if (error) throw error;
  if (!data) throw new Error("Karakter bulunamadı");

  const character = data as PortalCharacter;
  await syncUserStatusFromCharacters(character.user_id, adminId);
  return character;
}

/** A portal user is approved as soon as at least one of their characters is approved. */
export async function syncUserStatusFromCharacters(userId: string, adminId: string): Promise<void> {
  const characters = await listUserCharacters(userId);
  const approved = characters.filter((c) => c.status === "approved");
  const now = new Date().toISOString();

  const user = await findPortalUserById(userId);
  if (!user) return;
  if (user.status === "rejected" && approved.length === 0) return;

  const nextStatus = approved.length > 0 ? "approved" : "pending";

  let selected = user.selected_character as unknown;
  if (typeof selected === "string") {
    try {
      selected = JSON.parse(selected);
    } catch {
      selected = null;
    }
  }
  const selectedId = (selected as { id?: number } | null)?.id ?? null;
  const selectedStillApproved =
    selectedId !== null && approved.some((c) => Number(c.character_id) === Number(selectedId));

  let selectedUpdate: string | null | undefined;
  if (!selectedStillApproved) {
    const fallback = approved[0];
    selectedUpdate = fallback
      ? JSON.stringify({
          id: Number(fallback.character_id),
          firstname: fallback.firstname,
          lastname: fallback.lastname,
          memberid: Number(fallback.memberid ?? 0),
        })
      : null;
  }

  const { error } = await supabaseAdmin
    .from("portal_users")
    .update({
      status: nextStatus,
      decided_at: now,
      decided_by: adminId,
      updated_at: now,
      ...(selectedUpdate !== undefined ? { selected_character: selectedUpdate } : {}),
    })
    .eq("id", userId);
  if (error) throw error;
}
