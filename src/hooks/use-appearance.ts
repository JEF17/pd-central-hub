import { useCallback, useEffect, useState } from "react";

import {
  applyAppearance,
  defaultAppearance,
  readAppearance,
  writeAppearance,
  type Appearance,
} from "@/lib/appearance";

export function useAppearance() {
  const [appearance, setAppearance] = useState<Appearance>(defaultAppearance);

  useEffect(() => {
    const current = readAppearance();
    setAppearance(current);
    applyAppearance(current);

    const onChange = (e: Event) => setAppearance((e as CustomEvent<Appearance>).detail);
    window.addEventListener("lspd-appearance", onChange);
    return () => window.removeEventListener("lspd-appearance", onChange);
  }, []);

  const update = useCallback((patch: Partial<Appearance>) => {
    setAppearance((prev) => {
      const next = { ...prev, ...patch };
      writeAppearance(next);
      return next;
    });
  }, []);

  return { appearance, update };
}
