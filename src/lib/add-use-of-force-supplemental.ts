/** Kategorik Güç Kullanımı Tamamlayıcı Raporu — Form 06.11.34 (BBCode). Başlığı yoktur. */

export interface UofsEvidence {
  label: string;
  url: string;
}

export const emptyUofsEvidence = (): UofsEvidence => ({ label: "", url: "" });

/** Eski taslaklarda kanıt düz metin olarak saklanmış olabilir. */
const asEvidence = (value: UofsEvidence | string): UofsEvidence =>
  typeof value === "string" ? { label: value, url: value } : value;

export interface UseOfForceSupplementalData {
  officerName: string;
  officerSerial: string;
  officerPosition: string;
  officerDivision: string;
  officerAssignment: string;
  reportDate: string;

  incidentDateTime: string;
  location: string;
  statement: string;

  evidences: UofsEvidence[];
}

export const emptyUseOfForceSupplemental = (): UseOfForceSupplementalData => ({
  officerName: "",
  officerSerial: "",
  officerPosition: "",
  officerDivision: "",
  officerAssignment: "",
  reportDate: "",
  incidentDateTime: "",
  location: "",
  statement: "",
  evidences: [emptyUofsEvidence()],
});

const v = (s: string, fallback = "BURAYA") => (s.trim() ? s.trim() : fallback);

/** "GG/AA/YYYY - SS:DD" biçiminden tarih ve saat kısımlarını ayırır. */
const splitDateTime = (raw: string): { date: string; time: string } => {
  const value = raw.trim();
  if (!value) return { date: "GG/AA/YYYY", time: "SS:DD" };
  const [date, time] = value.split(/\s*-\s*/);
  return { date: date || "GG/AA/YYYY", time: time || "SS:DD" };
};

export function buildUseOfForceSupplementalBBCode(data: UseOfForceSupplementalData): string {
  const { date, time } = splitDateTime(data.incidentDateTime);
  const evidences = (data.evidences?.length ? data.evidences : [emptyUofsEvidence()]).map(asEvidence);
  const evidenceList = evidences
    .map((e) => {
      const label = v(e.label, "KANIT");
      const url = e.url.trim();
      return `[*]${url ? `[url=${url}]${label}[/url]` : label}`;
    })
    .join("\n");

  return `[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,15,10]
[left][color=#000000]LOS SANTOS POLICE DEPARTMENT
CITY OF LOS SANTOS
[size=120][b]KATEGORİK GÜÇ KULLANIMI TAMAMLAYICI RAPORU[/b][/size]
FORM 06.11.34[/color][/left]
[/tdwidth][/table]

[br][/br]

[table=#d0dade,white][tr]

[tdwidth=#ffffff,#ffffff,top,left,2,1][b][color=#000000]PERSONEL BİLGİSİ[/color][/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2][color=#000000]ADI SOYADI
${v(data.officerName)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]SERİ NO.
${v(data.officerSerial, "00000")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]POZİSYON
${v(data.officerPosition)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]DIVISION
${v(data.officerDivision)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][color=#000000]GÖREVLENDİRME
${v(data.officerAssignment, "A")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]TARİH
${v(data.reportDate, "GG/AA/YYYY")}[/color][/indent][/size][/tdwidth][/table]

[/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b]DETAYLAR[/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]AÇIKLAMA
${date} tarihinde, saat ${time}'te, ${v(data.location)} bölgesinde meydana gelen çağrıya ilişkin ${v(data.officerName)} (Seri No. ${v(data.officerSerial, "00000")}) ile iletişime geçildi ve ifadesi alındı. ${v(data.officerName)}, olayı aşağıda belirtildiği şekilde açıkladı:[/indent]

[indent=10]"[i]${v(data.statement, "En fazla 150 kelime olacak şekilde olayı birincil ağızdan aktarın.")}[/i]"[/indent]

[/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]KANITLAR
[list]
${evidenceList}[/list]
[/indent][/size][/tdwidth][/table]
[/tdwidth][/table]`;
}
