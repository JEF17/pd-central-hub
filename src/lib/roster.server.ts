import type { OfficerProfile } from "./officer-profile";

type StoredProfilePayload = OfficerProfile & { profiles?: OfficerProfile[] };

function keyOf(p: OfficerProfile): string {
  const serial = (p.serialNo ?? "").trim().toLowerCase();
  const name = (p.name ?? "").trim().toLowerCase();
  return serial || name;
}

/**
 * Oyuncunun personel profillerini çalışan listesine (roster) yansıtır.
 * Aynı kullanıcıya ait, artık var olmayan kayıtlar silinir.
 */
export async function syncRosterFromProfiles(
  userId: string,
  payload: StoredProfilePayload,
): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const all: OfficerProfile[] =
    Array.isArray(payload.profiles) && payload.profiles.length > 0
      ? payload.profiles
      : [payload];

  const valid = all.filter((p) => (p.name ?? "").trim().length > 0 && keyOf(p));
  const keys = new Set<string>();

  for (const p of valid) {
    const key = keyOf(p);
    if (keys.has(key)) continue;
    keys.add(key);
    const row = {
      user_id: userId,
      profile_key: key,
      name: (p.name ?? "").trim(),
      serial_no: (p.serialNo ?? "").trim(),
      rank: (p.rank ?? "").trim(),
      division: (p.division ?? "").trim(),
      photo: p.photo ?? "",
      email: (p.email ?? "").trim(),
      phone: (p.phone ?? "").trim(),
      discord: (p.discord ?? "").trim(),
      status: "active",
      note: (p.assignmentDescription ?? "").trim(),
      created_by: userId,
    };
    const { data: found } = await supabaseAdmin
      .from("portal_roster")
      .select("id")
      .eq("user_id", userId)
      .eq("profile_key", key)
      .maybeSingle();
    if (found) {
      const { error } = await supabaseAdmin
        .from("portal_roster")
        .update(row as never)
        .eq("id", (found as unknown as { id: string }).id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from("portal_roster").insert(row as never);
      if (error) throw error;
    }

  }

  const { data: existing, error: listError } = await supabaseAdmin
    .from("portal_roster")
    .select("id, profile_key")
    .eq("user_id", userId);
  if (listError) throw listError;

  const stale = ((existing ?? []) as unknown as { id: string; profile_key: string | null }[])
    .filter((r) => !r.profile_key || !keys.has(r.profile_key))
    .map((r) => r.id);

  if (stale.length > 0) {
    const { error } = await supabaseAdmin.from("portal_roster").delete().in("id", stale);
    if (error) throw error;
  }
}
