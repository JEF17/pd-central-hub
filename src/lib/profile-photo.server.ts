import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { OfficerProfile } from "./officer-profile";

export const PROFILE_PHOTO_BUCKET = "profile-photos";
/** Fotoğrafları sunan herkese açık rota öneki. */
export const PROFILE_PHOTO_URL_PREFIX = "/api/public/profile-photo/";

const DATA_URL_RE = /^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i;

function extensionFor(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

/**
 * Base64 (data URL) fotoğrafı Storage'a yükler ve kalıcı bağlantısını döner.
 * Zaten bağlantı olan (veya boş) değerler olduğu gibi geri döner.
 */
export async function persistProfilePhoto(userId: string, photo: string | null | undefined): Promise<string> {
  const raw = (photo ?? "").trim();
  if (!raw) return "";
  const match = DATA_URL_RE.exec(raw);
  if (!match) return raw;

  const mime = (match[1] ?? "image/jpeg").toLowerCase();
  const bytes = Buffer.from(match[2] ?? "", "base64");
  if (!bytes.length) return "";

  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 24);
  const path = `${userId}/${hash}.${extensionFor(mime)}`;

  const { error } = await supabaseAdmin.storage.from(PROFILE_PHOTO_BUCKET).upload(path, bytes, {
    contentType: mime,
    upsert: true,
  });
  if (error) throw error;

  return `${PROFILE_PHOTO_URL_PREFIX}${path}`;
}

/** Profil (ve alt profillerdeki) base64 fotoğrafları Storage bağlantılarına çevirir. */
export async function persistProfilePhotos<
  T extends OfficerProfile & { profiles?: OfficerProfile[] },
>(userId: string, payload: T): Promise<T> {
  const photo = await persistProfilePhoto(userId, payload.photo);
  const profiles = payload.profiles
    ? await Promise.all(
        payload.profiles.map(async (p) => ({ ...p, photo: await persistProfilePhoto(userId, p.photo) })),
      )
    : payload.profiles;
  return { ...payload, photo, ...(profiles ? { profiles } : {}) };
}

/** Storage'daki fotoğrafı okuyup byte'larını döner (herkese açık rota için). */
export async function readProfilePhoto(
  path: string,
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  if (!/^[A-Za-z0-9._/-]+$/.test(path) || path.includes("..")) return null;
  const { data, error } = await supabaseAdmin.storage.from(PROFILE_PHOTO_BUCKET).download(path);
  if (error || !data) return null;
  return { bytes: await data.arrayBuffer(), contentType: data.type || "image/jpeg" };
}
