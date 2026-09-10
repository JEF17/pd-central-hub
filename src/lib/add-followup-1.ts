/** Area Detective Division — Takip Soruşturma Formu 1 (BBCode). */

export const followupCaseTypes = [
  { key: "homicide", label: "Homicide", code: "HI" },
  { key: "caps", label: "CAPS", code: "CAPS" },
  { key: "robbery", label: "Robbery", code: "RB" },
  { key: "burglary", label: "Burglary", code: "BG" },
  { key: "autos", label: "Autos", code: "AU" },
] as const;

export type FollowupCaseTypeKey = (typeof followupCaseTypes)[number]["key"];

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

export const caseFactorOptions = [
  "ŞÜPHELİ veya ARAÇ GÖRÜLMEDİ",
  "PARMAK İZİ veya DELİL BULUNMUYOR",
  "$5.000'dan DAHA AZ DEĞERDE MAL KAYBI",
  "CİDDİ YARALANMA BULUNMUYOR",
  "SADECE BİR MAĞDUR BULUNUYOR",
];

export const otherFactorOptions = [
  "GÜÇ KULLANIMI",
  "ATEŞ EDİLDİ",
  "NARKOTİK — ÇALINTI",
  "ATEŞLİ SİLAH — ÇALINTI",
  "GND/GIT",
];

export const propertyTypeOptions = ["Çalıntı", "Kayıp", "Hasarlı", "Hiçbiri"];

export interface FollowupVictim {
  name: string;
  gender: string;
  ethnicity: string;
  age: string;
  address: string;
  contact: string;
}

export const emptyVictim = (): FollowupVictim => ({
  name: "",
  gender: "",
  ethnicity: "",
  age: "",
  address: "",
  contact: "",
});

export interface Followup1Data {
  caseType: FollowupCaseTypeKey | "";
  titleNo: string;
  titleDate: string;

  incidentReportNo: string;
  investigationReportNo: string;
  incidentTypes: string[];

  victims: FollowupVictim[];

  location: string;
  occurredAt: string;
  reportedAt: string;
  propertyType: string;
  lossAmount: string;
  recoveredAmount: string;

  description: string;
  summary: string;
  investigation: string;
  evidences: Evidence[];
  caseFactors: string[];
  otherFactors: string[];

  officerName: string;
  officerSerial: string;
  officerDivision: string;
  officerDateTime: string;
  supervisorName: string;
  supervisorSerial: string;
  supervisorDivision: string;
  supervisorDateTime: string;
}

/** Kanıt: görünen ad + bağlantı. Bağlantı varsa BBCode'da [url=...]Ad[/url] olur. */
export interface Evidence {
  label: string;
  url: string;
}

export const emptyEvidence = (): Evidence => ({ label: "", url: "" });

/** Eski taslaklarda kanıtlar düz metindi; yeni yapıya çevirir. */
export const asEvidence = (e: Evidence | string): Evidence =>
  typeof e === "string" ? { label: e, url: "" } : e;

export const emptyFollowup1 = (): Followup1Data => ({
  caseType: "",
  titleNo: "",
  titleDate: "",
  incidentReportNo: "",
  investigationReportNo: "",
  incidentTypes: [],
  victims: [emptyVictim()],
  location: "",
  occurredAt: "",
  reportedAt: "",
  propertyType: "",
  lossAmount: "",
  recoveredAmount: "",
  description: "",
  summary: "",
  investigation: "",
  evidences: [emptyEvidence()],
  caseFactors: [],
  otherFactors: [],
  officerName: "",
  officerSerial: "",
  officerDivision: "",
  officerDateTime: "",
  supervisorName: "",
  supervisorSerial: "",
  supervisorDivision: "",
  supervisorDateTime: "",
});

const v = (s: string, fallback = "X") => (s.trim() ? s.trim() : fallback);

/** Olay özeti + soruşturma + kanıtlar tek detay bloğu olarak birleşir. */
export function buildDetailsBlock(
  summary: string,
  investigation: string,
  evidences: (Evidence | string)[],
  emptyFallback = "BURAYA",
): string {
  const parts: string[] = [];
  if (summary.trim()) parts.push(`[b]OLAY ÖZETİ[/b]\n${summary.trim()}`);
  if (investigation.trim()) parts.push(`[b]SORUŞTURMA[/b]\n${investigation.trim()}`);
  const ev = evidences
    .map(asEvidence)
    .map((e) => {
      const label = e.label.trim();
      const url = e.url.trim();
      if (label && url) return `[url=${url}]${label}[/url]`;
      return label || url;
    })
    .filter(Boolean);
  if (ev.length) parts.push(`[b]KANITLAR[/b]\n${ev.map((e) => `- ${e}`).join("\n")}`);
  return parts.length ? parts.join("\n\n") : emptyFallback;
}

