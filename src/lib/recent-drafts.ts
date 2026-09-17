import { paperworkTypes, type PaperworkType } from "./paperwork-types";
import { deleteMyDraft, listMyDrafts } from "./portal-data.functions";

export type RecentDraft = {
  type: PaperworkType;
  savedAt: Date;
};

const PREFIX = "lspd-draft:";

/**
 * Sunucuda saklı taslakları tarayıcıya indirir (yalnızca yerelde olmayan
 * ya da daha eski olanları). Cihaz değişiminde taslakların kaybolmamasını sağlar.
 */
export async function syncDraftsFromServer(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const remote = await listMyDrafts({});
    for (const draft of remote) {
      const key = PREFIX + draft.slug;
      const remoteAt = new Date(draft.updatedAt);
      if (Number.isNaN(remoteAt.getTime())) continue;
      let localAt: Date | null = null;
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as { savedAt?: string };
          if (parsed?.savedAt) localAt = new Date(parsed.savedAt);
        }
      } catch {
        /* bozuk kayıt yok sayılır */
      }
      if (localAt && localAt.getTime() >= remoteAt.getTime()) continue;
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ data: draft.data, savedAt: remoteAt.toISOString() }),
        );
      } catch {
        /* kota dolu olabilir */
      }
    }
  } catch {
    /* oturum yoksa sessiz geç */
  }
}

/** Kaydedilmiş rapor taslaklarını en son çalışılandan başlayarak döndürür. */
export function loadRecentDrafts(limit = 4): RecentDraft[] {
  if (typeof window === "undefined") return [];

  const found: RecentDraft[] = [];
  for (const type of paperworkTypes) {
    try {
      const raw = localStorage.getItem(PREFIX + type.slug);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { savedAt?: string };
      if (!parsed?.savedAt) continue;
      const savedAt = new Date(parsed.savedAt);
      if (Number.isNaN(savedAt.getTime())) continue;
      found.push({ type, savedAt });
    } catch {
      /* bozuk taslak yok sayılır */
    }
  }

  return found.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime()).slice(0, limit);
}

/** Belirli bir taslak türünü tarayıcıdan ve sunucudan siler. */
export function removeDraft(slug: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PREFIX + slug);
  deleteMyDraft({ data: { slug } }).catch(() => {
    /* sessiz geç */
  });
}

/** "3 dakika önce" gibi kısa Türkçe zaman ifadesi. */
export function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "az önce";
  if (min < 60) return `${min} dk önce`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.round(hours / 24);
  return `${days} gün önce`;
}
