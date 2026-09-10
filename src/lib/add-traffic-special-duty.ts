/** Central Traffic Division — Trafik Özel Görevlendirme Raporu (22.10.33). */

export interface DutyNarrativeItem {
  /** Örn. A: 2235 */
  tag: string;
  text: string;
}

export interface TrafficSpecialDutyData {
  /** Rapor No. son dört hane: TÖGR 26-0000 */
  titleNo: string;

  officerName: string;
  position: string;
  assignment: string;
  division: string;
  date: string;

  /** Görevlendirme türü seçimleri (A–F). */
  dutyTypes: Record<string, boolean>;

  /** AÇIKLAMA maddeleri */
  narratives: DutyNarrativeItem[];

  adminOfficer: string;
  adminSerialNo: string;
  adminDivision: string;

  supervisorName: string;
  supervisorSerialNo: string;
  supervisorDivision: string;

  watchCommanderName: string;
  watchCommanderSerialNo: string;
  watchCommanderDivision: string;
}

export const dutyTypeOptions: { key: string; label: string }[] = [
  { key: "A", label: "Unmarked Traffic Enforcement" },
  { key: "B", label: "Basic & Motorcycle Traffic Enforcement" },
  { key: "C", label: "DUI Testi" },
  { key: "D", label: "Yaya Geçidi Operasyonu" },
  { key: "E", label: "Yol & Trafik Kontrolü ve Barikatlama" },
  { key: "F", label: "Özel Görevlendirme & Diğer" },
];

export const emptyDutyNarrative = (): DutyNarrativeItem => ({ tag: "", text: "" });

export const emptyTrafficSpecialDuty = (): TrafficSpecialDutyData => ({
  titleNo: "",
  officerName: "",
  position: "",
  assignment: "",
  division: "CTD",
  date: "",
  dutyTypes: {},
  narratives: [emptyDutyNarrative()],
  adminOfficer: "",
  adminSerialNo: "",
  adminDivision: "CTD",
  supervisorName: "",
  supervisorSerialNo: "",
  supervisorDivision: "CTD",
  watchCommanderName: "",
  watchCommanderSerialNo: "",
  watchCommanderDivision: "CTD",
});

const v = (s: string, fallback = "") => (s.trim() ? s.trim() : fallback);
const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");

export function buildTrafficSpecialDutyBBCode(d: TrafficSpecialDutyData): string {
  const dutyTypes = dutyTypeOptions
    .map((o) => `${cb(!!d.dutyTypes[o.key])} (${o.key}) ${o.label}   `)
    .join("\n");

  const narratives = d.narratives
    .filter((n) => n.tag.trim() || n.text.trim())
    .map((n) => {
      const tag = n.tag.trim() ? `[b]${n.tag.trim()} —[/b]` : "";
      return [tag, n.text.trim()].filter(Boolean).join(" ");
    })
    .join("\n\n");

  return `[left][size=105]LOS SANTOS POLICE DEPARTMENT
[b]TRAFİK ÖZEL GÖREVLENDİRME RAPORU[/b][/size][/left]
[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][size=85]22.10.33 (2/26)
[/tdwidth][/table][/tr]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]TEMEL BİLGİLER[/b]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]PERSONEL ADI SOYADI[/b]
${v(d.officerName, "ADI SOYADI")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]POZİSYON[/b]
${v(d.position, "X")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]GÖREVLENDİRME[/b]
${v(d.assignment, "E")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]DIVISION[/b]
${v(d.division, "CTD")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]TARİH[/b]
${v(d.date, "GG/AA/YYYY")}[/indent][/size][/tdwidth]
[/table]


[/tdwidth]
[/table]

[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][b]DETAYLAR[/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]GÖREVLENDİRME TÜRÜ[/b][/size]
[size=85]${dutyTypes}
[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85]AÇIKLAMA
${narratives || "[b]A: 2235 —[/b] "}



[/size][/tdwidth][/table][/tr]
[/tdwidth][/table][/tr]

[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][b]İDARİ BİLGİLER[/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]PERSONEL BİLGİSİ[/b]
${v(d.adminOfficer, "A. SOYADI")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]SERİ NO.[/b]
${v(d.adminSerialNo, "00000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]DIVISION[/b]
${v(d.adminDivision, "CTD")}[/indent][/size][/tdwidth]
[tdwidth=#ffffff,#ffffff,top,left,1,1][/tdwidth]
[/table]

[/tdwidth][/table][/tr]`;
}
