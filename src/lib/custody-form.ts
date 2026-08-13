import { assignmentOptions, divisionOptions } from "./incident-report";

export { assignmentOptions, divisionOptions };

export type BookingStatus = "felony" | "misdemeanor" | "none" | "";
export type MirandaStatus = "read" | "notread" | "waived" | "";

export interface CustodyFormData {
  suspectName: string;
  gender: string;
  origin: string;
  age: string;
  charges: string;
  custodyDate: string;
  custodyTime: string;
  officerName: string;
  serialNo: string;
  division: string;
  assignment: string;
  incidentReportNo: string;
  incidentReportUrl: string;
  description: string;
  discordName: string;
  forumName: string;
  booking: BookingStatus;
  miranda: MirandaStatus;
  fieldSupervisor: string;
  watchCommander: string;
}

export const genderOptions = ["E", "K"];

export const emptyCustodyForm = (): CustodyFormData => ({
  suspectName: "",
  gender: "",
  origin: "",
  age: "",
  charges: "",
  custodyDate: "",
  custodyTime: "",
  officerName: "",
  serialNo: "",
  division: "",
  assignment: "",
  incidentReportNo: "",
  incidentReportUrl: "",
  description: "",
  discordName: "",
  forumName: "",
  booking: "",
  miranda: "",
  fieldSupervisor: "",
  watchCommander: "",
});

const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");
const val = (v: string, fallback = "—") => (v.trim() ? v.trim() : fallback);

/** Konu başlığı: "GKF — 00/00/0000 (AD SOYAD)" */
export function buildCustodyFormTitle(data: CustodyFormData) {
  return `GKF — ${val(data.custodyDate, "GG/AA/YYYY")} (${val(data.suspectName, "ADI SOYADI").toUpperCase()})`;
}

export function buildCustodyFormBBCode(data: CustodyFormData) {
  const orNo = val(data.incidentReportNo, "OR-00000");
  const orCell = data.incidentReportUrl.trim()
    ? `[url=${data.incidentReportUrl.trim()}]${orNo}[/url]`
    : orNo;

  return `[center][size=125]LOS SANTOS POLICE DEPARTMENT
[b]GÖZALTI KAYIT FORMU[/b][/size]
[/center]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]ŞÜPHELİ ADI SOYADI
${val(data.suspectName, "JOHN DOE")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]CİNSİYETİ
${val(data.gender, "E/K")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]KÖKEN
${val(data.origin, "X")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]YAŞI
${val(data.age, "00")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SUÇLAMALAR
${val(data.charges, "000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]GÖZALTI TARİHİ
${val(data.custodyDate, "00/00/2025")} - ${val(data.custodyTime, "00:00")}[/indent][/size][/tdwidth][/tr][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]PERSONEL BİLGİSİ
${val(data.officerName, "JOHN DOE")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${val(data.serialNo, "00000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${val(data.division, "MISN")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]GÖREVLENDİRME
${val(data.assignment)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]OLAY RAPORU
${orCell}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,mid,left,5,1][size=85][indent=2]AÇIKLAMA
${val(data.description, "BURAYA")}

(( [i]Discord Adı: ${val(data.discordName, "BURAYA")}[/i] ))
(( [i]Forum Adı: ${val(data.forumName, "BURAYA")}[/i] ))
[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]BOOKING
[size=85]${cb(data.booking === "felony")} Felony 
${cb(data.booking === "misdemeanor")} Misdemeanor
${cb(data.booking === "none")} Yapılmadı[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]MIRANDA TAVSİYELERİ
[size=85]${cb(data.miranda === "read")} Okundu & Anladı
${cb(data.miranda === "notread")} Okunmadı
${cb(data.miranda === "waived")} Vazgeçti[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]FIELD SUPERVISOR İMZASI
${val(data.fieldSupervisor, "A. SOYADI")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]WATCH COMMANDER İMZASI
${val(data.watchCommander, "A. SOYADI")}[/indent][/size][/tdwidth][/table]



[size=85][i]Bu form doldurulduktan sonra aynı gün içerisinde bulunduğunuz division Watch Commander personeline ulaştırılmalıdır. Bir başkası adına dolduruluyorsa tutuklamayı gerçekleştiren personelin bilgileri açıklama kısmında belirtilmelidir.[/i][/size]












[left][size=75]04.22.17[/size][/left]`;
}
