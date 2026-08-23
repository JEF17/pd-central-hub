import { paperworkTypes, type PaperworkType } from "./paperwork-types";

export type RecentDraft = {
  type: PaperworkType;
  savedAt: Date;
};

const PREFIX = "lspd-draft:";

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
