export interface ArrestOfficer {
  name: string;
  serialNo: string;
  division: string;
  assignment: string;
  date: string;
}

export interface ArrestEvidence {
  label: string;
  url: string;
}

export interface ArrestReportData {
  suspectName: string;
  suspectGender: string;
  suspectAge: string;
  suspectOrigin: string;
  location: string;
  penalCode: string;
  date: string;
  time: string;
  officers: ArrestOfficer[];
  description: string;
  evidence: ArrestEvidence[];
}

export const emptyArrestOfficer = (): ArrestOfficer => ({
  name: "",
  serialNo: "",
  division: "",
  assignment: "",
  date: "",
});

export const emptyArrestReport = (): ArrestReportData => ({
  suspectName: "",
  suspectGender: "",
  suspectAge: "",
  suspectOrigin: "",
  location: "",
  penalCode: "",
  date: "",
  time: "",
  officers: [emptyArrestOfficer(), emptyArrestOfficer()],
  description: "",
  evidence: [
    { label: "", url: "" },
    { label: "", url: "" },
  ],
});

export const genderOptions = ["Erkek", "Kadın"];

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const val = (v: string, fallback = "—") => (v.trim() ? esc(v.trim()) : fallback);

const CELL = (width: string) =>
  `<td style="border:1px solid #d0dade;background:#ffffff;vertical-align:top;text-align:left;width:${width};padding:1px">`;

const SPAN = `<span style="font-size:85%;line-height:116%">`;

function cell(width: string, label: string, value: string) {
  return `${CELL(width)}${SPAN}</span><div style="padding-left:2px">${SPAN}${label}<br>\n${value}</span></div></td>`;
}

function sectionOpen(title: string) {
  return `<table border="1"><tbody><tr>
<td style="border:1px solid #ffffff;background:#ffffff;vertical-align:top;text-align:left;width:2%;padding:1px">${SPAN}</span><div style="padding-left:2px">${SPAN}<strong>${title}</strong></span></div>`;
}

function officerRow(o: ArrestOfficer) {
  return `<table border="1"><tbody><tr>
${cell("3%", "ADI SOYADI", val(o.name))}
${cell("1%", "SERİ NO.", val(o.serialNo))}
${cell("1%", "DIVISION", val(o.division, ""))}
${cell("2%", "GÖREVLENDİRME", val(o.assignment, ""))}
${cell("1%", "TARİH", val(o.date, ""))}</tr></tbody></table>`;
}

export function buildArrestReportHtml(data: ArrestReportData) {
  const officers = data.officers.length ? data.officers : [emptyArrestOfficer()];
  const evidence = data.evidence.filter((e) => e.url.trim() || e.label.trim());
  const evidenceItems = (evidence.length ? evidence : [{ label: "", url: "" }])
    .map(
      (e) =>
        `<li><a href="${val(e.url)}" target="_blank">${val(e.label || e.url)}</a></li>`,
    )
    .join("");

  const description = esc(data.description.trim() || "—").replace(/\n/g, "<br>\n");

  return `<head>
    <style>
     table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed; /* Ensures consistent layout */
}

td {
    padding: 5px;
    white-space: normal; /* Allows wrapping to avoid overflow */
    word-wrap: break-word; /* Forces long words to break */
    text-align: left;
}

td div {
    padding-left: 5px;
}

/* Specific column width control */
td[style*="width:2%"] { min-width: 15%; max-width: 20%; }
td[style*="width:1%"] { min-width: 10%; max-width: 15%; }
td[style*="width:3%"] { min-width: 20%; max-width: 25%; }
td[style*="width:4%"] { min-width: 25%; max-width: 30%; }
  
    </style>
</head>


<div class="content"><div style="background-color:white;border:1px solid black;width: 800px; margin: auto;padding:25px">
<span style="color:#000000">
<table border="1"><tbody><tr>
<td style="border:1px solid #ffffff;background:#ffffff;vertical-align:top;text-align:left;width:15%;padding:10px">
<div style="text-align:left"><span style="color:#000000">LOS SANTOS POLICE DEPARTMENT<br>
CITY OF LOS SANTOS<br>
<strong><span style="font-size:130%;line-height:116%">TUTUKLAMA RAPORU</span></strong><br>
FORM 05.02.00</span></div>
</td></tr></tbody></table>

<br>
<br>
<br>
<br>

${sectionOpen("ŞÜPHELİ BİLGİSİ")}
<table border="1"><tbody><tr>
${cell("2%", "ADI SOYADI", val(data.suspectName))}
${cell("1%", "CİNSİYETİ", val(data.suspectGender))}
${cell("1%", "YAŞ", val(data.suspectAge))}
${cell("1%", "KÖKEN", val(data.suspectOrigin))}</tr></tbody></table></td></tr></tbody></table>


${sectionOpen("TUTUKLAMA BİLGİSİ")}
<table border="1"><tbody><tr>
${cell("2%", "KONUM", val(data.location))}
${cell("1%", "CEZA KANUNU", val(data.penalCode))}
${cell("1%", "TARİH", val(data.date, "00/00/0000"))}
${cell("1%", "SAAT", val(data.time, "00:00"))}
</tr></tbody></table></td></tr></tbody></table>

${sectionOpen("PERSONEL BİLGİSİ")}
${officers.map(officerRow).join("\n")}</td></tr></tbody></table>

<table border="1"><tbody><tr>
<td style="border:1px solid #ffffff;background:#ffffff;vertical-align:top;text-align:left;width:2%;padding:1px">${SPAN}</span><div style="padding-left:2px">${SPAN}<strong><span style="color:#000000">AÇIKLAMA</span></strong></span></div>
<table border="1"><tbody><tr>
${CELL("4%")}${SPAN}</span><div style="padding-left:2px">${SPAN}<span style="color:#000000">TANIM<br>
${description}<br>
<br>
<br>
</span></span></div></td></tr></tbody></table>
<table border="1"><tbody><tr>
${CELL("4%")}${SPAN}</span><div style="padding-left:2px">${SPAN}<span style="color:#000000">KANITLAR</span></span>
<ul>
${evidenceItems}</ul>
</div></td>
</tr></tbody></table>
</td></tr></tbody></table></span></div></div>`;
}
