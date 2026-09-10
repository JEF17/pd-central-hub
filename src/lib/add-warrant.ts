/** Area Detective Division — Warrant Hizmetleri / Tactical Operation Plan (BBCode). */

export const WARRANT_DIRECTIVE_URL = "https://lspd-tr.gta.world/viewtopic.php?t=2343";

export const warrantOpTypes = [
  { label: "Search Warrant", linkPlaceholder: "SW BAĞLANTISI" },
  { label: "Arrest Warrant", linkPlaceholder: "AW BAĞLANTISI" },
];

export const warrantRiskTypes = ["Düşük Risk", "Orta Risk", "Yüksek Riskli"];

export interface WarrantData {
  /** Başlık: TP — GG/AA/YYYY — 00000 */
  titleDate: string;
  titleSerial: string;

  /** Operasyon türü: "Search Warrant" | "Arrest Warrant" | "" */
  opType: string;
  /** Seçilen warrant türünün forum/bağlantı linki */
  opTypeLink: string;
  opNo: string;

  briefingLocation: string;
  dateTime: string;
  radioFrequency: string;

  incidentSummary: string;
  operationPlan: string;
  other: string;

  /** Detaylar bölümündeki görsel bağlantısı */
  detailImage: string;
  riskType: string;
  /** Operasyon konumları (madde listesi) */
  locations: string[];
  propertyPhotoLink: string;
  /** Diğer fotoğraf bağlantıları */
  photoLinks: string[];

  officerName: string;
  officerSerial: string;
  officerDivision: string;
  officerAssignment: string;
  officerDate: string;

  supervisorName: string;
  supervisorSerial: string;
  supervisorDivision: string;
  supervisorAssignment: string;
  supervisorDate: string;

  commandingOfficerName: string;
  commandingOfficerSerial: string;
  commandingOfficerDivision: string;
  commandingOfficerDate: string;
}

export const emptyWarrant = (): WarrantData => ({
  titleDate: "",
  titleSerial: "",
  opType: "",
  opTypeLink: "",
  opNo: "",
  briefingLocation: "",
  dateTime: "",
  radioFrequency: "",
  incidentSummary: "",
  operationPlan: "",
  other: "",
  detailImage: "",
  riskType: "",
  locations: [""],
  propertyPhotoLink: "",
  photoLinks: [""],
  officerName: "",
  officerSerial: "",
  officerDivision: "",
  officerAssignment: "",
  officerDate: "",
  supervisorName: "",
  supervisorSerial: "",
  supervisorDivision: "",
  supervisorAssignment: "",
  supervisorDate: "",
  commandingOfficerName: "",
  commandingOfficerSerial: "",
  commandingOfficerDivision: "",
  commandingOfficerDate: "",
});

const v = (s: string, fallback = "X") => (s.trim() ? s.trim() : fallback);
const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");

/** Başlık: TP — GG/AA/YYYY — 00000 */
export function buildWarrantTitle(d: WarrantData): string {
  const date = v(d.titleDate, "GG/AA/YYYY");
  const serial = v(d.titleSerial, "00000");
  return `TP — ${date} — ${serial}`;
}

