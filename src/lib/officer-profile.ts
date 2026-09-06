export type OfficerProfile = {
  name: string;
  serialNo: string;
  rank: string;
  division: string; // tam isim, örn: "Mission Row Area Patrol Division"
  /** Karakter fotoğrafı (data URL) */
  photo: string;
  email: string;
  phone: string;
  discord: string;
  note: string;
};

export const emptyOfficerProfile: OfficerProfile = {
  name: "",
  serialNo: "",
  rank: "",
  division: "",
  photo: "",
  email: "",
  phone: "",
  discord: "",
  note: "",
};

/** LAPD rütbe yapısı: Police Officer I -> Chief of Police */
export const rankOptions: string[] = [
  "Police Officer I",
  "Police Officer II",
  "Police Officer III",
  "Police Officer III+1",
  "Detective I",
  "Detective II",
  "Detective III",
  "Sergeant I",
  "Sergeant II",
  "Lieutenant I",
  "Lieutenant II",
  "Captain I",
  "Captain II",
  "Captain III",
  "Commander",
  "Deputy Chief I",
  "Deputy Chief II",
  "Assistant Chief",
  "Chief of Police",
];

/** Division tam adı -> rapor kısaltması */
export const divisionProfileOptions: { label: string; value: string; code: string }[] = [
  {
    label: "Mission Row Area Patrol Division",
    value: "Mission Row Area Patrol Division",
    code: "MISN",
  },
  {
    label: "Mission Row Area Detective Division",
    value: "Mission Row Area Detective Division",
    code: "MISN B",
  },
  { label: "Central Traffic Division", value: "Central Traffic Division", code: "CTD" },
  { label: "Metropolitan Division", value: "Metropolitan Division", code: "METRO" },
  { label: "Air Support Division", value: "Air Support Division", code: "ASD" },
  { label: "Vespucci Area Patrol Division", value: "Vespucci Area Patrol Division", code: "VES" },
];

export function divisionCode(division: string): string {
  return divisionProfileOptions.find((d) => d.value === division)?.code ?? "";
}

export const OFFICER_PROFILE_KEY = "lspd-officer-profile";

export function loadOfficerProfile(): OfficerProfile | null {
  try {
    const raw = localStorage.getItem(OFFICER_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OfficerProfile>;
    if (!parsed || typeof parsed !== "object") return null;
    return { ...emptyOfficerProfile, ...parsed };
  } catch {
    return null;
  }
}

export function saveOfficerProfile(profile: OfficerProfile) {
  try {
    localStorage.setItem(OFFICER_PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("lspd-officer-profile-changed"));
  } catch {
    /* kota dolu olabilir */
  }
}

export function clearOfficerProfile() {
  try {
    localStorage.removeItem(OFFICER_PROFILE_KEY);
    window.dispatchEvent(new CustomEvent("lspd-officer-profile-changed"));
  } catch {
    /* yok sayılır */
  }
}

/* ---------------- Çoklu personel profili ---------------- */

export type StoredOfficerProfile = OfficerProfile & {
  id: string;
  /** Bu profilin bağlı olduğu UCP karakter kimliği (varsa) */
  characterId?: number | null;
};

export const OFFICER_PROFILES_KEY = "lspd-officer-profiles";
export const OFFICER_ACTIVE_PROFILE_KEY = "lspd-officer-active-profile";

function newId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function profileLabel(p: OfficerProfile, _index = 0): string {
  const name = p.name?.trim();
  if (name) return name;
  const serial = p.serialNo?.trim();
  return serial ? `#${serial}` : "İsimsiz Personel";
}

export type OfficerProfileStore = {
  profiles: StoredOfficerProfile[];
  activeId: string;
};

export function loadOfficerProfiles(): OfficerProfileStore {
  try {
    const raw = localStorage.getItem(OFFICER_PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredOfficerProfile[];
      if (Array.isArray(parsed) && parsed.length) {
        const profiles = parsed.map((p) => ({ ...emptyOfficerProfile, ...p, id: p.id || newId() }));
        const stored = localStorage.getItem(OFFICER_ACTIVE_PROFILE_KEY) || "";
        const activeId = profiles.some((p) => p.id === stored) ? stored : profiles[0]!.id;
        return { profiles, activeId };
      }
    }
  } catch {
    /* bozuk veri */
  }

  // Eski tekil profili taşı
  const legacy = loadOfficerProfile();
  const first: StoredOfficerProfile = { ...(legacy ?? emptyOfficerProfile), id: newId() };
  return { profiles: [first], activeId: first.id };
}

export function saveOfficerProfiles(store: OfficerProfileStore) {
  try {
    localStorage.setItem(OFFICER_PROFILES_KEY, JSON.stringify(store.profiles));
    localStorage.setItem(OFFICER_ACTIVE_PROFILE_KEY, store.activeId);
    const active = store.profiles.find((p) => p.id === store.activeId) ?? store.profiles[0];
    if (active) {
      const { id: _id, ...rest } = active;
      localStorage.setItem(OFFICER_PROFILE_KEY, JSON.stringify(rest));
    }
    window.dispatchEvent(new CustomEvent("lspd-officer-profile-changed"));
  } catch {
    /* kota dolu olabilir */
  }
}

export function createEmptyStoredProfile(): StoredOfficerProfile {
  return { ...emptyOfficerProfile, id: newId() };
}
