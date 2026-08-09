import { assignmentOptions, divisionOptions } from "./incident-report";

export { assignmentOptions, divisionOptions };

export interface FiCardData {
  personName: string;
  nickname: string;
  gender: "male" | "female" | "";
  address: string;
  contact: string;
  personInfo: string[];
  extraInfo: string;
  date: string;
  time: string;
  location: string;
  officerName: string;
  serialNo: string;
  officer2Name: string;
  serial2No: string;
  division: string;
  assignment: string;
}

export const personInfoOptions = [
  "Mağdur",
  "Tanık",
  "Evsiz",
  "Çete Aktivitesi",
  "Şartlı Tahliyede",
  "Denetimli Serbestlik",
  "Sicil Kaydı Bulunuyor",
];

export const emptyFiCard = (): FiCardData => ({
  personName: "",
  nickname: "",
  gender: "",
  address: "",
  contact: "",
  personInfo: [],
  extraInfo: "",
  date: "",
  time: "",
  location: "",
  officerName: "",
  serialNo: "",
  officer2Name: "",
  serial2No: "",
  division: "",
  assignment: "",
});

const SEP = "[color=#FFFFFF]___[/color]";
const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");
const val = (v: string, fallback = "—") => (v.trim() ? v.trim() : fallback);

/** Konu başlığı: "AD SOYAD - 00/00/0000" */
export function buildFiCardTitle(data: FiCardData) {
  return `${val(data.personName, "AD SOYAD").toUpperCase()} - ${val(data.date, "GG/AA/YYYY")}`;
}

export function buildFiCardBBCode(data: FiCardData) {
  const infoLine = personInfoOptions
    .map((o) => `${cb(data.personInfo.includes(o))} ${o}`)
    .join(` ${SEP}`);

  return `[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]ADI SOYADI
${val(data.personName, "JOHN DOE")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]TAKMA ADI
${val(data.nickname)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]CİNSİYET
${cb(data.gender === "male")} Erkek${SEP}${cb(data.gender === "female")} Kadın[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,6,1][size=85][indent=2]ADRES BİLGİSİ
${val(data.address)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]İLETİŞİM BİLGİSİ
${val(data.contact)}[/indent][/size][/tdwidth]
[/table]


[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]KİŞİ BİLGİSİ
${infoLine}[/indent][/size]
[/tdwidth][/table]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,7,1][size=85][indent=2][b][center]EK BİLGİ: ELEKTRONİK POSTA ADRESİ, SOSYAL MEDYA HESAPLARI, DİĞER KİŞİLER[/center][/b][/indent][/size][/tdwidth][/table]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][indent=2]${val(data.extraInfo, "BU KISMI DOLDURUN")}
[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]TARİH
${val(data.date, "GG/AA/YYYY")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SAAT
${val(data.time, "0000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]KONUM
${val(data.location)}[/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]MEMUR
${val(data.officerName, "JOHN DOE")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${val(data.serialNo, "00000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]MEMUR
${val(data.officer2Name, "JOHN DOE")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${val(data.serial2No, "00000")}[/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]FIELD INTERVIEW[/b]
15.43.00 (06/25)[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]DIVISION
${val(data.division)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]GÖREVLENDİRME
${val(data.assignment)}[/indent][/size][/tdwidth]
[/table]`;
}
