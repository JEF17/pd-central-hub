/** GED/GIT — Subject Identification Card 12.16.09 (12/17) (BBCode). */

export interface SubjectIdCardData {
  cardDate: string;
  name: string;
  alias: string;
  origin: string;
  age: string;
  gender: string;
  address: string;
  phone: string;
  gangAffiliation: string;
  gang: string;
  clique: string;
  features: string;
  summary: string;
  sangangNo: string;
  criteria: string[];
  fiDateTime: string;
  fiCardNo: string;
  fiOfficerName: string;
  fiOfficerSerial: string;
  officerName: string;
  officerSerial: string;
  supervisorName: string;
  supervisorSerial: string;
  detail: string;
  division: string;
}

export const SUBJECT_ORIGINS = ["BEYAZ", "SİYAH", "LATİN", "ASYALI", "DİĞER"] as const;

/** SanGang kriter listesi — BBCode'daki sırayla (sol/sağ kolon dönüşümlü). */
export const SUBJECT_CRITERIA = [
  "ŞÜPHELİ ÇETE ÜYESİ OLDUĞUNU İTİRAF ETTİ",
  "ŞÜPHELİ ÇETE SEMBOLLERİ/EL İŞARETLERİ YAPIYOR",
  "ŞÜPHELİ ÇETE İLİŞKİLİ SUÇLARDAN TUTUKLANDI",
  "ŞÜPHELİ SIKLIKLA ÇETE BÖLGELERİNDE BULUNUYOR",
  "GÜVENİLİR KAYNAK ÇETE ÜYESİ OLDUĞUNU DOĞRULADI",
  "ŞÜPHELİ ÇETE KIYAFETLERİ GİYİYOR",
  "ŞÜPHELİNİN BELGELENMİŞ ÇETE ÜYESİ İLE İLİŞKİSİ VAR",
  "ŞÜPHELİNİN ÇETE DÖVMELERİ BULUNUYOR",
] as const;

const CRITERIA_SPACERS = [
  "______________________--_____",
  "_______________--________",
  "_______-_--_______",
  "_________-________",
];

export const emptySubjectIdCard = (): SubjectIdCardData => ({
  cardDate: "",
  name: "",
  alias: "",
  origin: "BEYAZ",
  age: "",
  gender: "Erkek",
  address: "",
  phone: "",
  gangAffiliation: "",
  gang: "",
  clique: "",
  features: "",
  summary: "",
  sangangNo: "",
  criteria: [],
  fiDateTime: "",
  fiCardNo: "",
  fiOfficerName: "",
  fiOfficerSerial: "",
  officerName: "",
  officerSerial: "",
  supervisorName: "",
  supervisorSerial: "",
  detail: "GED",
  division: "MISN",
});

const v = (input: string, fallback = "—") => (input.trim() ? input.trim() : fallback);

const box = (checked: boolean) => (checked ? "[cbC]" : "[cb]");

/** "GG/AA/YYYY — SSdd" biçiminden tarih ve saati ayırır. */
const splitDateTime = (raw: string): { date: string; time: string } => {
  const value = raw.trim();
  if (!value) return { date: "00/00/0000", time: "00:00" };
  const [datePart = "", timePart = ""] = value.split(/\s*(?:—|-)\s*/);
  const date = datePart || "00/00/0000";
  let time = "00:00";
  if (timePart) {
    const m = /^(\d{1,2}):?(\d{2})$/.exec(timePart.trim());
    if (m?.[1] && m[2]) time = `${m[1].padStart(2, "0")}:${m[2]}`;
  }
  return { date, time };
};

export function buildSubjectIdCardTitle(data: SubjectIdCardData): string {
  const name = data.name.trim() ? data.name.trim().toUpperCase() : "AD SOYAD";
  const date = data.cardDate.trim().split(/\s*(?:—|-)\s*/)[0] || "00/00/0000";
  return `${name} - ${date} (SI Kart)`;
}

