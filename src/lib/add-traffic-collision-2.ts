/** Central Traffic Division — Factual Diagram (SAHP 555 Page 2). */

export interface TrafficCollisionPage2Data {
  date: string;
  time: string;
  incidentReportNo: string;

  officer: string;
  serialNo: string;
  division: string;
  /** Rapor No. son üç hane: TC — 26-000 */
  titleNo: string;

  diagramUrl: string;
}

export const emptyTrafficCollisionPage2 = (): TrafficCollisionPage2Data => ({
  date: "",
  time: "",
  incidentReportNo: "",
  officer: "",
  serialNo: "",
  division: "CTD",
  titleNo: "",
  diagramUrl: "",
});

/** Rapor No.: TC — 26-000 */
export function buildCollisionPage2ReportNo(d: TrafficCollisionPage2Data): string {
  return `TC — 26-${d.titleNo.trim() || "000"}`;
}

const v = (s: string, fallback = "—") => (s.trim() ? s.trim() : fallback);

export function buildTrafficCollisionPage2BBCode(d: TrafficCollisionPage2Data): string {
  return `[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,15,10]
[left]STATE OF SAN ANDREAS
[b][size=130]FACTUAL DIAGRAM[/size][/b][/left]
[/tdwidth][/table]


[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,0,0]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
${v(d.date)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SAAT (2400)
${v(d.time)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]OLAY RAPORU NO.
${v(d.incidentReportNo)}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]PERSONEL ADI SOYADI
${v(d.officer)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${v(d.serialNo)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${v(d.division)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]RAPOR NO.
${buildCollisionPage2ReportNo(d)}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]TÜM ÇİZİMLER YAKLAŞIK OLARAK HESAPLANMIŞTIR VE AKSİ BELİRTİLMEDİKÇE ÖLÇEKLİ DEĞİLDİR

[center][img]${d.diagramUrl.trim()}[/img][/center]













[/indent][/size][/tdwidth][/table]`;
}
