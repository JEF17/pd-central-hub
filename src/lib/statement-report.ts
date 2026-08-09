import { areaOptions, assignmentOptions, divisionOptions } from "./incident-report";

export { areaOptions, assignmentOptions, divisionOptions };

export interface StatementEvidence {
  id: string;
  label: string;
  url: string;
}

export interface StatementReportData {
  reportNo: string;
  officerName: string;
  serialNo: string;
  division: string;
  assignment: string;
  date: string;
  incidentTypes: string[];
  otherType: string;
  personName: string;
  personGender: "male" | "female" | "";
  statementLocation: string;
  statementDate: string;
  contact: string;
  address: string;
  details: string;
  evidence: StatementEvidence[];
  miranda: string[];
}

export const statementIncidentTypeOptions = [
  "Araç Takibi",
  "Silahlı Saldırı",
  "Cinayet",
  "Çete Bağlantılı",
  "Hırsızlık",
  "Trafik Kazası",
  "Darp",
  "Diğer",
];

export const mirandaOptions = [
  "Sessiz kalma hakkına sahipsiniz.",
  "Söyleyeceğiniz herhangi bir şey mahkeme sırasında aleyhinizde kullanılabilir veya kullanılacaktır.",
  "İfadeniz öncesinde veya sırasında bir avukatla konuşma ve sizinle birlikte bulunması hakkına sahipsiniz.",
  "Eğer bir avukat tutacak maddi durumunuz bulunmuyorsa istemeniz durumunda sizi ücretsiz olarak temsil edecek bir avukat atanacaktır.",
];

export const emptyStatementReport = (): StatementReportData => ({
  reportNo: "",
  officerName: "",
  serialNo: "",
  division: "",
  assignment: "",
  date: "",
  incidentTypes: [],
  otherType: "",
  personName: "",
  personGender: "",
  statementLocation: "",
  statementDate: "",
  contact: "",
  address: "",
  details: "",
  evidence: [
    { id: "e1", label: "", url: "" },
    { id: "e2", label: "", url: "" },
    { id: "e3", label: "", url: "" },
  ],
  miranda: [],
});

const SEP = "[color=#FFFFFF]___[/color]";
const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");
const val = (v: string, fallback = "—") => (v.trim() ? v.trim() : fallback);
const reportNumber = (value: string) => value.trim().replace(/^26-/, "");

/** Konu başlığı: "İR — 00/00/0000 - 00000" */
export function buildStatementTitle(data: StatementReportData) {
  return `İR — ${val(data.date, "GG/AA/YYYY")} - ${val(reportNumber(data.reportNo), "00000")}`;
}

export function buildStatementBBCode(data: StatementReportData) {
  const typeLine = statementIncidentTypeOptions
    .map((t) => {
      const checked = data.incidentTypes.includes(t);
      const label = t === "Diğer" && data.otherType.trim() ? `Diğer: ${data.otherType.trim()}` : t;
      return `${cb(checked)} ${label}`;
    })
    .join(SEP);

  const filledEvidence = data.evidence.filter((e) => e.label.trim() || e.url.trim());
  const evidenceItems = filledEvidence.length
    ? filledEvidence
        .map((e) => {
          const label = e.label.trim();
          const url = e.url.trim();
          if (url && label) return `[*] [url=${url}]${label}[/url]`;
          if (url) return `[*] [url]${url}[/url]`;
          return `[*] ${label}`;
        })
        .join("\n")
    : "[*][url=][/url]\n[*][url=][/url]\n[*][url=][/url]";

  const mirandaItems = mirandaOptions
    .map((m) => `[*] ${cb(data.miranda.includes(m))} ${m}`)
    .join("\n");

  return `[center][size=125]LOS SANTOS POLICE DEPARTMENT
[b]İFADE RAPORU [/b][/size][/center]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2][b]İFADEYİ ALAN[/b] 
${val(data.officerName, "JOHN DOE")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]SERİ NO.[/b]
${val(data.serialNo, "00000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]DIVISION[/b]
${val(data.division)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]GÖREVLENDİRME[/b]
${val(data.assignment)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]TARİH[/b]
${val(data.date, "GG/AA/YYYY")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]RAPOR NO.[/b]
${val(reportNumber(data.reportNo), "00000")}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][indent=2][b]OLAY TÜRÜ[/b][/size]
[size=85]${typeLine}[/tdwidth][/size][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2][b]İFADEYİ VERENİN ADI SOYADI[/b]
${val(data.personName, "JOHN DOE")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]İFADEYİ VERENİN CİNSİYETİ[/b][/size]
[size=85]${cb(data.personGender === "male")} Erkek${SEP}[/size][size=85]${cb(data.personGender === "female")} Kadın[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]İFADE ALINAN KONUM[/b]
${val(data.statementLocation)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][b]İFADE TARİHİ[/b]
${val(data.statementDate, "GG/AA/YYYY")}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]İLETİŞİM BİLGİSİ[/b]
${val(data.contact)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]İKAMETGAH ADRESİ[/b]
${val(data.address)}[/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]DETAYLAR[/b]
${val(data.details, "BU KISMI DOLDURUN")}




[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]KANITLAR[/b]
[list]
${evidenceItems}
[/list][/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][b]MİRANDA BİLGİLENDİRMESİ[/b][/size][size=85][list]
${mirandaItems}
[/list][/tdwidth][/table]`;
}
