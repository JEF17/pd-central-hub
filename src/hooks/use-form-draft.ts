import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "lspd-draft:";

/**
 * Form state with automatic localStorage draft persistence.
 * Returns [data, setData, clearDraft, savedAt].
 */
export function useFormDraft<T>(key: string, initial: T) {
  const storageKey = PREFIX + key;
  const [data, setData] = useState<T>(initial);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { data: T; savedAt?: string };
        if (parsed && typeof parsed === "object" && parsed.data) {
          setData({ ...initial, ...parsed.data });
          if (parsed.savedAt) setSavedAt(new Date(parsed.savedAt));
        }
      }
    } catch {
      /* bozuk taslak yok sayılır */
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => {
      try {
        const now = new Date();
        localStorage.setItem(
          storageKey,
          JSON.stringify({ data, savedAt: now.toISOString() }),
        );
        setSavedAt(now);
      } catch {
        /* kota dolu olabilir */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* yok sayılır */
    }
    setData(initial);
    setSavedAt(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return [data, setData, clearDraft, savedAt] as const;
}
