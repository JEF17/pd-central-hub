export interface IncidentPerson {
  id: string;
  name: string;
  contact: string;
  address: string;
  status: "victim" | "witness" | "";
}

export interface IncidentReportData {
  reportNo: string;
  officerName: string;
  serialNo: string;
  division: string;
  assignment: string;
  date: string;
  incidentDate: string;
  location: string;
  area: string;
  incidentTypes: string[];
  otherType: string;
  people: IncidentPerson[];
  description: string;
  evidence: string[];
  process: string[];
  followUps: string[];
  followUpDb: string;
  followUpOther: string;
  supervisorName: string;
  supervisorSerial: string;
  watchCommanderName: string;
  watchCommanderSerial: string;
}

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

export const processOptions = [
  "Güç Kullanıldı",
  "Tutuklama Yapıldı",
  "Takip Soruşturması Gerekiyor",
  "APB Gerekiyor",
  "Sonuçlandı",
];

export const followUpOptions = [
  "DB",
  "Traffic Division",
  "Area GIT",
  "Area Detective Division",
  "Area Vice",
  "Diğer",
];

export const emptyIncidentReport = (): IncidentReportData => ({
  reportNo: "",
  officerName: "",
  serialNo: "",
  division: "",
  assignment: "",
  date: "",
  incidentDate: "",
  location: "",
  area: "",
  incidentTypes: [],
  otherType: "",
  people: [
    { id: "p1", name: "", contact: "", address: "", status: "" },
  ],
  description: "",
  evidence: ["", "", "", "", ""],
  process: [],
  followUps: [],
  followUpDb: "",
  followUpOther: "",
  supervisorName: "",
  supervisorSerial: "",
  watchCommanderName: "",
  watchCommanderSerial: "",
});

const SEP = "[color=#FFFFFF]___[/color]";
const cb = (checked: boolean) => (checked ? "[cbc]" : "[cb]");
const val = (v: string, fallback = "—") => (v.trim() ? v.trim() : fallback);
const reportNumber = (value: string) => value.trim().replace(/^26-/, "");

/** Konu başlığı: "OR — 09/08/2026 - 12345" */
export function buildIncidentTitle(data: IncidentReportData) {
  return `OR — ${val(data.date, "GG/AA/YYYY")} - ${val(reportNumber(data.reportNo), "00000")}`;
}

export function buildIncidentBBCode(data: IncidentReportData) {
  const typeLine = incidentTypeOptions
    .map((t) => {
      const checked = data.incidentTypes.includes(t);
      const label = t === "Diğer" && data.otherType.trim() ? `Diğer: ${data.otherType.trim()}` : t;
      return `${cb(checked)} ${label}`;
    })
    .join(SEP);

  const peopleBlocks = (data.people.length ? data.people : emptyIncidentReport().people)
    .map(
      (p) => `[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]ADI SOYADI
${val(p.name)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]İLETİŞİM BİLGİSİ [size=80](varsa)[/size]
${val(p.contact)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]ADRESİ [size=80](varsa)[/size]
${val(p.address)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]STATÜ
${cb(p.status === "victim")} MAĞDUR${SEP}${cb(p.status === "witness")} TANIK[/indent][/size][/tdwidth][/table]`,
    )
    .join("\n\n");

  const evidenceItems = data.evidence.filter((e) => e.trim()).length
    ? data.evidence.filter((e) => e.trim()).map((e) => `[*] ${e.trim()}`).join("\n")
    : "[*]\n[*]\n[*]";

  const processList = processOptions
    .map((p) => `[*] ${cb(data.process.includes(p))} ${p}`)
    .join("\n");

  const followUpLine = followUpOptions
    .map((f) => {
      const checked = data.followUps.includes(f);
      if (f === "DB") return `${cb(checked)} DB:[color=#FFFFFF] ${val(data.followUpDb, "X")} [/color]`;
      if (f === "Diğer") return `${cb(checked)} Diğer: [color=#FFFFFF] ${val(data.followUpOther, "X")} [/color]`;
      return `${cb(checked)} ${f}`;
    })
    .join(SEP);

  return `[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][/tdwidth]
[tdwidth=#ffffff,#ffffff,top,left,12,1]
[center][size=125]LOS SANTOS POLICE DEPARTMENT
[b]OLAY RAPORU[/b][/size][/center][/tdwidth]
[tdwidth=#ffffff,#ffffff,top,left,2,1][size=85][indent=2][b]RAPOR NO.[/b]
OR 26-${val(reportNumber(data.reportNo), "0000")}[/indent][/size][/tdwidth]
[/table]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]PERSONEL BİLGİLERİ[/b]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]ADI SOYADI
${val(data.officerName)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${val(data.serialNo, "00000")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${val(data.division)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]GÖREVLENDİRME
${val(data.assignment)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
${val(data.date, "GG/AA/YYYY")}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]OLAY BİLGİLERİ[/b][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]TARİH ve SAAT
${val(data.incidentDate)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]KONUM
${val(data.location)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]BÖLGE
${val(data.area)}[/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][indent=2]OLAY TÜRÜ[/size]
[size=85]${typeLine}[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]DETAYLAR[/b]
${peopleBlocks}

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]AÇIKLAMA
${val(data.description, "BU KISMI DOLDURUN")}




[/indent][/size][/tdwidth][/table]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]KANITLAR
[list]
${evidenceItems}
[/list][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]SÜREÇ[/size]
[size=85][list]
${processList}
[/list][/tdwidth][/table]

[/table][/tdwidth]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]İDARİ BİLGİLER[/b]

[table=#ffffff,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,5,1][size=85][indent=2]TAKİP SORUŞTURMASI[/size]
[size=85]${followUpLine}[/tdwidth][/size][/table]

[/tdwidth][/table]

[table=#ffffff,white][tr]
[tdwidth=#d0dade,#ffffff,middle,left,4,1][size=85][indent=2]FIELD SUPERVISOR İMZASI
[color=#000000]${val(data.supervisorName, "A. SOYADI")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2]SERİ NO.
[color=#000000]${val(data.supervisorSerial, "00000")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,4,1][size=85][indent=2]WATCH COMMANDER İMZASI
[color=#000000]${val(data.watchCommanderName, "A. SOYADI")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,middle,left,1,1][size=85][indent=2]SERİ NO.
[color=#000000]${val(data.watchCommanderSerial, "00000")}[/color][/indent][/size][/tdwidth][/table]
[/tdwidth][/table]
[size=75]Form 03.04.25 (01/26)[/size]`;
}
