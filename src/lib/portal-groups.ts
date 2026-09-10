// Gruplara özel alanlar (izin anahtarları) — tek kaynak.
export type PortalGroupKey = "area_detective_division";

export type PortalGroup = {
  key: PortalGroupKey;
  label: string;
  shortLabel: string;
  description: string;
};

export const portalGroups: PortalGroup[] = [
  {
    key: "area_detective_division",
    label: "Area Detective Division",
    shortLabel: "ADD",
    description: "Area Detective Division'a özel rapor ve şablon alanı.",
  },
];

export function groupLabel(key: string): string {
  return portalGroups.find((g) => g.key === key)?.label ?? key;
}

/** Query ve Faction Management tüm gruplara erişebilir. */
export function hasGroupAccess(
  groups: string[] | undefined | null,
  adminLevel: string | null | undefined,
  key: PortalGroupKey,
): boolean {
  if (adminLevel === "query" || adminLevel === "faction_management") return true;
  return (groups ?? []).includes(key);
}
