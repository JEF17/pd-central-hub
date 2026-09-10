// Gruplara özel alanlar (izin anahtarları) — tek kaynak.
export type PortalGroupKey =
  | "area_detective_division"
  | "metropolitan_division"
  | "central_traffic_division"
  | "central_homicide_bureau"
  | "supervisory_staff";

export type PortalGroup = {
  key: PortalGroupKey;
  label: string;
  shortLabel: string;
  description: string;
  to: string;
};

export const portalGroups: PortalGroup[] = [
  {
    key: "area_detective_division",
    label: "Detective Portal",
    shortLabel: "DP",
    description: "Dedektif birimlerine özel rapor ve şablon alanı.",
    to: "/detective-portal",
  },
  {
    key: "metropolitan_division",
    label: "Metropolitan Division",
    shortLabel: "METRO",
    description: "Metropolitan Division'a özel rapor ve şablon alanı.",
    to: "/metropolitan-division",
  },
  {
    key: "central_traffic_division",
    label: "Central Traffic Division",
    shortLabel: "CTD",
    description: "Central Traffic Division'a özel rapor ve şablon alanı.",
    to: "/central-traffic-division",
  },

  {
    key: "supervisory_staff",
    label: "Supervisory Staff",
    shortLabel: "SUP",
    description: "Supervisory Staff'a özel rapor ve şablon alanı.",
    to: "/supervisory-staff",
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
