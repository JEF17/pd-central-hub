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
  description: string;
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
  description: "",
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

/** Doldurulmuş değerler siyah, boş (yer tutucu) değerler beyaz görünür. */
const cv = (s: string, fallback = "X") =>
  s.trim() ? `[color=#000000]${s.trim()}[/color]` : `[color=#FFFFFF]${fallback}[/color]`;

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
${cv(data.incidentReportNo)}[/indent][/size][/tdwidth]
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
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]
${buildDetailsBlock(data.description, "", data.investigation, data.evidences, "Değiştirilen veya eklenen bilgileri burada açıklayın.")}





[/size][/indent][/tdwidth][/table]
[/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,10,1][size=85][indent=2][b]İDARİ BİLGİLER[/b][/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]PERSONEL BİLGİSİ
${cv(data.officerName)}[/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${cv(data.officerSerial)}[/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${cv(data.officerDivision)}[/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH ve SAAT
${cv(data.officerDateTime)}[/size][/indent][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SUPERVISOR BİLGİSİ
${cv(data.supervisorName)}[/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${cv(data.supervisorSerial)}[/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${cv(data.supervisorDivision)}[/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH ve SAAT
${cv(data.supervisorDateTime)}[/size][/indent][/tdwidth][/table][/tdwidth][/table]`;
}
