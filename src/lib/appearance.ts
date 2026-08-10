export type ThemeMode = "dark" | "light";
export type Density = "comfortable" | "compact";

export type Appearance = {
  theme: ThemeMode;
  density: Density;
  softContrast: boolean;
};

export const defaultAppearance: Appearance = {
  theme: "dark",
  density: "comfortable",
  softContrast: false,
};

const STORAGE_KEY = "lspd-appearance";

export function readAppearance(): Appearance {
  if (typeof window === "undefined") return defaultAppearance;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAppearance;
    return { ...defaultAppearance, ...(JSON.parse(raw) as Partial<Appearance>) };
  } catch {
    return defaultAppearance;
  }
}

export function applyAppearance(a: Appearance) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("theme-light", a.theme === "light");
  root.classList.toggle("dark", a.theme === "dark");
  root.dataset["density"] = a.density;
  root.dataset["contrast"] = a.softContrast ? "soft" : "normal";
}

export function writeAppearance(a: Appearance) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    /* storage unavailable */
  }
  applyAppearance(a);
  window.dispatchEvent(new CustomEvent("lspd-appearance", { detail: a }));
}

/** Inline script that applies saved appearance before first paint. */
export const appearanceBootScript = `(function(){try{var a=JSON.parse(localStorage.getItem("${STORAGE_KEY}")||"{}");var r=document.documentElement;r.classList.toggle("theme-light",a.theme==="light");r.classList.toggle("dark",a.theme!=="light");r.dataset.density=a.density||"comfortable";r.dataset.contrast=a.softContrast?"soft":"normal";}catch(e){}})();`;