export function buildSubjectIdCardBBCode(data: SubjectIdCardData): string {
  const isMale = data.gender.toLowerCase().startsWith("e");
  const isFemale = data.gender.toLowerCase().startsWith("k");
  const affiliation = data.gangAffiliation.toLowerCase();
  const isMember = affiliation.startsWith("üye") || affiliation.startsWith("uye");
  const isAssociate = affiliation.startsWith("bağ") || affiliation.startsWith("bag");
  const checked = new Set(data.criteria);
  const fi = splitDateTime(data.fiDateTime);
  const fiCardNo = data.fiCardNo.trim();

  const criteriaLines = CRITERIA_SPACERS.map((spacer, row) => {
    const left = SUBJECT_CRITERIA[row * 2] ?? "";
    const right = SUBJECT_CRITERIA[row * 2 + 1] ?? "";
    return `${box(checked.has(left))} ${left}[color=transparent]${spacer}[/color]${box(checked.has(right))} ${right}`;
  }).join("\n");

  return `[size=105]LOS SANTOS POLICE DEPARTMENT
[b][size=110]SUBJECT IDENTIFICATION CARD 12.16.09 (12/17)[/size][/b][/size]


[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][b]TEMEL BİLGİLER[/b]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]AD SOYAD
${v(data.name)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]TAKMA AD
${v(data.alias)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]KÖKEN
${v(data.origin, "BEYAZ")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]YAŞ
${v(data.age)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]CİNSİYET
${box(isMale)} Erkek[color=#FFFFFF]___[/color]${box(isFemale)} Kadın[/indent][/size][/tdwidth]
[/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]ADRESİ
${v(data.address)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]TELEFON NO.
${v(data.phone)}[/indent][/size][/tdwidth]
[/table]
[/tdwidth][/table]

[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][b]DETAYLAR[/b]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]ÇETE BAĞLANTISI
${box(isMember)} Üye[color=#FFFFFF]___[/color]${box(isAssociate)} Bağlantılı[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]ÇETE
${v(data.gang)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]KLİK [size=75](Varsa)[/size]
${v(data.clique)}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][indent=2]
[b]BELİRGİN ÖZELLİKLER: YARALAR, DÖVMELER, GÖZLE GÖRÜLEBİLİR FİZİKSEL BİLGİLER[/b]
(( Kayıt edeceğiniz kişinin dövmelerini "/tattoos" ve "/examine" ile doğrulayıp bu bilgilerin ekran görüntüsünü almayı ihmal etmeyin. Bu içeriğe sahip olmayan belgeler onaylanmayacaktır. ))

${v(data.features, "")}

[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,10,1][size=85][indent=2]
[b]OLAY ÖZETİ[/b]
(( Birincil bakış açısıyla yazmayı unutmayın. Devriye başlangıcınıza, devriyenizle ilgili temel bilgilere kısaca değinerek bu kişiyle nasıl karşılaştığınız şeklinde yazabilirsiniz. ))

${v(data.summary, "")}

[/indent][/size][/tdwidth][/table]
[/tdwidth]
[/table]



[table=#d0dade,white][tr][tdwidth=#ffffff,#ffffff,top,left,1,1][b]SANGANG KAYIT NUMARASI:[/b] ${v(data.sangangNo, "00000")} [size=75](Kriterleri karşılıyorsa)[/size]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]${criteriaLines}[/indent][/size][/tdwidth][/table]
[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,7,1][indent=2][b]FI KARTI BİLGİSİ[/b] [size=75](İlk etkileşim farklı birisi tarafından yapıldıysa.)[/size][/indent]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
${fi.date}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SAAT
${fi.time}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]FI KARTI NUMARASI
${fiCardNo ? `[url=${fiCardNo}]${fiCardNo}[/url]` : "[url=—]—[/url]"}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]PERSONEL ADI SOYADI
${v(data.fiOfficerName)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${v(data.fiOfficerSerial)}[/indent][/size][/tdwidth]
[/table]
[/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,7,1][indent=2][b]İDARİ BİLGİLER[/b][/indent]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]PERSONEL ADI SOYADI
${v(data.officerName)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO
${v(data.officerSerial)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]ONAYLAYAN SUPERVISOR
${v(data.supervisorName)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO
${v(data.supervisorSerial, "00000")}[/indent][/size][/tdwidth]
[/table]


[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]DETAIL
${v(data.detail, "GED")}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]DIVISION
${v(data.division, "MISN")}[/indent][/size][/tdwidth]
[/table]
[/tdwidth][/table]`;
}
