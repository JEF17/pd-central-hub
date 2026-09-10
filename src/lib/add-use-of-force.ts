/** Kategorik Güç Kullanımı Raporu — Form 06.11.33 (BBCode). */

export interface UofOfficer {
  /** Örn: "Sergeant I John Doe" */
  name: string;
  serial: string;
}

export const emptyUofOfficer = (): UofOfficer => ({ name: "", serial: "" });

export interface UseOfForceData {
  /** Başlık numarası, örn: 000 → F000-26 */
  reportNo: string;

  commanderName: string;
  commanderSerial: string;
  commanderPosition: string;
  commanderDivision: string;
  commanderAssignment: string;

  officers: UofOfficer[];

  address: string;
  incidentDateTime: string;

  suspectName: string;
  suspectGender: string;
}

export const emptyUseOfForce = (): UseOfForceData => ({
  reportNo: "",
  commanderName: "",
  commanderSerial: "",
  commanderPosition: "",
  commanderDivision: "",
  commanderAssignment: "",
  officers: [emptyUofOfficer()],
  address: "",
  incidentDateTime: "",
  suspectName: "",
  suspectGender: "",
});

const v = (s: string, fallback = "BURAYA") => (s.trim() ? s.trim() : fallback);

/** Başlık formatı: F000-26 */
export function buildUseOfForceTitle(data: UseOfForceData): string {
  const no = data.reportNo.trim() || "000";
  return `F${no}-26`;
}

export function buildUseOfForceBBCode(data: UseOfForceData): string {
  const officers = data.officers?.length ? data.officers : [emptyUofOfficer()];
  const officerList = officers
    .map((o) => `[*]${v(o.name)} (Seri No. ${v(o.serial, "00000")})`)
    .join("\n");

  return `[table=#000000,#ffffff][tr]
[tdwidth=#ffffff,#ffffff,top,left,15,10]
[left][color=#000000]LOS SANTOS POLICE DEPARTMENT
CITY OF LOS SANTOS
[size=120][b]KATEGORİK GÜÇ KULLANIMI RAPORU[/b][/size]
FORM 06.11.33[/color][/left]
[/tdwidth][/table]

[br][/br]

[table=#d0dade,white][tr]

[tdwidth=#ffffff,#ffffff,top,left,2,1][b][color=#000000]INCIDENT COMMANDER BİLGİSİ[/color][/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2][color=#000000]ADI SOYADI
${v(data.commanderName)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]SERİ NO.
${v(data.commanderSerial, "00000")}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]POZİSYON
${v(data.commanderPosition)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]DIVISION
${v(data.commanderDivision)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][color=#000000]GÖREVLENDİRME
${v(data.commanderAssignment)}[/color][/indent][/size][/tdwidth][/table]

[/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b][color=#000000]DAHİL OLAN PERSONEL BİLGİSİ[/color][/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,3,1][size=85][indent=2][color=#000000][list]${officerList}[/list][/color][/indent][/size][/tdwidth]
[/table]



[/tdwidth][/table]

[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b][color=#000000]ADRES VE TARİH BİLGİSİ[/color][/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][color=#000000]ADRES BİLGİSİ
${v(data.address)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]TARİH BİLGİSİ
${v(data.incidentDateTime, "GG/AA/YYYY - SS:DD")}[/color][/indent][/size][/tdwidth][/table]

[/tdwidth][/table]


[table=#d0dade,white][tr]
[tdwidth=#ffffff,#ffffff,top,left,2,1][b][color=#000000]ŞÜPHELİ BİLGİSİ[/color][/b]

[table=#d0dade,white][tr]
[tdwidth=#d0dade,#ffffff,top,left,2,1][size=85][indent=2][color=#000000]ADI SOYADI
${v(data.suspectName)}[/color][/indent][/size][/tdwidth]
[tdwidth=#d0dade,#ffffff,top,left,1,1][size=85][indent=2][color=#000000]CİNSİYETİ
${v(data.suspectGender)}[/color][/indent][/size][/tdwidth][/table]

[/tdwidth][/table]`;
}
