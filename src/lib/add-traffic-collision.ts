/** Central Traffic Division — Traffic Collision Report (SAHP 555 Page 1). */

export type Gender = "male" | "female" | "";
export type License = "var" | "yok" | "";
export type VehicleDamage = "buyuk" | "kucuk" | "diger" | "yok" | "";

export interface CollisionParty {
  name: string;
  gender: Gender;
  age: string;
  license: License;
  contact: string;
  address: string;
  vehicleModel: string;
  vehicleColor: string;
  plate: string;
  vehicleOwner: string;
  damage: VehicleDamage;
}

export interface CollisionEvidence {
  label: string;
  url: string;
}

export interface TrafficCollisionData {
  /** Başlık: TC — 26-000 */
  titleNo: string;

  location: string;
  date: string;
  time: string;
  incidentReportNo: string;

  photographer: string;
  photographerSerial: string;
  division: string;
  reportNo: string;

  parties: CollisionParty[];

  summary: string;
  summaryParties: string[];
  summaryDamages: string[];
  summaryInjuries: string[];
  evidence: CollisionEvidence[];
}

export const emptyCollisionParty = (): CollisionParty => ({
  name: "",
  gender: "",
  age: "",
  license: "",
  contact: "",
  address: "",
  vehicleModel: "",
  vehicleColor: "",
  plate: "",
  vehicleOwner: "",
  damage: "",
});

export const emptyTrafficCollision = (): TrafficCollisionData => ({
  titleNo: "",
  location: "",
  date: "",
  time: "",
  incidentReportNo: "",
  photographer: "",
  photographerSerial: "",
  division: "CTD",
  reportNo: "",
  parties: [emptyCollisionParty(), emptyCollisionParty()],
  summary: "",
  summaryParties: [""],
  summaryDamages: [""],
  summaryInjuries: [""],
  evidence: [{ label: "", url: "" }],
});

/** Başlık: TC — 26-000 */
export function buildCollisionTitle(d: TrafficCollisionData): string {
  return `TC — 26-${d.titleNo.trim() || "000"}`;
}

const v = (s: string, fallback = "—") => (s.trim() ? s.trim() : fallback);
const cb = (on: boolean) => (on ? "[cbC]" : "[cb]");

const ordinal = (i: number) => `${i + 1}.`;

/** Eski taslaklarla uyumluluk: metin veya dizi kabul eder. */
export const toList = (value: string[] | string | undefined): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return value.split("\n");
  return [""];
};

function bulletList(value: string[] | string | undefined): string {
  const items = toList(value)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!items.length) return "[list]\n[*]\n[/list]";
  return `[list]\n${items.map((s) => `[*]${s}`).join("\n")}\n[/list]`;
}

function partyBlock(p: CollisionParty, index: number): string {
  return `[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]${ordinal(index)} PARTİ ADI SOYADI
${v(p.name)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]CİNSİYETİ
${cb(p.gender === "male")} Erkek ${cb(p.gender === "female")} Kadın[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]YAŞ
${v(p.age)}[/indent][/size][/tdwidth][/table]

[table=#000000,#ffffff][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]SÜRÜCÜ LİSANSI
${cb(p.license === "var")} Var ${cb(p.license === "yok")} Yok[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]İLETİŞİM BİLGİSİ
${v(p.contact)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,right,left,3,1][size=85][indent=2]ADRESİ
${v(p.address)}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]ARAÇ MODELİ
${v(p.vehicleModel)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]RENK
${v(p.vehicleColor)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]PLAKA
${v(p.plate)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]ARAÇ SAHİBİ
${v(p.vehicleOwner)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,4,1][size=85][indent=2]ARAÇ HASARI
${cb(p.damage === "buyuk")} BÜYÜK ${cb(p.damage === "kucuk")} KÜÇÜK ${cb(p.damage === "diger")} DİĞER ${cb(
    p.damage === "yok",
  )} YOK[/indent][/size][/tdwidth]
[/table]`;
}

export function buildTrafficCollisionBBCode(d: TrafficCollisionData): string {
  const parties = d.parties.map((p, i) => partyBlock(p, i)).join("\n\n[br][/br]\n\n");

  const evidence = d.evidence
    .filter((e) => e.label.trim() || e.url.trim())
    .map((e) => `[*][url=${e.url.trim()}]${e.label.trim() || e.url.trim()}[/url]`)
    .join("\n");

  return `[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,15,10]
[left]STATE OF SAN ANDREAS
DEPARTMENT OF SAN ANDREAS HIGHWAY PATROL
[b][size=130]TRAFFIC COLLISION REPORT[/size][/b]
SAHP 555 Page 1 (Rev. 2-25) OPI 060[/left]
[/tdwidth][/table]
[br][/br]

[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,0,0]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2]KONUM BİLGİSİ
${v(d.location)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]TARİH
${v(d.date)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SAAT (2400)
${v(d.time)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]OLAY RAPORU NO.
${v(d.incidentReportNo)}[/indent][/size][/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]FOTOĞRAFLAYAN
${v(d.photographer)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]SERİ NO.
${v(d.photographerSerial)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]DIVISION
${v(d.division)}[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]RAPOR NO.
${v(d.reportNo)}[/indent][/size][/tdwidth][/table][/tdwidth][/table]

[table=#000000,#ffffff][tr]
[tdwidth=#d0dade,#ffffff,top,left,15,10]
${parties}[/tdwidth][/table]

[br][/br]

[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,0,0]
[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2]KISA AÇIKLAMA
[b]KAZA ÖZETİ:[/b]
${v(d.summary)}

[b]PARTİ:[/b]
${bulletList(d.summaryParties)}

[b]HASARLAR:[/b]
${bulletList(d.summaryDamages)}

[b]YARALANMALAR:[/b]
${bulletList(d.summaryInjuries)}
[/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2]KANITLAR
[list]${evidence ? `\n${evidence}` : "[*][url=][/url]"}[/list]
[/indent][/size][/tdwidth]
[/tdwidth][/table][/table]`;
}
