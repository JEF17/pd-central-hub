export interface ImpoundOfficer {
  name: string;
  serialNo: string;
  division: string;
  assignment: string;
  date: string;
}

export interface ImpoundReportData {
  violationType: string[]; // Infraction | Misdemeanor | Felony
  officer: ImpoundOfficer;
  vehicleBrand: string;
  vehicleModel: string;
  plate: string;
  suspectName: string;
  suspectGender: string;
  suspectOrigin: string;
  location: string;
  penalCode: string;
  date: string;
  time: string;
  description: string;
}

export const violationTypes = ["Infraction", "Misdemeanor", "Felony"];
export const genderOptions = ["Erkek", "Kadın"];

export const emptyImpoundReport = (): ImpoundReportData => ({
  violationType: [],
  officer: { name: "", serialNo: "", division: "", assignment: "", date: "" },
  vehicleBrand: "",
  vehicleModel: "",
  plate: "",
  suspectName: "",
  suspectGender: "",
  suspectOrigin: "",
  location: "",
  penalCode: "",
  date: "",
  time: "",
  description: "",
});

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const val = (v: string, fallback = "—") => (v.trim() ? esc(v.trim()) : fallback);

const SPAN = `<span style="font-size:85%;line-height:116%">`;
const CELL = (width: string) =>
  `<td style="border:1px solid #d0dade;background:#ffffff;vertical-align:top;text-align:left;width:${width};padding:1px">`;

function cell(width: string, label: string, value: string) {
  return `${CELL(width)}${SPAN}</span><div style="padding-left:2px">${SPAN}<span style="color:#000000">${label}<br>\n${value}</span></span></div></td>`;
}

function sectionOpen(title: string) {
  return `<table border="1"><tbody><tr>
<td style="border:1px solid #ffffff;background:#ffffff;vertical-align:top;text-align:left;width:2%;padding:1px">${SPAN}</span><div style="padding-left:2px">${SPAN}<strong><span style="color:#000000">${title}</span></strong></span></div>`;
}

export const violationTypeList = (v: string[] | string): string[] =>
  Array.isArray(v) ? v : v ? [v] : [];

function checkbox(label: string, selected: boolean) {
  const box = selected ? "☑" : "☐";
  return `<span style="font-size:120%;line-height:116%"><span style="color:#000000">${box}</span></span> <span style="font-size:95%;line-height:116%"><span style="color:#000000">${label}</span></span>`;
}

/** Konu başlığı: "09/08/2026 - JBC 123 - SCOUT" */
export function buildImpoundTitle(data: ImpoundReportData) {
  const date = data.date.trim() || "00/00/0000";
  const plate = data.plate.trim().toUpperCase() || "PLAKA";
  const model = data.vehicleModel.trim().toUpperCase() || "MODEL";
  return `${date} - ${plate} - ${model}`;
}

export function buildImpoundReportHtml(data: ImpoundReportData) {
  const description = esc(data.description.trim() || "—").replace(/\n/g, "<br>\n");
  const o = data.officer;

  return `<div style="background-color:white;border:1px solid black;width: 800px; margin: auto;padding:25px">
<table border="1"><tbody><tr>
<td style="border:1px solid #ffffff;background:#ffffff;vertical-align:top;text-align:left;width:15%;padding:10px">
<div style="text-align:left"><span style="color:#000000">LOS SANTOS POLICE DEPARTMENT<br>
CITY OF LOS SANTOS<br>
<strong><span style="font-size:130%;line-height:116%">ARAÇ EL KOYMA RAPORU</span></strong></span></div>
</td></tr></tbody></table>


<table border="1"><tbody><tr>
<td style="border:1px solid #ffffff;background:#ffffff;vertical-align:top;text-align:left;width:2%;padding:1px"></td>
<td style="border:1px solid #ffffff;background:#ffffff;vertical-align:top;text-align:left;width:2%;padding:1px">${SPAN}</span><div style="padding-left:2px">${SPAN}<span style="color:#000000">İHLAL TÜRÜ</span></span><br>
${checkbox("Infraction", violationTypeList(data.violationType).includes("Infraction"))}<span style="color:#FFFFFF">___</span>${checkbox("Misdemeanor", violationTypeList(data.violationType).includes("Misdemeanor"))}<span style="color:#FFFFFF">___</span>${checkbox("Felony", violationTypeList(data.violationType).includes("Felony"))}</div></td></tr>
</tbody></table>

<table border="1"><tbody><tr>
${cell("3%", "PERSONEL BİLGİSİ", val(o.name))}
${cell("1%", "SERİ NO.", val(o.serialNo))}
${cell("1%", "DIVISION", val(o.division, ""))}
${cell("2%", "GÖREVLENDİRME", val(o.assignment, ""))}
${cell("1%", "TARİH", val(o.date, ""))}</tr></tbody></table>

${sectionOpen("ARAÇ BİLGİSİ")}
<table border="1"><tbody><tr>
${cell("2%", "MARKA", val(data.vehicleBrand.toUpperCase()))}
${cell("1%", "MODEL", val(data.vehicleModel.toUpperCase()))}
${cell("1%", "PLAKA", val(data.plate.toUpperCase()))}</tr></tbody></table></td></tr></tbody></table>

${sectionOpen("ŞÜPHELİ BİLGİSİ")}
<table border="1"><tbody><tr>
${cell("2%", "ADI SOYADI", val(data.suspectName))}
${cell("1%", "CİNSİYETİ", val(data.suspectGender))}
${cell("1%", "KÖKEN", val(data.suspectOrigin))}</tr></tbody></table></td></tr></tbody></table>


${sectionOpen("İHLAL BİLGİSİ")}
<table border="1"><tbody><tr>
${cell("2%", "KONUM", val(data.location))}
${cell("1%", "CEZA KANUNU", val(data.penalCode))}
${cell("1%", "TARİH", val(data.date, "00/00/0000"))}
${cell("1%", "SAAT", val(data.time, "00:00"))}
</tr></tbody></table></td></tr></tbody></table>


${sectionOpen("AÇIKLAMA")}
<table border="1"><tbody><tr>
${CELL("4%")}${SPAN}</span><div style="padding-left:2px">${SPAN}<span style="color:#000000">TANIM<br>
${description}<br>
<br>
</span></span></div></td></tr></tbody></table></td></tr></tbody></table></div>`;
}
