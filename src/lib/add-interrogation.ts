/** Area Detective Division — Sorgu Raporu Formu (BBCode). */

export const interrogationIncidentTypes = [
  "Araç Takibi",
  "Silahlı Saldırı",
  "Cinayet",
  "Çete Bağlantılı",
  "Narkotik",
  "Hırsızlık",
  "Trafik Kazası",
  "Diğer",
];

export const genderOptions = ["Erkek", "Kadın"];
export const mirandaOptions = ["Okundu & Anladı", "Hakkından Vazgeçti"];
export const legalRepOptions = ["Katıldı", "Katılmadı", "Hakkından Vazgeçti"];

export interface InterrogationData {
  /** Başlık: SR — GG/AA/YYYY — 00000 (ADI SOYADI) */
  titleDate: string;
  titleSerial: string;
  titleName: string;

  officerName: string;
  officerSerial: string;
  officerDivision: string;
  officerAssignment: string;
  officerDate: string;

  suspectName: string;
  suspectGender: string;
  location: string;
  interrogationDateTime: string;
  contactInfo: string;
  residenceAddress: string;

  miranda: string[];
  legalRep: string[];

  incidentTypes: string[];
  details: string;
  evidenceLog: string;

  supervisorName: string;
  supervisorSerial: string;
  commandingOfficerName: string;
  commandingOfficerSerial: string;
}

export const emptyInterrogation = (): InterrogationData => ({
  titleDate: "",
  titleSerial: "",
  titleName: "",
  officerName: "",
  officerSerial: "",
  officerDivision: "",
  officerAssignment: "",
  officerDate: "",
  suspectName: "",
  suspectGender: "",
  location: "",
  interrogationDateTime: "",
  contactInfo: "",
  residenceAddress: "",
  miranda: [],
  legalRep: [],
  incidentTypes: [],
  details: "",
  evidenceLog: "",
  supervisorName: "",
  supervisorSerial: "",
  commandingOfficerName: "",
  commandingOfficerSerial: "",
});

const v = (s: string, fallback = "X") => (s.trim() ? s.trim() : fallback);
const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");

/** Başlık: SR — GG/AA/YYYY — 00000 (ADI SOYADI) */
export function buildInterrogationTitle(d: InterrogationData): string {
  const date = v(d.titleDate, "GG/AA/YYYY");
  const serial = v(d.titleSerial, "00000");
  const name = d.titleName.trim() ? d.titleName.trim().toUpperCase() : "ADI SOYADI";
  return `SR — ${date} — ${serial} (${name})`;
}

export function buildInterrogationBBCode(data: InterrogationData): string {
  const gender = genderOptions
    .map((o) => `${cb(data.suspectGender === o)} ${o}`)
    .join("[color=#FFFFFF]___[/color]");

  const miranda = mirandaOptions.map((o) => `${cb(data.miranda.includes(o))} ${o}`).join("\n");
  const legalRep = legalRepOptions.map((o) => `${cb(data.legalRep.includes(o))} ${o}`).join("\n");

  const incident = interrogationIncidentTypes
    .map((o) => `${cb(data.incidentTypes.includes(o))} ${o}`)
    .join("[color=#FFFFFF]___[/color]");

  return `[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][/tdwidth]
[tdwidth=#ffffff,#ffffff,top,left,12,1]
[center][size=125]LOS SANTOS POLICE DEPARTMENT
[b]SORGU RAPORU FORMU[/b][/size][/center][/tdwidth]
[tdwidth=#ffffff,#ffffff,top,left,2,1][size=85][indent=2][b]RAPOR NO.[/b]
SR 25-0000[/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,3,1][size=95][indent=2][b]SORGUYU ALAN PERSONEL[/b][/indent][/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]ADI SOYADI
${v(data.officerName)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${v(data.officerSerial, "00000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${v(data.officerDivision)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]GÖREVLENDİRME
${v(data.officerAssignment, "BURAYA")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
${v(data.officerDate, "GG/AA/YYYY")}[/indent][/size][/tdwidth][/table]
[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,3,1][size=95][indent=2][b]SORGU BİLGİLERİ[/b][/indent][/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]SORGUSU ALINANIN ADI VE SOYADI
${v(data.suspectName)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SORGUSU ALINANIN CİNSİYETİ[/size]
[size=85]${gender}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SORGU ALINAN KONUM
${v(data.location)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SORGU TARİHİ
${v(data.interrogationDateTime, "GG/AA/YYYY — HHmm")}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]İLETİŞİM BİLGİSİ
${v(data.contactInfo, "BURAYA")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]İKAMETGAH ADRESİ
${v(data.residenceAddress, "BURAYA")}[/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]MIRANDA TAVSİYELERİ
[size=85]${miranda}[/indent][/size][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]YASAL TEMSİLCİ
[size=85]${legalRep}[/indent][/size][/size][/tdwidth][/table]

[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,3,1][size=95][indent=2][b]DETAYLAR[/b][/indent][/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][indent=2]OLAY TÜRÜ[/size]
[size=85]${incident}[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]AÇIKLAMA
${v(data.details, "BURAYA")}

[color=#FFFFFF](( Sorguyu özetleyerek anlatın ve önemli noktalara değinin. Üçüncül bakış açısıyla açıklayın. ))[/color]

[/indent][/size][/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]KANITLAR
[altspoiler2=SORGU KAYITLARI]
[quote]${v(data.evidenceLog, "Chatlog halinde buraya yerleştirin ve saat bilgisi içersin.")}

[/quote]
[/altspoiler2]

[/indent][/size][/tdwidth][/table]

[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]İDARİ BİLGİLER[/b]

[table=#ffffff,white][tr]
[tdwidth=#d0dade,#ffffff,middle,left,4,1][size=85][indent=2]CASE SUPERVISOR İMZASI
[color=#000000]${v(data.supervisorName, "A. SOYADI")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2]SERİ NO.
[color=#000000]${v(data.supervisorSerial, "00000")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,4,1][size=85][indent=2]DETECTIVE COMMANDING OFFICER İMZASI
[color=#000000]${v(data.commandingOfficerName, "A. SOYADI")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2]SERİ NO.
[color=#000000]${v(data.commandingOfficerSerial, "00000")}[/color][/indent][/size][/tdwidth][/table]

[/tdwidth][/table]

[left][size=75]Form 03.14.00[/size][/left]`;
}
