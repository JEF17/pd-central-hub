/** Metropolitan Division — Günlük Aktivite Raporu (15.52.04 (12/25)). */

export interface MetroPersonnel {
  name: string;
  serialNo: string;
  rank: string;
}

export interface MetroNarrativeItem {
  /** Örn. B: 22:35 */
  tag: string;
  text: string;
}

export interface MetroDailyActivityData {
  callCode: string;
  date: string;
  day: string;
  unit: string;
  area: string;
  supervisor: string;

  personnel: MetroPersonnel[];

  felonyArrests: string;
  misdemeanorArrests: string;
  trafficStops: string;
  weaponsNarcotics: string;
  fiCards: string;
  citations: string;
  vehicleImpounds: string;
  apbWarrants: string;
  paroleProbation: string;
  pursuits: string;

  narratives: MetroNarrativeItem[];
}

export const emptyMetroPersonnel = (): MetroPersonnel => ({ name: "", serialNo: "", rank: "" });

export const emptyMetroNarrative = (): MetroNarrativeItem => ({ tag: "", text: "" });

export const emptyMetroDailyActivity = (): MetroDailyActivityData => ({
  callCode: "",
  date: "",
  day: "",
  unit: "—",
  area: "CITYWIDE",
  supervisor: "",
  personnel: [emptyMetroPersonnel()],
  felonyArrests: "0",
  misdemeanorArrests: "0",
  trafficStops: "0",
  weaponsNarcotics: "0",
  fiCards: "0",
  citations: "0",
  vehicleImpounds: "0",
  apbWarrants: "0",
  paroleProbation: "0",
  pursuits: "0",
  narratives: [emptyMetroNarrative()],
});

export function buildMetroDailyActivityTitle(d: MetroDailyActivityData): string {
  const names = d.personnel
    .filter((p) => p.name.trim())
    .map((p) => p.name.trim().toUpperCase())
    .join(", ");
  return `${v(d.callCode, "ÇAĞRIKODU")} - ${v(d.date, "00/00/0000")}${names ? ` (${names})` : ""}`;
}

const v = (s: string, fallback = "") => (s.trim() ? s.trim() : fallback);
const n = (s: string) => (s.trim() ? s.trim() : "0");

const personnelTable = (p: MetroPersonnel) => `[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]ADI SOYADI[/b]
${v(p.name, "—")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]SERİ NO.[/b]
${v(p.serialNo, "—")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]RÜTBE[/b]
${v(p.rank, "—")}[/indent][/size][/tdwidth]
[/table]`;

export function buildMetroDailyActivityBBCode(d: MetroDailyActivityData): string {
  const personnel = d.personnel
    .filter((p) => p.name.trim() || p.serialNo.trim() || p.rank.trim())
    .map(personnelTable)
    .join("\n\n\n");

  const narratives = d.narratives
    .filter((x) => x.tag.trim() || x.text.trim())
    .map((x) => `[*][b]${v(x.tag, "B:")} —[/b] ${v(x.text)}[br]`)
    .join("\n");

  const title = buildMetroDailyActivityTitle(d);

  return `[center][size=125]LOS SANTOS POLICE DEPARTMENT
[b]METROPOLITAN DIVISION GÜNLÜK AKTİVİTE RAPORU[/b][/size][/center]
[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][size=85][b]${title}[/b]
[/tdwidth][/table][/tr]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]TARİH[/b]
${v(d.date, "GG/AA/YYYY")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]GÜN[/b]
${v(d.day, "—")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]BİRİM[/b]
${v(d.unit, "—")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]AREA[/b]
${v(d.area, "CITYWIDE")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]ONAYLAYAN SUPERVISOR[/b]
${d.supervisor.trim() ? v(d.supervisor) : "[color=#FFFFFF]A. SOYADI[/color]"}[/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][size=85][b]PERSONEL BİLGİLERİ[/b]
[/tdwidth][/table][/tr]

${personnel || personnelTable(emptyMetroPersonnel())}

[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][size=85][b]AKTİVİTE BİLGİLERİ[/b]
[/tdwidth][/table][/tr]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]FELONY TUTUKLAMASI[/b]
${n(d.felonyArrests)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]MISD. TUTUKLAMASI[/b]
${n(d.misdemeanorArrests)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]TRAFİK DURDURMASI[/b]
${n(d.trafficStops)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]SİLAH & NARKOTİK[/b]
${n(d.weaponsNarcotics)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]FI KART[/b]
${n(d.fiCards)}[/indent][/size][/tdwidth]
[/table]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]İHLAL CEZASI[/b]
${n(d.citations)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]ARAÇ ÇEKİMİ[/b]
${n(d.vehicleImpounds)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]APB & WARRANT[/b]
${n(d.apbWarrants)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]PAROLE & PROBATION[/b]
${n(d.paroleProbation)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]ARAÇ & YAYA TAKİBİ[/b]
${n(d.pursuits)}[/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][size=85][b]AÇIKLAMA[/b]
[/tdwidth][/table][/tr]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][list]${narratives || "[*][b]B:  — —[/b]"}
[/size][/list][/tdwidth][/table][/tr]`;
}
