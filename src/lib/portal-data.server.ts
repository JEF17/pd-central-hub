/** Sunucu tarafı: rapor taslakları ve bildirimler için veritabanı erişimi. */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type DraftData = { [key: string]: JsonValue };

export type DraftRow = {
  slug: string;
  data: DraftData;
  updatedAt: string;
};

export type NotificationRow = {
  id: string;
  kind: string;
  message: string;
  description: string | null;
  read: boolean;
  createdAt: string;
};

const NOTIFICATION_LIMIT = 50;

export async function listDraftRows(userId: string): Promise<DraftRow[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("portal_drafts")
    .select("slug, data, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const r = row as unknown as {
      slug: string;
      data: DraftData;
      updated_at: string;
    };
    return { slug: r.slug, data: r.data, updatedAt: r.updated_at };
  });
}

export async function getDraftRow(userId: string, slug: string): Promise<DraftRow | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("portal_drafts")
    .select("slug, data, updated_at")
    .eq("user_id", userId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as unknown as {
    slug: string;
    data: DraftData;
    updated_at: string;
  };
  return { slug: r.slug, data: r.data, updatedAt: r.updated_at };
}

export async function upsertDraftRow(
  userId: string,
  slug: string,
  data: unknown,
): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("portal_drafts")
    .upsert(
      {
        user_id: userId,
        slug,
        data: data as never,
        updated_at: now,
      } as never,
      { onConflict: "user_id,slug" },
    );
  if (error) throw error;
  return now;
}

export async function deleteDraftRow(userId: string, slug: string): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("portal_drafts")
    .delete()
    .eq("user_id", userId)
    .eq("slug", slug);
  if (error) throw error;
}

export async function listNotificationRows(userId: string): Promise<NotificationRow[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("portal_notifications")
    .select("id, kind, message, description, read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(NOTIFICATION_LIMIT);
  if (error) throw error;
  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      kind: string;
      message: string;
      description: string | null;
      read: boolean;
      created_at: string;
    };
    return {
      id: r.id,
      kind: r.kind,
      message: r.message,
      description: r.description,
      read: r.read,
      createdAt: r.created_at,
    };
  });
}

export async function insertNotificationRow(
  userId: string,
  kind: string,
  message: string,
  description: string | null,
): Promise<NotificationRow | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("portal_notifications")
    .insert({ user_id: userId, kind, message, description } as never)
    .select("id, kind, message, description, read, created_at")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as unknown as {
    id: string;
    kind: string;
    message: string;
    description: string | null;
    read: boolean;
    created_at: string;
  };
  return {
    id: r.id,
    kind: r.kind,
    message: r.message,
    description: r.description,
    read: r.read,
    createdAt: r.created_at,
  };
}

export async function markNotificationsReadRows(userId: string): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("portal_notifications")
    .update({ read: true } as never)
    .eq("user_id", userId)
    .eq("read", false);
  if (error) throw error;
}

export async function clearNotificationRows(userId: string): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("portal_notifications")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}
