export type OfficerProfile = {
  name: string;
  serialNo: string;
  rank: string;
  division: string; // tam isim, örn: "Mission Row Area Patrol Division"
};

export const emptyOfficerProfile: OfficerProfile = {
  name: "",
  serialNo: "",
  rank: "",
  division: "",
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