export function buildWarrantBBCode(data: WarrantData): string {
  const opTypes = warrantOpTypes
    .map((o) => {
      const link =
        data.opType === o.label && data.opTypeLink.trim()
          ? data.opTypeLink.trim()
          : o.linkPlaceholder;
      return `${cb(data.opType === o.label)} [url=${link}]${o.label}[/url]`;
    })
    .join("[color=#FFFFFF]___[/color]");

  const risk = warrantRiskTypes.map((o) => `${cb(data.riskType === o)} ${o}`).join("\n");

  const locations = data.locations
    .map((l) => `[*]${v(l)}`)
    .join("\n");

  const photos = [
    `[*] [url=${v(data.propertyPhotoLink, "BAĞLANTI")}]Mülk Fotoğrafı[/url]`,
    ...data.photoLinks
      .filter((l) => l.trim())
      .map((l) => `[*] [url=${l.trim()}]Diğer Fotoğraflar[/url]`),
  ].join("\n");

  return `[divbox2=white][left][size=95]LOS SANTOS POLICE DEPARTMENT[/size]
[b][size=125]TACTICAL OPERATION PLAN[/size][/b]
FORM 12.25.00[/left]




[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]TEMEL BİLGİLER[/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,6,1][size=85][indent=2]OPERASYON TÜRÜ
${opTypes}[/tdwidth][/size]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]OP NO.
[color=#000000]${v(data.opNo)}[/color][/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,2][size=85][indent=2]BRIEFING KONUMU
[color=#000000]${v(data.briefingLocation)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,2][size=85][indent=2]TARİH VE SAAT
[color=#000000]${v(data.dateTime, "GG/AA/YY - SS/DD")}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,2][size=85][indent=2]TELSİZ FREKANSI
[color=#000000]${v(data.radioFrequency)}[/color][/size][/indent][/tdwidth][/table]

[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]DETAYLAR[/b]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][size=85][indent=2]
[center][img=${v(data.detailImage, "https://i.imgur.com/vYEQQ2x.png")}][/img][/center][/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]
[b]OLAY ÖZETİ[/b]
[size=95][color=#000000]${v(data.incidentSummary, "(( KISA BİR ŞEKİLDE SUÇTAN VE ŞÜPHELİDEN BAHSEDİN. KISA TUTMAYA ÇALIŞIN.))")}[/color][/size]

[b]OPERASYON PLANI[/b]
[size=95][color=#000000]${v(data.operationPlan, "(( OPERASYONUN NASIL GERÇEKLEŞECEĞİ HAKKINDA BİLGİ VERİLMELİ, GÖREVLENDİRMELERE DEĞİNİLMELİ VE GENEL OLARAK HANGİ NOKTALARIN DESTEKLENECEĞİ, KİMİN NEREDE YER ALACAĞI VEYA NE YAPACAĞI AÇIKLANMALI.))")}[/color][/size]

[b]DİĞER[/b]
[size=95][color=#000000]${v(data.other, "(( EKLEMEK İSTEDİĞİN DİĞER KONULARDAN BAHSEDEBİLİRSİNİZ. ÖRNEĞİN ŞÜPHELİ BİLGİLERİ, KAÇ ŞÜPHELİ VAR, BÖLGEDE ÇETE VAR MI GİBİ DETAYLAR.))")}[/color][/size]

[/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][url=${WARRANT_DIRECTIVE_URL}#p5184]RİSK TÜRÜ[/url]
${risk}
[/size][/tdwidth]

[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]OPERASYON KONUMU
[color=#FFFFFF][list=]
${locations}[/list][/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]FOTOĞRAFLAR
[list]
${photos}
[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]


[/tdwidth][/table]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]İDARİ BİLGİLER[/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]PERSONEL BİLGİSİ
[color=#000000]${v(data.officerName)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2]SERİ NO.
[color=#000000]${v(data.officerSerial, "00000")}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
[color=#000000]${v(data.officerDivision)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]GÖREVLENDİRME
[color=#000000]${v(data.officerAssignment)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
[color=#000000]${v(data.officerDate, "GG/AA/YYYY")}[/color][/size][/indent][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SUPERVISOR BİLGİSİ
[color=#000000]${v(data.supervisorName)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2]SERİ NO.
[color=#000000]${v(data.supervisorSerial, "00000")}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
[color=#000000]${v(data.supervisorDivision)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]GÖREVLENDİRME
[color=#000000]${v(data.supervisorAssignment)}[/color][/size][/indent][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
[color=#000000]${v(data.supervisorDate, "GG/AA/YYYY")}[/color][/size][/indent][/tdwidth][/table]

[table=#ffffff,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]COMMANDING OFFICER
[color=#000000]${v(data.commandingOfficerName, "A. SOYADI")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2]SERİ NO.
[color=#000000]${v(data.commandingOfficerSerial, "00000")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
[color=#000000]${v(data.commandingOfficerDivision)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
[color=#000000]${v(data.commandingOfficerDate, "GG/AA/YYYY")}[/color][/indent][/size][/tdwidth][/table]
[/tdwidth][/table]

[table=#d0dade,white][tr][tdwidth=#d0dade,white,right,left,1,1]
[size=75][indent=15]Bu form, Search ve Arrest Warrant uygulamaları için hazırlanmalı ve herhangi bir şekilde uygulanmadan 24 saat önce, supervisor personele ve Watch Command Office tarafına birer kopyası iletilmeli. Plan, operasyondan bir saat önce diğer personelin erişimine açılır. Aciliyetli warrant uygulamaları, oluşabilecek zorunluluklar nedeniyle 12 saat önceden iletilebilir.

[/indent][/size]
[/tdwidth][/tr][/table]





[left][size=75]12.25.00[/size][/left][/divbox2]`;
}
