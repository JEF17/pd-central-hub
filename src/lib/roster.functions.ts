import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { AdminLevel } from "./portal-auth.server";

export type RosterEntry = {
  id: string;
  name: string;
  serialNo: string;
  rank: string;
  division: string;
  photo: string;
  email: string;
  phone: string;
  discord: string;
  status: string;
  note: string;
  sortOrder: number;
  createdAt: string;
};

export type RosterInput = {
  name: string;
  serialNo?: string;
  rank?: string;
  division?: string;
  photo?: string;
  email?: string;
  phone?: string;
  discord?: string;
  status?: string;
  note?: string;
  sortOrder?: number;
};

type RosterRow = {
  id: string;
  name: string;
  serial_no: string;
  rank: string;
  division: string;
  photo: string;
  email: string;
  phone: string;
  discord: string;
  status: string;
  note: string;
  sort_order: number;
  created_at: string;
};

function toDto(row: RosterRow): RosterEntry {
  return {
    id: row.id,
    name: row.name,
    serialNo: row.serial_no ?? "",
    rank: row.rank ?? "",
    division: row.division ?? "",
    photo: row.photo ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    discord: row.discord ?? "",
    status: row.status ?? "active",
    note: row.note ?? "",
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  };
}

function isPreviewRequest(): boolean {
  const request = getRequest();
  if (!request) return false;
  const host = new URL(request.url).hostname;
  return host.startsWith("id-preview--") || host === "localhost";
}

/** Oturumu doğrular; önizleme ortamında sahte Query yöneticisi döner. */
async function requireAdmin(): Promise<{ userId: string | null; level: AdminLevel }> {
  if (isPreviewRequest()) return { userId: null, level: "query" };

  const { readSessionCookie, hashToken, findSessionByTokenHash, getAdminLevel } = await import(
    "./portal-auth.server"
  );
  const token = readSessionCookie();
  if (!token) throw new Error("Unauthorized");
  const result = await findSessionByTokenHash(hashToken(token));
  if (!result || result.user.status !== "approved") throw new Error("Unauthorized");
  const level = await getAdminLevel(result.user.id);
  if (!level) throw new Error("Forbidden");
  return { userId: result.user.id, level };
}

async function requireSession(): Promise<void> {
  if (isPreviewRequest()) return;
  const { readSessionCookie, hashToken, findSessionByTokenHash } = await import("./portal-auth.server");
  const token = readSessionCookie();
  if (!token) throw new Error("Unauthorized");
  const result = await findSessionByTokenHash(hashToken(token));
  if (!result || result.user.status !== "approved") throw new Error("Unauthorized");
}

function sanitize(input: RosterInput) {
  const name = (input.name ?? "").trim();
  if (!name) throw new Error("İsim zorunludur");
  return {
    name,
    serial_no: (input.serialNo ?? "").trim(),
    rank: (input.rank ?? "").trim(),
    division: (input.division ?? "").trim(),
    photo: input.photo ?? "",
    email: (input.email ?? "").trim(),
    phone: (input.phone ?? "").trim(),
    discord: (input.discord ?? "").trim(),
    status: (input.status ?? "active").trim() || "active",
    note: (input.note ?? "").trim(),
    sort_order: Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 0,
  };
}

export const listRoster = createServerFn({ method: "GET" }).handler(async () => {
  await requireSession();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("portal_roster")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as RosterRow[]).map(toDto);
});

export const createRosterEntry = createServerFn({ method: "POST" })
  .inputValidator((input: RosterInput) => input)
  .handler(async ({ data }) => {
    const { userId } = await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = { ...sanitize(data), created_by: userId };
    const { data: row, error } = await supabaseAdmin
      .from("portal_roster")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return toDto(row as unknown as RosterRow);
  });

export const updateRosterEntry = createServerFn({ method: "POST" })
  .inputValidator((input: RosterInput & { id: string }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("portal_roster")
      .update(sanitize(data) as never)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw error;
    return toDto(row as unknown as RosterRow);
  });

export const deleteRosterEntry = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portal_roster").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
