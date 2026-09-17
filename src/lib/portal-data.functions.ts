import { createServerFn } from "@tanstack/react-start";

import { requirePortalAuthMiddleware } from "./portal-auth.functions";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type DraftData = { [key: string]: JsonValue };

export type DraftDto = {
  slug: string;
  data: DraftData;
  updatedAt: string;
};

export type NotificationDto = {
  id: string;
  kind: "success" | "error" | "info";
  message: string;
  description?: string;
  at: string;
  read: boolean;
};

function toKind(raw: string): NotificationDto["kind"] {
  return raw === "success" || raw === "error" ? raw : "info";
}

/* ---------------- Rapor taslakları ---------------- */

export const listMyDrafts = createServerFn({ method: "GET" })
  .middleware([requirePortalAuthMiddleware])
  .handler(async ({ context }): Promise<DraftDto[]> => {
    const { listDraftRows } = await import("./portal-data.server");
    return listDraftRows(context.userId);
  });

export const getMyDraft = createServerFn({ method: "GET" })
  .middleware([requirePortalAuthMiddleware])
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data, context }): Promise<DraftDto | null> => {
    const { getDraftRow } = await import("./portal-data.server");
    return getDraftRow(context.userId, data.slug);
  });

export const saveMyDraft = createServerFn({ method: "POST" })
  .middleware([requirePortalAuthMiddleware])
  .inputValidator((input: { slug: string; data: DraftData }) => input)
  .handler(async ({ data, context }): Promise<{ updatedAt: string }> => {
    const { upsertDraftRow } = await import("./portal-data.server");
    const updatedAt = await upsertDraftRow(context.userId, data.slug, data.data);
    return { updatedAt };
  });

export const deleteMyDraft = createServerFn({ method: "POST" })
  .middleware([requirePortalAuthMiddleware])
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data, context }) => {
    const { deleteDraftRow } = await import("./portal-data.server");
    await deleteDraftRow(context.userId, data.slug);
    return { ok: true };
  });

/* ---------------- Bildirimler ---------------- */

export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([requirePortalAuthMiddleware])
  .handler(async ({ context }): Promise<NotificationDto[]> => {
    const { listNotificationRows } = await import("./portal-data.server");
    const rows = await listNotificationRows(context.userId);
    return rows.map((r) => ({
      id: r.id,
      kind: toKind(r.kind),
      message: r.message,
      at: r.createdAt,
      read: r.read,
      ...(r.description ? { description: r.description } : {}),
    }));
  });

export const addMyNotification = createServerFn({ method: "POST" })
  .middleware([requirePortalAuthMiddleware])
  .inputValidator((input: { kind: string; message: string; description?: string }) => input)
  .handler(async ({ data, context }): Promise<NotificationDto | null> => {
    const { insertNotificationRow } = await import("./portal-data.server");
    const row = await insertNotificationRow(
      context.userId,
      toKind(data.kind),
      data.message,
      data.description ?? null,
    );
    if (!row) return null;
    return {
      id: row.id,
      kind: toKind(row.kind),
      message: row.message,
      at: row.createdAt,
      read: row.read,
      ...(row.description ? { description: row.description } : {}),
    };
  });

export const markMyNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requirePortalAuthMiddleware])
  .handler(async ({ context }) => {
    const { markNotificationsReadRows } = await import("./portal-data.server");
    await markNotificationsReadRows(context.userId);
    return { ok: true };
  });

export const clearMyNotifications = createServerFn({ method: "POST" })
  .middleware([requirePortalAuthMiddleware])
  .handler(async ({ context }) => {
    const { clearNotificationRows } = await import("./portal-data.server");
    await clearNotificationRows(context.userId);
    return { ok: true };
  });
