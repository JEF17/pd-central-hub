/** Area Detective Division — Takip Soruşturma Formu 2 (BBCode). */

export const incidentTypeOptions = [
  "Araç Takibi",
  "Silahlı Saldırı",
  "Cinayet",
  "Çete Bağlantılı",
  "Narkotik",
  "Hırsızlık",
  "Trafik Kazası",
  "Diğer",
];

export const fileStatusOptions = [
  "Sonuçlandı (Tutuklama)",
  "Sonuçlandı (Diğer)",
  "Soruşturma Devam Ediyor",
];

export interface Followup2Data {
  incidentReportNo: string;
  investigationReportNo: string;
  incidentTypes: string[];

  fileStatuses: string[];
  summary: string;
  investigation: string;
  evidences: Evidence[];

  officerName: string;
  officerSerial: string;
  officerDivision: string;
  officerDateTime: string;
  supervisorName: string;
  supervisorSerial: string;
  supervisorDivision: string;
  supervisorDateTime: string;
}

export const emptyFollowup2 = (): Followup2Data => ({
  incidentReportNo: "",
  investigationReportNo: "",
  incidentTypes: [],
  fileStatuses: [],
  summary: "",
  investigation: "",
  evidences: [emptyEvidence()],
  officerName: "",
  officerSerial: "",
  officerDivision: "",
  officerDateTime: "",
  supervisorName: "",
  supervisorSerial: "",
  supervisorDivision: "",
  supervisorDateTime: "",
});

import { buildDetailsBlock, emptyEvidence, type Evidence } from "./add-followup-1";

const v = (s: string, fallback = "X") => (s.trim() ? s.trim() : fallback);
const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");

export function buildFollowup2BBCode(data: Followup2Data): string {
  const incident = incidentTypeOptions
    .map((o) => `${cb(data.incidentTypes.includes(o))} ${o}`)
    .join("[color=#FFFFFF]___[/color]");

  const statuses = fileStatusOptions
    .map((o) => `${cb(data.fileStatuses.includes(o))} ${o}`)
    .join("[color=#FFFFFF]___[/color]");

  return `[size=95]LOS SANTOS POLICE DEPARTMENT[/size]
[b][size=125]TAKİP SORUŞTURMASI[/size][/b]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,10,1][size=85][indent=2][b]OLAY BİLGİSİ[/b][/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]OLAY RAPORU NO.
[color=#FFFFFF]${v(data.incidentReportNo)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SORUŞTURMA RAPOR NO.
[color=#000000]${v(data.investigationReportNo)}[/color][/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][indent=2]OLAY TÜRÜ[/size]
[size=85]${incident}[/tdwidth][/size]
[/table]
[/tdwidth][/table]



[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,10,1][size=85][indent=2][b]DETAYLAR[/b][/size]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,8,1][size=85][indent=2]DOSYA DURUMU[/size]
[size=85]${statuses}[/tdwidth][/size][/table]


[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]Bu bölümü yalnızca bilgi eklemek veya bir bilginin düzeltilmesi için kullanın. Önceki raporlarda bulunan bilgileri tekrarlamayın.[/b][/tdwidth][/size][/indent][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DETAYLAR
${buildDetailsBlock(data.summary, data.investigation, data.evidences, "Değiştirilen veya eklenen bilgileri burada açıklayın.")}





[/size][/indent][/tdwidth][/table]
[/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,10,1][size=85][indent=2][b]İDARİ BİLGİLER[/b][/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]PERSONEL BİLGİSİ
[color=#FFFFFF]${v(data.officerName)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
[color=#FFFFFF]${v(data.officerSerial)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
[color=#FFFFFF]${v(data.officerDivision)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH ve SAAT
[color=#FFFFFF]${v(data.officerDateTime)}[/color][/size][/indent][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SUPERVISOR BİLGİSİ
[color=#FFFFFF]${v(data.supervisorName)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
[color=#FFFFFF]${v(data.supervisorSerial)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
[color=#FFFFFF]${v(data.supervisorDivision)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH ve SAAT
[color=#FFFFFF]${v(data.supervisorDateTime)}[/color][/size][/indent][/tdwidth][/table][/tdwidth][/table]`;
}
