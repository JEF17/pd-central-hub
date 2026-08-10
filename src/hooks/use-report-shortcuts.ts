import { useEffect } from "react";

import { notify } from "@/lib/notifications";

type Options = {
  /** Ctrl/Cmd + Enter */
  generate: () => void;
  /** Ctrl/Cmd + Shift + C copies this text when present. */
  output?: string;
  outputLabel?: string;
};

/** Keyboard shortcuts shared by every report generator. */
export function useReportShortcuts({ generate, output, outputLabel = "Çıktı" }: Options) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "Enter") {
        e.preventDefault();
        generate();
        notify.success("Rapor oluşturuldu");
        return;
      }

      if (e.shiftKey && (e.key === "c" || e.key === "C")) {
        if (!output) return;
        e.preventDefault();
        void navigator.clipboard.writeText(output);
        notify.success(`${outputLabel} kopyalandı`);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [generate, output, outputLabel]);
}
