import { useCallback, useEffect, useRef, useState } from "react";

import { deleteMyDraft, getMyDraft, saveMyDraft } from "@/lib/portal-data.functions";

const PREFIX = "lspd-draft:";

/**
 * Form state with automatic draft persistence.
 * Taslaklar hem tarayıcıda (anında) hem de sunucuda (cihazlar arası) saklanır.
 * Returns [data, setData, clearDraft, savedAt].
 */
export function useFormDraft<T>(key: string, initialValue: T | (() => T)) {
  const makeInitial = () =>
    typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
  const storageKey = PREFIX + key;
  const [data, setData] = useState<T>(makeInitial);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const hydrated = useRef(false);
  const touched = useRef(false);

  useEffect(() => {
    let localSavedAt: Date | null = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { data: T; savedAt?: string };
        if (parsed && typeof parsed === "object" && parsed.data) {
          setData({ ...makeInitial(), ...parsed.data });
          if (parsed.savedAt) {
            localSavedAt = new Date(parsed.savedAt);
            setSavedAt(localSavedAt);
          }
        }
      }
    } catch {
      /* bozuk taslak yok sayılır */
    }
    hydrated.current = true;

    // Sunucudaki taslak daha yeniyse onu kullan (cihaz değişimi / format sonrası)
    let cancelled = false;
    getMyDraft({ data: { slug: key } })
      .then((remote) => {
        if (cancelled || !remote || touched.current) return;
        const remoteAt = new Date(remote.updatedAt);
        if (Number.isNaN(remoteAt.getTime())) return;
        if (localSavedAt && remoteAt.getTime() <= localSavedAt.getTime()) return;
        if (!remote.data || typeof remote.data !== "object") return;
        setData({ ...makeInitial(), ...(remote.data as T) });
        setSavedAt(remoteAt);
      })
      .catch(() => {
        /* oturum yoksa sessiz geç */
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    // Kullanıcı bir şey yazmadan kayıt yapmayalım: aksi halde boş form
    // sunucudaki taslağın üzerine yazabilir.
    if (!hydrated.current || !touched.current) return;
    const t = setTimeout(() => {
      const now = new Date();
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ data, savedAt: now.toISOString() }),
        );
      } catch {
        /* kota dolu olabilir */
      }
      setSavedAt(now);
      saveMyDraft({ data: { slug: key, data } }).catch(() => {
        /* oturum yoksa yalnızca yerel kayıt */
      });
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, storageKey]);

  const update = useCallback((next: React.SetStateAction<T>) => {
    touched.current = true;
    setData(next);
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* yok sayılır */
    }
    touched.current = true;
    setData(makeInitial());
    setSavedAt(null);
    deleteMyDraft({ data: { slug: key } }).catch(() => {
      /* sessiz geç */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return [data, update, clearDraft, savedAt] as const;
}