/** Örn: 02-HI 0000 - GG/AA/YYYY */
export function buildFollowup1Title(data: Followup1Data): string {
  const type = followupCaseTypes.find((t) => t.key === data.caseType);
  const code = type?.code ?? "XX";
  const no = data.titleNo.trim() || "0000";
  return `02-${code} ${no} - ${v(data.titleDate, "GG/AA/YYYY")}`;
}

const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");

function victimBlock(vic: FollowupVictim): string {
  return `[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,10,1][size=85][indent=2][b]MAĞDUR BİLGİSİ[/b][/size]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]AD SOYADI (ya da İŞLETME ADI)
[color=#FFFFFF]${v(vic.name)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]CİNSİYET
[color=#FFFFFF]${v(vic.gender)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]ETNİK GRUP
[color=#FFFFFF]${v(vic.ethnicity)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]YAŞ
[color=#FFFFFF]${v(vic.age)}[/color][/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]ADRES
[color=#FFFFFF]${v(vic.address)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]İLETİŞİM BİLGİSİ
[color=#FFFFFF]${v(vic.contact)}[/color][/indent][/size][/tdwidth][/table][/tdwidth][/table]`;
}

export function buildFollowup1BBCode(data: Followup1Data): string {
  const victims = data.victims?.length ? data.victims : [emptyVictim()];
  const victimBlocks = victims.map(victimBlock).join("\n\n");

  const incident = incidentTypeOptions
    .map((o) => `${cb(data.incidentTypes.includes(o))} ${o}`)
    .join("[color=#FFFFFF]___[/color]");

  const factors = caseFactorOptions
    .map((o, i) => `${i === 0 ? "[list]" : ""}[*]${cb(data.caseFactors.includes(o))} ${o}`)
    .join("\n");

  const others = otherFactorOptions
    .map((o, i) => `${i === 0 ? "[list]" : ""}[*]${cb(data.otherFactors.includes(o))} ${o}`)
    .join("\n");

  return `[size=95]LOS SANTOS POLICE DEPARTMENT[/size]
[b][size=125]SORUŞTURMA RAPORU[/size][/b]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,10,1][size=85][indent=2][b]OLAY BİLGİSİ[/b][/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]OLAY RAPORU NO.
[color=#000000]${v(data.incidentReportNo)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SORUŞTURMA RAPOR NO.
[color=#000000]${v(data.investigationReportNo)}[/color][/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][indent=2]OLAY TÜRÜ[/size]
[size=85]${incident}[/tdwidth][/size]
[/table]
[/tdwidth][/table]

${victimBlocks}

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,10,1][size=85][indent=2][b]VAKA BİLGİSİ[/b][/size]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]KONUM BİLGİSİ
[color=#FFFFFF]${v(data.location)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]MEYDANA GELME TARİHİ
[color=#FFFFFF]${v(data.occurredAt, "GG/AA/YYYY")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]BİLDİRİLME TARİHİ
[color=#FFFFFF]${v(data.reportedAt, "GG/AA/YYYY")}[/color][/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]ÇALINTI/KAYIP/HASARLI MÜLK TÜRÜ
[color=#FFFFFF]${v(data.propertyType)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]ÇALINTI/KAYIP
[b]$${v(data.lossAmount, "0")}[/b][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]GERİ ALINAN
[b]$${v(data.recoveredAmount, "0")}[/b][/indent][/size][/tdwidth]
[/table][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,10,1][size=85][indent=2][b]DETAYLAR[/b][/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]
[b]AÇIKLAMA[/b] 
${buildDetailsBlock(data.summary, data.investigation, data.evidences, "BURAYA")}









[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2][b]VAKA FAKTÖRLERİ[/b]
${factors}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2][b]DİĞER[/b]
${others}
[/indent][/size][/tdwidth]
[/table][/tdwidth][/table]


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
